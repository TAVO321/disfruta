<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductoResource;
use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $buscar = $request->string('q')->trim()->value();

        $productos = Producto::conRelaciones()
            ->when($buscar, fn ($q) => $q->where(fn ($sub) => $sub
                ->where('nombre', 'like', "%{$buscar}%")
                ->orWhere('slug', 'like', "%{$buscar}%")))
            ->when($request->filled('categoria'), fn ($q) => $q->whereHas(
                'categoria', fn ($sub) => $sub->where('slug', $request->string('categoria'))
            ))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Productos/Index', [
            'productos' => ProductoResource::collection($productos),
            'categorias' => Categoria::orderBy('orden')->get(['id', 'nombre', 'slug']),
            'filtros' => $request->only('q', 'categoria'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Productos/Form', [
            'producto' => null,
            'categorias' => Categoria::orderBy('orden')->get(['id', 'nombre', 'slug']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $this->validar($request);

        $producto = DB::transaction(function () use ($datos, $request) {
            $producto = Producto::create($datos);
            $this->guardarImagenes($request, $producto);

            return $producto;
        });

        return redirect()
            ->route('admin.productos.edit', $producto)
            ->with('success', 'Producto creado.');
    }

    public function edit(Producto $producto): Response
    {
        return Inertia::render('Admin/Productos/Form', [
            'producto' => new ProductoResource($producto->load(['categoria', 'imagenes'])),
            'categorias' => Categoria::orderBy('orden')->get(['id', 'nombre', 'slug']),
        ]);
    }

    public function update(Request $request, Producto $producto): RedirectResponse
    {
        $datos = $this->validar($request, $producto);

        DB::transaction(function () use ($datos, $request, $producto) {
            $this->eliminarImagenes($request);
            $producto->update($datos);
            $this->guardarImagenes($request, $producto);
        });

        return back()->with('success', 'Producto actualizado.');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        foreach ($producto->imagenes as $imagen) {
            Storage::disk('public')->delete($imagen->ruta);
        }

        $producto->delete();

        return back()->with('success', 'Producto eliminado.');
    }

    private function validar(Request $request, ?Producto $producto = null): array
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:120'],
            'categoria_id' => ['required', 'exists:categorias,id'],
            'descripcion_corta' => ['required', 'string', 'max:300'],
            'descripcion' => ['required', 'string'],
            'precio' => ['required', 'numeric', 'min:0', 'max:99999'],
            'precio_antes' => ['nullable', 'numeric', 'min:0', 'max:99999'],
            'presentacion' => ['required', 'string', 'max:60'],
            'nivel_picante' => ['required', 'in:'.implode(',', Producto::NIVELES_PICANTE)],
            'stock' => ['required', 'integer', 'min:0'],
            'stock_minimo' => ['required', 'integer', 'min:0'],
            'peso' => ['required', 'integer', 'min:0'],
            'ingredientes' => ['nullable', 'array'],
            'ingredientes.*' => ['string', 'max:80'],
            'platos_recomendados' => ['nullable', 'array'],
            'platos_recomendados.*' => ['string', 'max:80'],
            'recomendacion_consumo' => ['nullable', 'string', 'max:1000'],
            'conservacion' => ['nullable', 'string', 'max:1000'],
            'insignia' => ['nullable', 'string', 'max:40'],
            'limitado' => ['boolean'],
            'temporada' => ['boolean'],
            'combo' => ['boolean'],
            'destacado' => ['boolean'],
            'activo' => ['boolean'],
            'imagenes' => ['nullable', 'array', 'max:6'],
            'imagenes.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            'imagenes_eliminadas' => ['nullable', 'array'],
            'imagenes_eliminadas.*' => ['integer'],
        ]);

        $datos['slug'] = Producto::generarSlug($datos['nombre'], $producto?->id);
        $datos['limitado'] = (bool) ($datos['limitado'] ?? false);
        $datos['temporada'] = (bool) ($datos['temporada'] ?? false);
        $datos['combo'] = (bool) ($datos['combo'] ?? false);
        $datos['destacado'] = (bool) ($datos['destacado'] ?? false);
        $datos['activo'] = (bool) ($datos['activo'] ?? false);

        unset($datos['imagenes'], $datos['imagenes_eliminadas']);

        return $datos;
    }

    private function guardarImagenes(Request $request, Producto $producto): void
    {
        if (! $request->hasFile('imagenes')) {
            return;
        }

        $orden = $producto->imagenes()->count();

        foreach ($request->file('imagenes') as $archivo) {
            $ruta = $archivo->store('productos', 'public');

            $producto->imagenes()->create([
                'ruta' => $ruta,
                'alt' => $producto->nombre,
                'orden' => $orden++,
            ]);
        }
    }

    private function eliminarImagenes(Request $request): void
    {
        $ids = $request->input('imagenes_eliminadas', []);

        if ($ids === []) {
            return;
        }

        $imagenes = \App\Models\ImagenProducto::whereIn('id', $ids)->get();

        foreach ($imagenes as $imagen) {
            Storage::disk('public')->delete($imagen->ruta);
            $imagen->delete();
        }
    }
}

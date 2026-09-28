<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\TipoPromocion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PromocionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Promociones/Index', [
            'promociones' => Promocion::withCount('productos')
                ->orderByDesc('activa')
                ->orderByDesc('vigente_hasta')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'titulo' => $p->titulo,
                    'descripcion' => $p->descripcion,
                    'tipo' => $p->tipo,
                    'descuento' => $p->descuento,
                    'activa' => (bool) $p->activa,
                    'vigente_desde' => $p->vigente_desde?->toDateString(),
                    'vigente_hasta' => $p->vigente_hasta?->toDateString(),
                    'vigente' => $p->estaVigente(),
                    'productos_total' => $p->productos_count,
                ]),
            'tipos' => TipoPromocion::catalogoCacheado(),
        ]);
    }

    public function create(): Response
    {
        return $this->form(null);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $this->validar($request);
        $productos = $this->productosIds($request);

        $promocion = Promocion::create($datos);
        $promocion->productos()->sync($productos);

        return redirect()
            ->route('admin.promociones.index')
            ->with('success', 'Promocion creada.');
    }

    public function edit(Promocion $promocion): Response
    {
        return $this->form($promocion);
    }

    public function update(Request $request, Promocion $promocion): RedirectResponse
    {
        $promocion->update($this->validar($request));
        $promocion->productos()->sync($this->productosIds($request));

        return redirect()
            ->route('admin.promociones.index')
            ->with('success', 'Promocion actualizada.');
    }

    public function destroy(Promocion $promocion): RedirectResponse
    {
        $promocion->delete();

        return back()->with('success', 'Promocion eliminada.');
    }

    /**
     * El listado solo necesita invertir el estado: update() exige el formulario
     * completo, asi que el toggle no puede pasar por ahi.
     */
    public function alternar(Request $request, Promocion $promocion): RedirectResponse
    {
        $datos = $request->validate([
            'activa' => ['required', 'boolean'],
        ]);

        $promocion->update(['activa' => $datos['activa']]);

        return back()->with('success', $promocion->activa ? 'Promocion activada.' : 'Promocion desactivada.');
    }

    private function form(?Promocion $promocion): Response
    {
        return Inertia::render('Admin/Promociones/Form', [
            'promocion' => $promocion ? [
                'id' => $promocion->id,
                'titulo' => $promocion->titulo,
                'descripcion' => $promocion->descripcion,
                'tipo' => $promocion->tipo,
                'descuento' => $promocion->descuento,
                'activa' => (bool) $promocion->activa,
                'vigente_desde' => $promocion->vigente_desde?->toDateString(),
                'vigente_hasta' => $promocion->vigente_hasta?->toDateString(),
                'productos' => $promocion->productos()->pluck('productos.id')->all(),
            ] : null,
            'tipos' => TipoPromocion::catalogoCacheado(),
            'productos' => Producto::orderBy('nombre')->get(['id', 'nombre', 'precio']),
        ]);
    }

    private function validar(Request $request): array
    {
        $datos = $request->validate([
            'titulo' => ['required', 'string', 'max:120'],
            'descripcion' => ['required', 'string', 'max:500'],
            'tipo' => ['required', Rule::exists('tipos_promocion', 'id')],
            'descuento' => ['required', 'integer', 'min:0', 'max:100'],
            'activa' => ['boolean'],
            'vigente_desde' => ['nullable', 'date'],
            'vigente_hasta' => ['nullable', 'date', 'after:vigente_desde'],
            'productos' => ['nullable', 'array'],
            'productos.*' => ['integer', 'exists:productos,id'],
        ]);

        $datos['activa'] = (bool) ($datos['activa'] ?? false);

        // El campo es nullable: si el formulario lo manda vacio o ni lo manda,
        // la clave no existe y la promocion arranca desde hoy.
        if (($datos['vigente_desde'] ?? null) === null) {
            $datos['vigente_desde'] = now()->toDateString();
        }

        $datos['slug'] = Promocion::generarSlug($datos['titulo'], $request->route('promocion')?->id);

        return $datos;
    }

    private function productosIds(Request $request): array
    {
        $request->validate([
            'productos' => ['nullable', 'array'],
            'productos.*' => ['integer', 'exists:productos,id'],
        ]);

        return $request->input('productos', []);
    }
}

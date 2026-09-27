<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Alta, edicion y orden de las familias del catalogo.
 *
 * La categoria es la que define la paleta de la ilustracion del frasco. Los
 * productos la heredan al crearse, asi que cambiar el color de una familia es
 * cambiar el color de los frascos nuevos de esa familia. Los productos que ya
 * existen conservan el suyo, salvo que se pida aplicar el cambio a todos.
 */
class CategoriaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categorias/Index', [
            'categorias' => Categoria::query()
                ->orderBy('orden')
                ->withCount(['productos' => fn ($q) => $q->where('activo', true)])
                ->get()
                ->map(fn (Categoria $categoria) => [
                    'id' => $categoria->id,
                    'slug' => $categoria->slug,
                    'nombre' => $categoria->nombre,
                    'descripcion' => $categoria->descripcion,
                    'tono' => $categoria->tonoParaProducto(),
                    'orden' => $categoria->orden,
                    'activo' => (bool) $categoria->activo,
                    'productos_count' => $categoria->productos_count,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $this->validar($request);

        $categoria = Categoria::create($datos + [
            'slug' => Categoria::generarSlug($datos['nombre']),
            'orden' => (int) Categoria::max('orden') + 1,
        ]);

        return back()->with('success', "Familia {$categoria->nombre} creada.");
    }

    public function update(Request $request, Categoria $categoria): RedirectResponse
    {
        $categoria->update($this->validar($request, $categoria) + [
            'slug' => Categoria::generarSlug($request->string('nombre')->value(), $categoria->id),
        ]);

        return back()->with('success', "Familia {$categoria->nombre} actualizada.");
    }

    public function destroy(Categoria $categoria): RedirectResponse
    {
        if ($categoria->productos()->exists()) {
            return back()->with(
                'error',
                "No se puede eliminar {$categoria->nombre}: tiene productos. Reasignalos o desactivala primero.",
            );
        }

        $nombre = $categoria->nombre;
        $categoria->delete();

        return back()->with('success', "Familia {$nombre} eliminada.");
    }

    /**
     * Repinta los frascos de una familia con el color que se acaba de elegir.
     *
     * Es una accion aparte y explicita a proposito: guardar la familia no
     * repinta el catalogo entero, porque un producto puede tener su propio tono
     * ajustado a mano. Lo que hace es poner a mano lo que ya se podia haber
     * hecho producto por producto.
     */
    public function aplicarTono(Categoria $categoria): RedirectResponse
    {
        $tono = $categoria->tonoParaProducto();

        $afectados = DB::transaction(function () use ($categoria, $tono) {
            $productos = $categoria->productos();

            $cantidad = (clone $productos)->update(['tono' => $tono]);

            // Los borrados tambien son de la familia y pueden volver.
            $categoria->productos()->onlyTrashed()->update(['tono' => $tono]);

            return $cantidad;
        });

        return back()->with(
            'success',
            $afectados === 1
                ? 'Se repinto 1 producto de la familia.'
                : "Se repintaron {$afectados} productos de la familia.",
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function validar(Request $request, ?Categoria $categoria = null): array
    {
        return $request->validate([
            'nombre' => ['required', 'string', 'max:60', $this->unicidad('nombre', $categoria)],
            'descripcion' => ['nullable', 'string', 'max:300'],
            'orden' => ['nullable', 'integer', 'min:0', 'max:999'],
            'activo' => ['boolean'],
            'tono' => ['nullable', 'array'],
            'tono.fondo' => ['nullable', 'string', 'max:9'],
            'tono.contenido' => ['nullable', 'string', 'max:9'],
            'tono.acento' => ['nullable', 'string', 'max:9'],
            'tono.tapa' => ['nullable', 'string', 'max:9'],
        ]);
    }

    private function unicidad(string $campo, ?Categoria $categoria): \Closure
    {
        return function ($attribute, $value, $fail) use ($campo, $categoria) {
            $repetido = Categoria::query()
                ->where($campo, $value)
                ->when($categoria, fn ($q) => $q->whereKeyNot($categoria->id))
                ->exists();

            if ($repetido) {
                $fail('Ya existe una familia con ese nombre.');
            }
        };
    }
}

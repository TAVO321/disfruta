<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EstadoPedido;
use App\Models\NivelPicante;
use App\Models\Pedido;
use App\Models\Plato;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\TipoPromocion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Los catalogos que se editan desde una sola pantalla: platos, niveles de
 * picante, estados de pedido y tipos de promocion.
 *
 * Los cuatro comparten la misma forma (identificador de texto, nombre, un par
 * de campos propios y un orden), asi que se administran con las mismas rutas y
 * el mismo formulario, variando solo que columnas se editan. Un catalogo nuevo
 * seria otra entrada en CATALOGOS y no un controller mas.
 *
 * Borrar no se permite: el identificador de texto ya esta escrito en los
 * productos, los pedidos y las promociones, y borrarlo dejaria filas
 * apuntando a algo que no existe. Lo que se hace es desactivar, que es lo
 * mismo que ya significa 'activo' en el resto del catalogo.
 */
class CatalogoController extends Controller
{
    /**
     * @var array<string, array{modelo: class-string<Model>, reglas: array<string, mixed>, etiqueta: string}>
     */
    private const CATALOGOS = [
        'platos' => [
            'modelo' => Plato::class,
            'etiqueta' => 'Platos',
            'reglas' => [
                'nombre' => ['required', 'string', 'max:80'],
                'emoji' => ['nullable', 'string', 'max:16'],
            ],
        ],
        'niveles' => [
            'modelo' => NivelPicante::class,
            'etiqueta' => 'Niveles de picante',
            'reglas' => [
                'nombre' => ['required', 'string', 'max:60'],
                'chilis' => ['required', 'integer', 'min:0', 'max:10'],
                'descripcion' => ['nullable', 'string', 'max:160'],
            ],
        ],
        'estados' => [
            'modelo' => EstadoPedido::class,
            'etiqueta' => 'Estados de pedido',
            'reglas' => [
                'nombre' => ['required', 'string', 'max:40'],
                'tono' => ['required', 'string', 'max:20'],
                'es_final' => ['boolean'],
            ],
        ],
        'tipos' => [
            'modelo' => TipoPromocion::class,
            'etiqueta' => 'Tipos de promoción',
            'reglas' => [
                'nombre' => ['required', 'string', 'max:40'],
                'descripcion' => ['nullable', 'string', 'max:160'],
            ],
        ],
    ];

    public function index(): Response
    {
        return Inertia::render('Admin/Catalogos/Index', [
            'catalogos' => collect(self::CATALOGOS)
                ->map(fn (array $config, string $clave) => [
                    'clave' => $clave,
                    'etiqueta' => $config['etiqueta'],
                    'filas' => $config['modelo']::query()->orderBy('orden')->get(),
                ])
                ->values()
                ->all(),
            'productosPorPlato' => $this->productosPorPlato(),
            'productosPorNivel' => $this->productosPorNivel(),
            'pedidosPorEstado' => $this->pedidosPorEstado(),
            'promocionesPorTipo' => $this->promocionesPorTipo(),
        ]);
    }

    public function store(Request $request, string $catalogo): RedirectResponse
    {
        $config = $this->config($catalogo);

        $datos = $this->validar($request, $config);
        $datos['id'] = $this->generarId($request, $config);
        $datos['orden'] = (int) $config['modelo']::max('orden') + 1;

        $config['modelo']::create($datos);

        return back()->with('success', "Fila agregada a {$config['etiqueta']}.");
    }

    public function update(Request $request, string $catalogo, string $id): RedirectResponse
    {
        $config = $this->config($catalogo);
        $fila = $config['modelo']::findOrFail($id);

        $datos = $this->validar($request, $config);

        // El identificador es la clave foranea de productos, pedidos y
        // promociones: cambiarlo haria que dejen de encontrar su fila.
        unset($datos['id']);

        $fila->update($datos);

        return back()->with('success', "Fila actualizada en {$config['etiqueta']}.");
    }

    public function destroy(string $catalogo, string $id): RedirectResponse
    {
        $config = $this->config($catalogo);
        $fila = $config['modelo']::findOrFail($id);

        if ($this->enUso($catalogo, $id) > 0) {
            $fila->update(['activo' => false]);

            return back()->with(
                'error',
                'Ese valor ya lo usan productos o pedidos, asi que se desactivó en vez de eliminarse.',
            );
        }

        $fila->delete();

        return back()->with('success', "Fila eliminada de {$config['etiqueta']}.");
    }

    /**
     * @param  array{modelo: class-string<Model>, reglas: array<string, mixed>, etiqueta: string}  $config
     * @return array<string, mixed>
     */
    private function validar(Request $request, array $config): array
    {
        $datos = $request->validate($config['reglas'] + ['activo' => ['boolean']]);

        $datos['activo'] = (bool) ($datos['activo'] ?? true);

        return $datos;
    }

    /**
     * @param  array{modelo: class-string<Model>, reglas: array<string, mixed>, etiqueta: string}  $config
     */
    private function generarId(Request $request, array $config): string
    {
        $base = Str::slug($request->string('nombre')->value()) ?: 'sin-slug';
        $id = $base;
        $i = 2;

        while ($config['modelo']::whereKey($id)->exists()) {
            $id = "{$base}-{$i}";
            $i++;
        }

        return $id;
    }

    private function enUso(string $catalogo, string $id): int
    {
        return match ($catalogo) {
            'platos' => Producto::query()
                ->whereJsonContains('platos_recomendados', $id)
                ->count(),
            'niveles' => Producto::query()->where('nivel_picante', $id)->count(),
            'estados' => Pedido::query()->where('estado', $id)->count(),
            'tipos' => Promocion::query()->where('tipo', $id)->count(),
            default => 0,
        };
    }

    private function productosPorPlato(): array
    {
        return Producto::query()
            ->whereNotNull('platos_recomendados')
            ->pluck('platos_recomendados')
            ->flatMap(fn ($lista) => $lista ?? [])
            ->countBy()
            ->all();
    }

    private function productosPorNivel(): array
    {
        return Producto::query()
            ->selectRaw('nivel_picante, COUNT(*) as total')
            ->groupBy('nivel_picante')
            ->pluck('total', 'nivel_picante')
            ->all();
    }

    private function pedidosPorEstado(): array
    {
        return Pedido::query()
            ->selectRaw('estado, COUNT(*) as total')
            ->groupBy('estado')
            ->pluck('total', 'estado')
            ->all();
    }

    private function promocionesPorTipo(): array
    {
        return Promocion::query()
            ->selectRaw('tipo, COUNT(*) as total')
            ->groupBy('tipo')
            ->pluck('total', 'tipo')
            ->all();
    }

    /**
     * @return array{modelo: class-string<Model>, reglas: array<string, mixed>, etiqueta: string}
     */
    private function config(string $catalogo): array
    {
        abort_unless(isset(self::CATALOGOS[$catalogo]), 404);

        return self::CATALOGOS[$catalogo];
    }
}

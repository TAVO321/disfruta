<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductoResource;
use App\Http\Resources\PromocionResource;
use App\Models\Categoria;
use App\Models\NivelPicante;
use App\Models\Plato;
use App\Models\Producto;
use App\Models\Promocion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TiendaController extends Controller
{
    private const FACETAS_TTL = 300;

    public function home(): Response
    {
        return Inertia::render('Home', [
            'productos' => ProductoResource::collection(
                Producto::conRelaciones()->activos()->latest()->limit(12)->get()
            ),
            'promociones' => PromocionResource::collection(
                Promocion::vigentes()
                    ->with(['productos' => fn ($q) => $q->conRelaciones()])
                    ->orderByDesc('descuento')
                    ->limit(3)
                    ->get()
            ),
        ]);
    }

    public function catalogo(Request $request): Response
    {
        $filtros = $request->validate([
            'q' => ['nullable', 'string', 'max:80'],
            'categoria' => ['nullable', 'string', 'max:60'],
            'picante' => ['nullable', 'array'],
            'picante.*' => ['string', 'max:20'],
            'plato' => ['nullable', 'array'],
            'plato.*' => ['string', 'max:40'],
            'disponibilidad' => ['nullable', 'in:todas,disponibles,ultimos,agotados'],
            'precio_max' => ['nullable', 'numeric', 'min:0'],
            'orden' => ['nullable', 'in:destacados,precio-asc,precio-desc,nombre,picante'],
            'pagina' => ['nullable', 'integer', 'min:1'],
        ]);

        $buscar = trim($filtros['q'] ?? '');
        $categoria = $filtros['categoria'] ?? null;
        $picantes = $filtros['picante'] ?? [];
        $platos = $filtros['plato'] ?? [];
        $disponibilidad = $filtros['disponibilidad'] ?? 'todas';
        $orden = $filtros['orden'] ?? 'destacados';

        $base = Producto::conRelaciones()->activos();

        $productos = (clone $base)
            ->when($buscar !== '', fn ($q) => $q->where(
                fn ($sub) => $sub->where('nombre', 'like', "%{$buscar}%")
                    ->orWhere('descripcion_corta', 'like', "%{$buscar}%")
                    ->orWhere('ingredientes', 'like', "%{$buscar}%")
            ))
            ->when($categoria, fn ($q) => $q->whereHas('categoria', fn ($sub) => $sub->where('slug', $categoria)))
            ->when($picantes, fn ($q) => $q->whereIn('nivel_picante', $picantes))
            ->when($platos, fn ($q) => $q->where(function ($sub) use ($platos) {
                foreach ($platos as $plato) {
                    $sub->orWhereJsonContains('platos_recomendados', $plato);
                }
            }))
            ->when($disponibilidad === 'disponibles', fn ($q) => $q->where('stock', '>', 0))
            ->when($disponibilidad === 'agotados', fn ($q) => $q->where('stock', '<=', 0))
            ->when($disponibilidad === 'ultimos', fn ($q) => $q->where('stock', '>', 0)->whereColumn('stock', '<=', 'stock_minimo'))
            ->when(isset($filtros['precio_max']), fn ($q) => $q->where('precio', '<=', $filtros['precio_max']))
            ->when($orden === 'precio-asc', fn ($q) => $q->orderBy('precio'))
            ->when($orden === 'precio-desc', fn ($q) => $q->orderByDesc('precio'))
            ->when($orden === 'nombre', fn ($q) => $q->orderBy('nombre'))
            ->when($orden === 'picante', fn ($q) => $q->orderByDesc(
                // El orden lo decide la tabla de niveles, no una lista de ids
                // escrita en el codigo: agregar un nivel no obliga a tocar aca.
                DB::table('niveles_picante')
                    ->select('chilis')
                    ->whereColumn('niveles_picante.id', 'productos.nivel_picante')
                    ->limit(1)
            ))
            ->when($orden === 'destacados', fn ($q) => $q->orderByDesc('destacado')->latest())
            ->paginate(12)
            ->withQueryString();

        $niveles = NivelPicante::catalogoCacheado();
        $listaPlatos = Plato::catalogoCacheado();
        $facetas = static::facetasCatalogo();

        return Inertia::render('Catalogo/Index', [
            'productos' => ProductoResource::collection($productos),
            'platos' => $listaPlatos,
            'niveles' => $niveles,
            'filtros' => [
                'q' => $buscar,
                'categoria' => $categoria,
                'picante' => $picantes,
                'plato' => $platos,
                'disponibilidad' => $disponibilidad,
                'precio_max' => isset($filtros['precio_max']) ? (float) $filtros['precio_max'] : null,
                'orden' => $orden,
            ],
            'precios' => $facetas['precios'],
            'conteos' => [
                'total' => $facetas['total'],
                'categorias' => $facetas['categorias'],
                'picantes' => collect($niveles)
                    ->mapWithKeys(fn ($nivel) => [
                        $nivel['id'] => (int) ($facetas['conteos_por_nivel'][$nivel['id']] ?? 0),
                    ]),
                'platos' => collect($listaPlatos)
                    ->mapWithKeys(fn ($plato) => [
                        $plato['id'] => (int) ($facetas['conteos_por_plato'][$plato['id']] ?? 0),
                    ])
                    ->filter(fn ($n) => $n > 0),
            ],
        ]);
    }

    /**
     * Facetas del catalogo: total, categorias, precios y conteos por nivel y
     * plato. Se cachean unos minutos porque solo cambian cuando varian los
     * productos o categorias; esos modelos invalidan la clave al guardar.
     */
    private static function facetasCatalogo(): array
    {
        return Cache::remember('catalogo:facetas', self::FACETAS_TTL, function () {
            $precios = Producto::activos()
                ->selectRaw('MIN(precio) as minimo, MAX(precio) as maximo')
                ->first();

            return [
                'total' => Producto::activos()->count(),
                'precios' => [
                    'min' => (float) ($precios->minimo ?? 0),
                    'max' => (float) ($precios->maximo ?? 1),
                ],
                'categorias' => Categoria::activas()
                    ->withCount(['productos' => fn ($q) => $q->where('activo', true)])
                    ->orderBy('orden')
                    ->get()
                    ->map(fn ($c) => ['slug' => $c->slug, 'nombre' => $c->nombre, 'total' => $c->productos_count])
                    ->all(),
                'conteos_por_nivel' => Producto::activos()
                    ->selectRaw('nivel_picante, COUNT(*) as total')
                    ->groupBy('nivel_picante')
                    ->pluck('total', 'nivel_picante')
                    ->all(),
                'conteos_por_plato' => Producto::activos()
                    ->whereNotNull('platos_recomendados')
                    ->pluck('platos_recomendados')
                    ->flatMap(fn ($lista) => $lista ?? [])
                    ->countBy()
                    ->all(),
            ];
        });
    }

    public function detalle(Producto $producto): Response
    {
        abort_unless($producto->activo, 404);

        $producto->load(['categoria', 'imagenes', 'lotesDisponibles', 'resenasVisibles', 'promociones']);

        return Inertia::render('Catalogo/Detalle', [
            'producto' => new ProductoResource($producto),
            'relacionados' => ProductoResource::collection(
                Producto::conRelaciones()
                    ->activos()
                    ->where('categoria_id', $producto->categoria_id)
                    ->whereKeyNot($producto->id)
                    ->limit(4)
                    ->get()
            ),
        ]);
    }

    public function promociones(): Response
    {
        return Inertia::render('Promociones', [
            'promociones' => PromocionResource::collection(
                Promocion::vigentes()
                    ->with(['productos' => fn ($q) => $q->conRelaciones()])
                    ->orderByDesc('descuento')
                    ->get()
            ),
            'productos' => ProductoResource::collection(
                Producto::conRelaciones()->activos()->latest()->limit(12)->get()
            ),
        ]);
    }

    public function nosotros(): Response
    {
        // Horario y zonas llegan como props globales desde HandleInertiaRequests.
        return Inertia::render('Nosotros');
    }
}

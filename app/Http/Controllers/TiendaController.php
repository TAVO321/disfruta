<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductoResource;
use App\Http\Resources\PromocionResource;
use App\Lib\NivelPicante;
use App\Lib\Platos;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Promocion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TiendaController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'productos' => ProductoResource::collection(
                Producto::conRelaciones()->activos()->latest()->get()
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
            ->when($orden === 'picante', fn ($q) => $q->orderByRaw(
                "CASE nivel_picante WHEN 'infierno' THEN 4 WHEN 'muy-picante' THEN 3 WHEN 'picante' THEN 2 WHEN 'medio' THEN 1 ELSE 0 END DESC"
            ))
            ->when($orden === 'destacados', fn ($q) => $q->orderByDesc('destacado')->latest())
            ->paginate(12)
            ->withQueryString();

        $niveles = NivelPicante::ids();

        return Inertia::render('Catalogo/Index', [
            'productos' => ProductoResource::collection($productos),
            'platos' => Platos::todos(),
            'niveles' => NivelPicante::todos(),
            'filtros' => [
                'q' => $buscar,
                'categoria' => $categoria,
                'picante' => $picantes,
                'plato' => $platos,
                'disponibilidad' => $disponibilidad,
                'precio_max' => isset($filtros['precio_max']) ? (float) $filtros['precio_max'] : null,
                'orden' => $orden,
            ],
            'precios' => [
                'min' => (float) ($base->min('precio') ?? 0),
                'max' => (float) ($base->max('precio') ?? 1),
            ],
            'conteos' => [
                'total' => (clone $base)->count(),
                'categorias' => Categoria::activas()
                    ->withCount(['productos' => fn ($q) => $q->where('activo', true)])
                    ->orderBy('orden')
                    ->get()
                    ->map(fn ($c) => ['slug' => $c->slug, 'nombre' => $c->nombre, 'total' => $c->productos_count]),
                'picantes' => collect($niveles)
                    ->mapWithKeys(fn ($nivel) => [
                        $nivel => (clone $base)->where('nivel_picante', $nivel)->count(),
                    ]),
                'platos' => collect(Platos::todos())
                    ->mapWithKeys(fn ($plato) => [
                        $plato['id'] => (clone $base)->whereJsonContains('platos_recomendados', $plato['id'])->count(),
                    ])
                    ->filter(fn ($n) => $n > 0),
            ],
        ]);
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
                Producto::conRelaciones()->activos()->latest()->get()
            ),
        ]);
    }

    public function nosotros(): Response
    {
        // Horario y zonas llegan como props globales desde HandleInertiaRequests.
        return Inertia::render('Nosotros');
    }
}

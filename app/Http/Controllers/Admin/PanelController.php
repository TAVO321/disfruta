<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoResource;
use App\Http\Resources\ProductoResource;
use App\Models\Cliente;
use App\Models\EstadoPedido;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Promocion;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PanelController extends Controller
{
    public function index(): Response
    {
        $stockCritico = Producto::activos()
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->conRelaciones()
            ->limit(8)
            ->get();

        // Un solo GROUP BY reemplaza cuatro conteos/sumas por estado.
        $pedidosPorEstado = Pedido::query()
            ->selectRaw('estado, COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN estado NOT IN ("cancelado") THEN total ELSE 0 END) as facturado')
            ->groupBy('estado')
            ->get()
            ->keyBy('estado');

        $contar = fn (string $estado): int => (int) ($pedidosPorEstado[$estado]->total ?? 0);

        return Inertia::render('Admin/Panel', [
            'resumen' => [
                'pedidos_nuevos' => $contar('nuevo'),
                'pedidos_activos' => $contar('nuevo') + $contar('confirmado') + $contar('preparando'),
                'entregados' => $contar('entregado'),
                'facturado' => (float) $pedidosPorEstado->sum('facturado'),
                'productos' => Producto::activos()->count(),
                'clientes' => Cliente::count(),
                'promociones' => Promocion::vigentes()->count(),
            ],
            'ultimos_pedidos' => PedidoResource::collection(
                Pedido::with('items')->latest()->limit(6)->get()
            ),
            'estadosPedido' => EstadoPedido::catalogoCacheado(),
            'stock_critico' => ProductoResource::collection($stockCritico),
            'top_productos' => DB::table('pedido_items')
                ->join('pedidos', 'pedidos.id', '=', 'pedido_items.pedido_id')
                ->whereNotIn('pedidos.estado', ['cancelado'])
                ->selectRaw('pedido_items.nombre, SUM(pedido_items.cantidad) as unidades, SUM(pedido_items.subtotal) as ingresos')
                ->groupBy('pedido_items.nombre')
                ->orderByDesc('unidades')
                ->limit(5)
                ->get(),
        ]);
    }
}

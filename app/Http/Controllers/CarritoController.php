<?php

namespace App\Http\Controllers;

use App\Http\Resources\PedidoResource;
use App\Models\Cliente;
use App\Models\Lote;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CarritoController extends Controller
{
    public function confirmar(Request $request): Response|RedirectResponse
    {
        $datos = $request->validate([
            'cliente' => ['required', 'string', 'max:120'],
            'telefono' => ['required', 'string', 'max:40'],
            'zona' => ['nullable', 'string', 'max:80'],
            'notas' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.producto_id' => ['required', 'integer', 'exists:productos,id'],
            'items.*.cantidad' => ['required', 'integer', 'min:1', 'max:99'],
            'items.*.reserva' => ['required', 'boolean'],
        ]);

        $pedido = DB::transaction(function () use ($datos) {
            $productos = Producto::whereIn('id', collect($datos['items'])->pluck('producto_id'))
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $items = [];
            $total = 0;

            foreach ($datos['items'] as $linea) {
                $producto = $productos[$linea['producto_id']] ?? null;

                if (! $producto || ! $producto->activo) {
                    abort(422, "El producto {$linea['producto_id']} ya no esta disponible.");
                }

                $cantidad = (int) $linea['cantidad'];
                $reserva = (bool) $linea['reserva'];

                if (! $reserva && $producto->stock < $cantidad) {
                    abort(422, "No queda stock de {$producto->nombre}.");
                }

                $subtotal = (float) $producto->precio * $cantidad;
                $total += $subtotal;

                $items[] = [
                    'producto_id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'precio' => $producto->precio,
                    'cantidad' => $cantidad,
                    'reserva' => $reserva,
                    'subtotal' => $subtotal,
                ];

                if (! $reserva) {
                    $this->descontarStock($producto, $cantidad);
                }
            }

            $cliente = Cliente::updateOrCreate(
                ['telefono' => $datos['telefono']],
                ['nombre' => $datos['cliente'], 'zona' => $datos['zona'] ?? null]
            );

            $pedido = Pedido::create([
                'cliente_id' => $cliente->id,
                'cliente_nombre' => $datos['cliente'],
                'telefono' => $datos['telefono'],
                'zona' => $datos['zona'] ?? null,
                'notas' => $datos['notas'] ?? null,
                'estado' => 'nuevo',
                'total' => $total,
            ]);

            $pedido->items()->createMany($items);

            return $pedido;
        });

        // PRG: si se renderiza la vista desde el POST, recargar reenvia el pedido.
        $request->session()->put('pedido_confirmado', $pedido->id);

        return redirect()->route('carrito.confirmado', $pedido);
    }

    /**
     * El carrito vive en el navegador, asi que esta pagina no consulta nada:
     * solo le da una URL propia ademas del panel lateral.
     */
    public function index(): Response
    {
        return Inertia::render('Carrito/Index');
    }

    /**
     * Muestra el resumen del pedido recien confirmado. Solo se puede ver el
     * pedido que esta misma sesion acaba de registrar.
     */
    public function confirmado(Request $request, Pedido $pedido): Response|RedirectResponse
    {
        if ((int) $request->session()->pull('pedido_confirmado') !== $pedido->id) {
            return redirect()->route('catalogo');
        }

        return Inertia::render('Carrito/Confirmado', [
            'pedido' => new PedidoResource($pedido->load('items')),
        ]);
    }

    /**
     * Descuenta el stock vendible del producto y consume los lotes fisicos con
     * FIFO (primero el que vence antes). Si no se descontaran los lotes, el
     * recalculo que hace el panel al editar un lote repondria las unidades ya
     * vendidas.
     *
     * Un producto puede no tener ningun lote registrado: los que se cargan
     * desde el panel nacen con stock pero sin inventario fisico, y tampoco los
     * productos de promocion. En ese caso no hay nada que consumir y la venta
     * sigue igual: solo baja el stock del producto. Antes esto abortaba con un
     * 422 y el cliente se quedaba sin pedido.
     */
    private function descontarStock(Producto $producto, int $cantidad): void
    {
        $producto->decrement('stock', $cantidad);

        $lotes = Lote::where('producto_id', $producto->id)
            ->where('restante', '>', 0)
            ->orderBy('fecha_consumo_recomendado')
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        if ($lotes->isEmpty()) {
            return;
        }

        $pendiente = $cantidad;

        foreach ($lotes as $lote) {
            if ($pendiente <= 0) {
                break;
            }

            $tomado = min($lote->restante, $pendiente);
            $lote->decrement('restante', $tomado);
            $pendiente -= $tomado;
        }

        // Si los lotes registrados no cubren la venta, el stock del producto y el
        // inventario fisico quedarian desfasados: se revierte toda la
        // transaccion. Solo aplica cuando el producto si tiene lotes.
        if ($pendiente > 0) {
            abort(422, "No hay lotes suficientes de {$producto->nombre}.");
        }
    }
}

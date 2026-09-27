<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PedidoResource;
use App\Models\EstadoPedido;
use App\Models\Pedido;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PedidoController extends Controller
{
    public function index(Request $request): Response
    {
        $pedidos = Pedido::with('items')
            ->estado($request->string('estado')->value() ?: null)
            ->when($request->filled('q'), fn ($q) => $q->where(fn ($sub) => $sub
                ->where('cliente_nombre', 'like', "%{$request->string('q')->value()}%")
                ->orWhere('telefono', 'like', "%{$request->string('q')->value()}%")))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Pedidos/Index', [
            'pedidos' => PedidoResource::collection($pedidos),
            'estados' => EstadoPedido::catalogo(),
            'filtros' => $request->only('q', 'estado'),
        ]);
    }

    public function estado(Request $request, Pedido $pedido): RedirectResponse
    {
        $datos = $request->validate([
            'estado' => ['required', Rule::exists('estados_pedido', 'id')],
        ]);

        $pedido->update($datos);

        return back()->with('success', "Pedido #{$pedido->id} marcado como {$datos['estado']}.");
    }

    public function destroy(Pedido $pedido): RedirectResponse
    {
        $pedido->delete();

        return back()->with('success', 'Pedido eliminado.');
    }
}

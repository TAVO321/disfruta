<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        $clientes = Cliente::buscar($request->string('q')->value())
            ->withCount('pedidos')
            ->withSum(['pedidos as gastado' => fn ($q) => $q->whereNotIn('estado', ['cancelado'])], 'total')
            ->withMax('pedidos', 'created_at')
            ->orderByDesc('pedidos_count')
            ->orderBy('nombre')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Clientes/Index', [
            'clientes' => $clientes->through(fn (Cliente $c) => [
                'id' => $c->id,
                'nombre' => $c->nombre,
                'telefono' => $c->telefono,
                'zona' => $c->zona,
                'pedidos' => $c->pedidos_count,
                'gastado' => (float) ($c->gastado ?? 0),
                'ultimo' => $c->max_created_at,
            ]),
            'filtros' => $request->only('q'),
        ]);
    }

    public function destroy(Cliente $cliente): RedirectResponse
    {
        $cliente->delete();

        return back()->with('success', 'Cliente eliminado.');
    }
}

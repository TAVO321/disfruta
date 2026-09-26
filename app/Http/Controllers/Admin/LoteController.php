<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoteResource;
use App\Models\Lote;
use App\Models\Producto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoteController extends Controller
{
    public function index(Request $request): Response
    {
        $lotes = Lote::with('producto:id,nombre,slug')
            ->when($request->filled('producto'), fn ($q) => $q->where('producto_id', $request->integer('producto')))
            ->when($request->boolean('agotados'), fn ($q) => $q->where('restante', '<=', 0))
            ->orderBy('fecha_consumo_recomendado')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Lotes/Index', [
            'lotes' => LoteResource::collection($lotes),
            'productos' => Producto::orderBy('nombre')->get(['id', 'nombre']),
            'filtros' => $request->only('producto', 'agotados'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'producto_id' => ['required', 'exists:productos,id'],
            'codigo' => ['required', 'string', 'max:40'],
            'fecha_elaboracion' => ['required', 'date'],
            'fecha_consumo_recomendado' => ['required', 'date', 'after:fecha_elaboracion'],
            'cantidad' => ['required', 'integer', 'min:1', 'max:9999'],
        ]);

        $lote = Lote::create($datos + ['restante' => $datos['cantidad']]);

        $this->sincronizarStock($lote->producto_id);

        return back()->with('success', "Lote {$lote->codigo} registrado.");
    }

    public function update(Request $request, Lote $lote): RedirectResponse
    {
        $datos = $request->validate([
            'codigo' => ['required', 'string', 'max:40'],
            'fecha_elaboracion' => ['required', 'date'],
            'fecha_consumo_recomendado' => ['required', 'date', 'after:fecha_elaboracion'],
            'restante' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);

        $lote->update($datos);

        $this->sincronizarStock($lote->producto_id);

        return back()->with('success', 'Lote actualizado.');
    }

    public function destroy(Lote $lote): RedirectResponse
    {
        $productoId = $lote->producto_id;
        $lote->delete();

        $this->sincronizarStock($productoId);

        return back()->with('success', 'Lote eliminado.');
    }

    private function sincronizarStock(int $productoId): void
    {
        Producto::whereKey($productoId)->update([
            'stock' => Lote::where('producto_id', $productoId)->sum('restante'),
        ]);
    }
}

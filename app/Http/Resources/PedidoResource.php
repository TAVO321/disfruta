<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cliente' => $this->cliente_nombre,
            'telefono' => $this->telefono,
            'zona' => $this->zona,
            'notas' => $this->notas,
            'estado' => $this->estado,
            'total' => (float) $this->total,
            'creado' => $this->created_at?->toIso8601String(),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'productoId' => $item->producto_id,
                'nombre' => $item->nombre,
                'precio' => (float) $item->precio,
                'cantidad' => $item->cantidad,
                'reserva' => (bool) $item->reserva,
                'subtotal' => (float) $item->subtotal,
            ])),
        ];
    }
}

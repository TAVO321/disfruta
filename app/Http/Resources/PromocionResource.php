<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromocionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'slug' => $this->slug,
            'descripcion' => $this->descripcion,
            'tipo' => $this->tipo,
            'descuento' => $this->descuento,
            'activa' => (bool) $this->activa,
            'vigenteDesde' => $this->vigente_desde?->toDateString(),
            'vigenteHasta' => $this->vigente_hasta?->toDateString(),
            'vigente' => $this->estaVigente(),
            'productos' => $this->whenLoaded('productos', fn () => ProductoResource::collection($this->productos)),
        ];
    }
}

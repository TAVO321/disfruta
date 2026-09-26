<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'fechaElaboracion' => $this->fecha_elaboracion?->toDateString(),
            'fechaConsumoRecomendado' => $this->fecha_consumo_recomendado?->toDateString(),
            'cantidad' => $this->cantidad,
            'restante' => $this->restante,
            'producto' => $this->whenLoaded('producto', fn () => [
                'id' => $this->producto->id,
                'nombre' => $this->producto->nombre,
                'slug' => $this->producto->slug,
            ]),
        ];
    }
}

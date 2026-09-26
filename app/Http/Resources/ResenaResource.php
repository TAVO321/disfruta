<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResenaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'autor' => $this->autor,
            'estrellas' => $this->estrellas,
            'texto' => $this->texto,
            'fecha' => $this->created_at?->toDateString(),
        ];
    }
}

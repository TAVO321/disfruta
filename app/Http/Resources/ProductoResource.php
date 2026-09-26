<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Serializa un producto con las mismas claves camelCase que usa el frontend
 * React, para que los componentes existentes no necesiten capa de traduccion.
 */
class ProductoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // El detalle se detecta por la ruta o por tener cargados los lotes
        // disponibles. El panel tambien necesita los textos largos para poder
        // editar el producto sin perderlos al guardar.
        $detalle = $request->routeIs('catalogo.detalle')
            || $request->routeIs('admin.productos.*')
            || $this->relationLoaded('lotesDisponibles');

        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'slug' => $this->slug,
            'categoria' => $this->whenLoaded('categoria', fn () => [
                'id' => $this->categoria->id,
                'slug' => $this->categoria->slug,
                'nombre' => $this->categoria->nombre,
            ]),
            'precio' => (float) $this->precio,
            'precioAntes' => $this->precio_antes !== null ? (float) $this->precio_antes : null,
            'descripcionCorta' => $this->descripcion_corta,
            'descripcion' => $detalle ? $this->descripcion : null,
            'presentacion' => $this->presentacion,
            'nivelPicante' => $this->nivel_picante,
            'stock' => $this->stock,
            'stockMinimo' => $this->stock_minimo,
            'activo' => (bool) $this->activo,
            'destacado' => (bool) $this->destacado,
            'limitado' => (bool) $this->limitado,
            'temporada' => (bool) $this->temporada,
            'combo' => (bool) $this->combo,
            'insignia' => $this->insignia,
            'peso' => $this->peso,
            'ingredientes' => $detalle ? ($this->ingredientes ?? []) : [],
            'platosRecomendados' => $this->platos_recomendados ?? [],
            'recomendacionConsumo' => $detalle ? $this->recomendacion_consumo : null,
            'conservacion' => $detalle ? $this->conservacion : null,
            'disponible' => $this->stock > 0,
            'imagen' => $this->whenLoaded('imagenes', fn () => $this->imagenes->first()?->url),
            'gallery' => $this->whenLoaded('imagenes', fn () => $this->imagenes->pluck('url')->all()),
            // Solo llega en el panel: la tienda usa `gallery` (URLs sueltas).
            'imagenesAdmin' => $this->whenLoaded('imagenes', fn () => $this->imagenes
                ->map(fn ($imagen) => ['id' => $imagen->id, 'url' => $imagen->url])
                ->values()
                ->all()),
            'tono' => $this->tono,
            'lotes' => $this->whenLoaded(
                'lotesDisponibles',
                fn () => LoteResource::collection($this->lotesDisponibles)
            ),
            'resenas' => $this->whenLoaded('resenasVisibles', fn () => ResenaResource::collection($this->resenasVisibles)),
            'creado' => $this->created_at?->toDateString(),
        ];
    }
}

<?php

namespace App\Models;

use App\Models\Concerns\CatalogoCacheable;
use Illuminate\Database\Eloquent\Model;

/**
 * Estado por el que pasa un pedido. Antes la lista vivia en Pedido::ESTADOS y
 * otra copia con los nombres y colores del badge estaba en
 * resources/js/lib/config.js.
 *
 * La clave primaria es el texto que guardan los pedidos en estado.
 */
class EstadoPedido extends Model
{
    use CatalogoCacheable;

    protected $table = 'estados_pedido';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'nombre', 'tono', 'orden', 'activo', 'es_final'];

    protected function casts(): array
    {
        return [
            'orden' => 'integer',
            'activo' => 'boolean',
            'es_final' => 'boolean',
        ];
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true)->orderBy('orden');
    }

    /**
     * Estados que todavia admiten un cambio. Los finales, como entregado o
     * cancelado, quedan fuera del selector del panel.
     */
    public function scopeEditables($query)
    {
        return $query->where('activo', true)->where('es_final', false)->orderBy('orden');
    }

    /**
     * Catalogo que se comparte al frontend como prop de Inertia.
     */
    public static function catalogo(): array
    {
        return static::query()->activos()->get(['id', 'nombre', 'tono', 'orden'])
            ->map(fn (self $e) => $e->only(['id', 'nombre', 'tono', 'orden']))
            ->all();
    }
}

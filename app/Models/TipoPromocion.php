<?php

namespace App\Models;

use App\Models\Concerns\CatalogoCacheable;
use Illuminate\Database\Eloquent\Model;

/**
 * Tipo de una promocion. Antes la lista vivia en Promocion::TIPOS.
 *
 * La clave primaria es el texto que guardan las promociones en tipo. El tipo
 * 'limitado' no estaba en esa lista y hay promociones con el, por lo que
 * editarlas fallaba la validacion; se sumo al catalogo.
 */
class TipoPromocion extends Model
{
    use CatalogoCacheable;

    protected $table = 'tipos_promocion';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'nombre', 'descripcion', 'orden', 'activo'];

    protected function casts(): array
    {
        return [
            'orden' => 'integer',
            'activo' => 'boolean',
        ];
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true)->orderBy('orden');
    }

    /**
     * Catalogo que se comparte al frontend como prop de Inertia.
     */
    public static function catalogo(): array
    {
        return static::query()->activos()->get(['id', 'nombre', 'descripcion', 'orden'])
            ->map(fn (self $t) => $t->only(['id', 'nombre', 'descripcion', 'orden']))
            ->all();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Plato con el que se recomienda un producto. Antes vivia en app/Lib/Platos
 * como array fijo; ahora se edita desde el panel.
 *
 * La clave primaria es el texto que guardan los productos en
 * platos_recomendados, no un id numerico.
 */
class Plato extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'nombre', 'emoji', 'orden', 'activo'];

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
     * Catalogo que se comparte al frontend como prop de Inertia. El frontend
     * filtra por id y muestra nombre y emoji; `orden` solo ordena la consulta.
     */
    public static function catalogo()
    {
        return static::query()->activos()->get(['id', 'nombre', 'emoji']);
    }
}

<?php

namespace App\Models;

use App\Models\Concerns\CatalogoCacheable;
use Illuminate\Database\Eloquent\Model;

/**
 * Nivel de picante de un producto. Antes vivia en app/Lib/NivelPicante y en
 * una copia de Producto::NIVELES_PICANTE, que era la que validaba.
 *
 * La clave primaria es el texto que guardan los productos en nivel_picante.
 */
class NivelPicante extends Model
{
    use CatalogoCacheable;

    protected $table = 'niveles_picante';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'nombre', 'chilis', 'descripcion', 'orden', 'activo'];

    protected function casts(): array
    {
        return [
            'chilis' => 'integer',
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
     * busca el nivel por id y dibuja tantos chilis como indique, asi que `orden`
     * solo hace falta para ordenar la consulta y `descripcion` no se usa.
     */
    public static function catalogo(): array
    {
        return static::query()->activos()->get(['id', 'nombre', 'chilis'])
            ->map(fn (self $n) => $n->only(['id', 'nombre', 'chilis']))
            ->all();
    }
}

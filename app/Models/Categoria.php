<?php

namespace App\Models;

use App\Models\Concerns\GeneraSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    use GeneraSlug, HasFactory;

    protected $fillable = ['slug', 'nombre', 'descripcion', 'tono', 'orden', 'activo'];

    protected function casts(): array
    {
        return [
            'tono' => 'array',
            'orden' => 'integer',
            'activo' => 'boolean',
        ];
    }

    /**
     * Paleta con la que nacen los productos de esta familia. Si la categoria no
     * tiene tono propio se cae al color de la marca, para que el frasco nunca
     * se quede sin pintar.
     */
    public function tonoParaProducto(): array
    {
        return $this->tono ?: Producto::TONO_POR_DEFECTO;
    }

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }

    public function scopeActivas($query)
    {
        return $query->where('activo', true)->orderBy('orden');
    }
}

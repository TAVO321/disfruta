<?php

namespace App\Models;

use App\Models\Concerns\CatalogoCacheable;
use App\Models\Concerns\GeneraSlug;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Categoria extends Model
{
    use CatalogoCacheable, GeneraSlug, HasFactory;

    protected $fillable = ['slug', 'nombre', 'descripcion', 'tono', 'orden', 'activo'];

    protected function casts(): array
    {
        return [
            'tono' => 'array',
            'orden' => 'integer',
            'activo' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('catalogo:facetas'));
        static::deleted(fn () => Cache::forget('catalogo:facetas'));
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

    /**
     * Catalogo que se comparte al frontend como prop de Inertia.
     */
    public static function catalogo(): array
    {
        return static::activas()
            ->get(['id', 'slug', 'nombre', 'tono'])
            ->map(fn (self $c) => $c->only(['id', 'slug', 'nombre', 'tono']))
            ->all();
    }

    public function scopeActivas($query)
    {
        return $query->where('activo', true)->orderBy('orden');
    }
}

<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\Cache;

/**
 * Cachea el catalogo inmutable de un modelo y lo invalida automaticamente al
 * guardar o eliminar registros. Cada modelo que use este trait debe definir un
 * metodo estatico catalogo() que devuelva la coleccion que se quiere cachear.
 */
trait CatalogoCacheable
{
    abstract public static function catalogo(): array;

    public static function cacheKeyCatalogo(): string
    {
        return 'catalogo:'.(new static)->getTable();
    }

    public static function catalogoCacheado(int $ttl = 3600): array
    {
        return Cache::remember(static::cacheKeyCatalogo(), $ttl, fn () => static::catalogo());
    }

    public static function olvidarCatalogoCache(): void
    {
        Cache::forget(static::cacheKeyCatalogo());
    }

    protected static function bootCatalogoCacheable(): void
    {
        static::saved(fn () => static::olvidarCatalogoCache());
        static::deleted(fn () => static::olvidarCatalogoCache());
    }
}

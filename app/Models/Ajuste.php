<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Ajuste extends Model
{
    /** Segundos que vive el mapa de ajustes en cache. */
    public const TTL = 3600;

    public $timestamps = false;

    protected $fillable = ['clave', 'valor'];

    /**
     * El whatsapp, las zonas de entrega y el horario viajan en las props
     * globales, asi que se leen en cada pagina. Cacheando cada clave por
     * separado, el store de base de datos hacia una consulta por clave en cada
     * request; cacheando el mapa entero es una sola, y se invalida junto al
     * guardar cualquier ajuste. Quien necesite varias claves en el mismo
     * request debe llamar a esta una vez y leer el array.
     *
     * @return array<string, string>
     */
    public static function todos(): array
    {
        return Cache::remember('ajustes', self::TTL, fn () => static::pluck('valor', 'clave')->all());
    }

    public static function valor(string $clave, mixed $porDefecto = null): mixed
    {
        return static::todos()[$clave] ?? $porDefecto;
    }

    public static function guardar(string $clave, mixed $valor): void
    {
        static::updateOrCreate(['clave' => $clave], ['valor' => $valor]);
        Cache::forget('ajustes');
    }
}

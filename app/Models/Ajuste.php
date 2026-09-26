<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Ajuste extends Model
{
    public $timestamps = false;

    protected $fillable = ['clave', 'valor'];

    public static function valor(string $clave, mixed $porDefecto = null): mixed
    {
        return Cache::remember("ajuste.{$clave}", 3600, function () use ($clave, $porDefecto) {
            $valor = static::where('clave', $clave)->value('valor');

            return $valor ?? $porDefecto;
        });
    }

    public static function guardar(string $clave, mixed $valor): void
    {
        static::updateOrCreate(['clave' => $clave], ['valor' => $valor]);
        Cache::forget("ajuste.{$clave}");
    }
}

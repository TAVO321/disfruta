<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait GeneraSlug
{
    public static function generarSlug(string $texto, ?int $ignorarId = null): string
    {
        $base = Str::slug($texto) ?: 'sin-slug';
        $slug = $base;
        $i = 2;

        while (static::conBorrados()
            ->where('slug', $slug)
            ->when($ignorarId, fn ($q) => $q->whereKeyNot($ignorarId))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    private static function conBorrados(): Builder
    {
        $query = static::query();

        return in_array(SoftDeletes::class, class_uses_recursive(static::class), true)
            ? $query->withTrashed()
            : $query;
    }
}

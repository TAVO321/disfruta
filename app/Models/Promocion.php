<?php

namespace App\Models;

use App\Models\Concerns\GeneraSlug;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Promocion extends Model
{
    use GeneraSlug, HasFactory;

    protected $table = 'promociones';

    public const TIPOS = ['oferta', 'combo', 'temporada'];

    protected $fillable = [
        'titulo', 'slug', 'descripcion', 'tipo',
        'descuento', 'activa', 'vigente_desde', 'vigente_hasta',
    ];

    protected function casts(): array
    {
        return [
            'descuento' => 'integer',
            'activa' => 'boolean',
            'vigente_desde' => 'date',
            'vigente_hasta' => 'date',
        ];
    }

    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(Producto::class, 'promocion_producto');
    }

    public function scopeVigentes(Builder $query): Builder
    {
        $hoy = now()->toDateString();

        return $query->where('activa', true)
            ->where(fn ($q) => $q->whereNull('vigente_desde')->orWhere('vigente_desde', '<=', $hoy))
            ->where(fn ($q) => $q->whereNull('vigente_hasta')->orWhere('vigente_hasta', '>=', $hoy));
    }

    public function estaVigente(): bool    {
        $hoy = now()->startOfDay();

        return $this->activa
            && ($this->vigente_desde === null || $this->vigente_desde->startOfDay()->lte($hoy))
            && ($this->vigente_hasta === null || $this->vigente_hasta->endOfDay()->gte($hoy));
    }
}

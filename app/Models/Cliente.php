<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'telefono', 'zona', 'notas'];

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class);
    }

    public function scopeBuscar(Builder $query, ?string $termino): Builder
    {
        if (blank($termino)) {
            return $query;
        }

        return $query->where(fn ($q) => $q
            ->where('nombre', 'like', "%{$termino}%")
            ->orWhere('telefono', 'like', "%{$termino}%"));
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id', 'cliente_nombre', 'telefono', 'zona',
        'notas', 'estado', 'total',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PedidoItem::class);
    }

    public function scopeEstado(Builder $query, ?string $estado): Builder
    {
        return $estado ? $query->where('estado', $estado) : $query;
    }

    public function getCantidadItemsAttribute(): int
    {
        return (int) $this->items()->sum('cantidad');
    }
}

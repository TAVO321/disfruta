<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lote extends Model
{
    use HasFactory;

    protected $fillable = [
        'producto_id', 'codigo', 'fecha_elaboracion',
        'fecha_consumo_recomendado', 'cantidad', 'restante',
    ];

    protected function casts(): array
    {
        return [
            'fecha_elaboracion' => 'date',
            'fecha_consumo_recomendado' => 'date',
            'cantidad' => 'integer',
            'restante' => 'integer',
        ];
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function getAgotadoAttribute(): bool
    {
        return $this->restante <= 0;
    }
}

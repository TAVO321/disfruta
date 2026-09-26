<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'pedido_id', 'producto_id', 'nombre', 'precio', 'cantidad', 'reserva', 'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'cantidad' => 'integer',
            'reserva' => 'boolean',
        ];
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }
}

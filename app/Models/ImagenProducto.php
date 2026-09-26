<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ImagenProducto extends Model
{
    use HasFactory;

    protected $table = 'imagenes_producto';

    protected $fillable = ['producto_id', 'ruta', 'alt', 'orden'];

    protected function casts(): array
    {
        return ['orden' => 'integer'];
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    protected function url(): Attribute
    {
        return Attribute::get(fn () => $this->ruta ? Storage::disk('public')->url($this->ruta) : null);
    }
}

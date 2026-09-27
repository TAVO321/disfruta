<?php

namespace App\Models;

use App\Models\Concerns\GeneraSlug;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use GeneraSlug, HasFactory, SoftDeletes;

    /**
     * Paleta de la ilustracion del frasco para productos sin tono propio.
     * La columna es nullable y, aunque el formulario del panel la puede
     * editar, lo normal es que la herede de su categoria; esta paleta es el
     * ultimo recurso para que un frasco nunca se quede sin pintar.
     */
    public const TONO_POR_DEFECTO = [
        'fondo' => '#EFE3CC',
        'contenido' => '#D9A441',
        'acento' => '#A8762B',
        'tapa' => '#1F3D2B',
    ];

    protected $fillable = [
        'categoria_id', 'nombre', 'slug', 'descripcion_corta', 'descripcion',
        'precio', 'precio_antes', 'presentacion', 'nivel_picante', 'stock',
        'stock_minimo', 'peso', 'ingredientes', 'platos_recomendados',
        'recomendacion_consumo', 'conservacion', 'insignia', 'limitado',
        'temporada', 'combo', 'destacado', 'activo', 'tono',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'precio_antes' => 'decimal:2',
            'stock' => 'integer',
            'stock_minimo' => 'integer',
            'peso' => 'integer',
            'ingredientes' => 'array',
            'platos_recomendados' => 'array',
            'tono' => 'array',
            'limitado' => 'boolean',
            'temporada' => 'boolean',
            'combo' => 'boolean',
            'destacado' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(ImagenProducto::class)->orderBy('orden');
    }

    public function lotes(): HasMany
    {
        return $this->hasMany(Lote::class);
    }

    public function lotesDisponibles(): HasMany
    {
        return $this->lotes()->where('restante', '>', 0)->orderBy('fecha_consumo_recomendado');
    }

    public function resenas(): HasMany
    {
        return $this->hasMany(Resena::class);
    }

    public function resenasVisibles(): HasMany
    {
        return $this->resenas()->where('visible', true)->latest();
    }

    public function promociones(): BelongsToMany
    {
        // La tabla pivot se llama promocion_producto (ver migracion). Sin el
        // nombre explicito Laravel inferiria producto_promocion por orden
        // alfabetico y la consulta fallaria.
        return $this->belongsToMany(Promocion::class, 'promocion_producto');
    }

    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    public function scopeDestacados(Builder $query): Builder
    {
        return $query->where('destacado', true);
    }

    public function scopeConRelaciones(Builder $query): Builder
    {
        return $query->with(['categoria', 'imagenes']);
    }

    public function getImagenPrincipalAttribute(): ?string
    {
        return $this->imagenes->first()?->url;
    }

    public function getDisponibleAttribute(): bool
    {
        return $this->activo && $this->stock > 0;
    }
}

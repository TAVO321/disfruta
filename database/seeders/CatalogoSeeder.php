<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Lote;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\Resena;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CatalogoSeeder extends Seeder
{
    private const CATEGORIAS = [
        'encurtidos' => ['Encurtidos', 'Cebollas, ajos y verduras en vinagre.'],
        'escabechos' => ['Escabechos', 'Conservas en vinagre, aceite y especias.'],
        'picantes' => ['Picantes', 'Del suave al que deja memoria.'],
        'ajos' => ['Ajos', 'Ajo encurtido y en aceite de oliva.'],
        'combos' => ['Combos', 'Packs de assorted para compartir.'],
    ];

    public function run(): void
    {
        $productos = json_decode(file_get_contents(database_path('seeders/data/catalogo.json')), true);
        $contenido = json_decode(file_get_contents(database_path('seeders/data/contenido.json')), true);

        $categorias = collect(self::CATEGORIAS)
            ->map(fn ($datos, $slug) => Categoria::create([
                'slug' => $slug,
                'nombre' => $datos[0],
                'descripcion' => $datos[1],
                'orden' => array_search($slug, array_keys(self::CATEGORIAS), true),
                'activo' => true,
            ]))
            ->keyBy('slug');

        $porIdAntiguo = collect();

        foreach ($productos as $datos) {
            // El stock vendible es la suma de lo que queda en los lotes. Se deriva
            // aqui en vez de leerse del JSON para que productos.stock y
            // lotes.restante nunca queden descuadrados.
            $stock = collect($datos['lotes'])->sum('restante');

            $producto = Producto::create([
                'categoria_id' => $categorias[$datos['categoria']]->id,
                'nombre' => $datos['nombre'],
                'slug' => $datos['id'],
                'descripcion_corta' => $datos['descripcion_corta'],
                'descripcion' => $datos['descripcion'],
                'precio' => $datos['precio'],
                'precio_antes' => $datos['precio_antes'],
                'presentacion' => $datos['presentacion'],
                'nivel_picante' => $datos['nivel_picante'],
                'stock' => $stock,
                'stock_minimo' => $datos['stock_minimo'],
                'peso' => $datos['peso'],
                'ingredientes' => $datos['ingredientes'],
                'platos_recomendados' => $datos['platos_recomendados'],
                'tono' => $datos['tono'],
                'recomendacion_consumo' => $datos['recomendacion_consumo'],
                'conservacion' => $datos['conservacion'],
                'insignia' => $datos['insignia'],
                'limitado' => $datos['limitado'],
                'temporada' => $datos['temporada'],
                'combo' => $datos['combo'],
                'destacado' => $datos['destacado'],
                'activo' => $datos['activo'],
                'created_at' => $datos['creado'].' 09:00:00',
            ]);

            $porIdAntiguo->put($datos['id'], $producto);

            foreach ($datos['lotes'] as $lote) {
                Lote::create([
                    'producto_id' => $producto->id,
                    'codigo' => $lote['codigo'],
                    'fecha_elaboracion' => $lote['fechaElaboracion'],
                    'fecha_consumo_recomendado' => $lote['fechaConsumoRecomendado'],
                    'cantidad' => $lote['cantidad'],
                    'restante' => $lote['restante'],
                ]);
            }
        }

        foreach ($contenido['resenas'] as $datos) {
            $producto = $porIdAntiguo->get($datos['productoId']);

            if (! $producto) {
                continue;
            }

            Resena::create([
                'producto_id' => $producto->id,
                'autor' => $datos['autor'],
                'estrellas' => $datos['estrellas'],
                'texto' => $datos['texto'],
                'visible' => true,
                'created_at' => $datos['fecha'].' 12:00:00',
            ]);
        }

        foreach ($contenido['promociones'] as $datos) {
            $promocion = Promocion::create([
                'titulo' => $datos['titulo'],
                'slug' => Str::slug($datos['titulo']),
                'descripcion' => $datos['descripcion'],
                'tipo' => $datos['tipo'],
                'descuento' => $datos['descuento'],
                'activa' => $datos['activa'],
                'vigente_desde' => null,
                'vigente_hasta' => $datos['vigente'],
            ]);

            $ids = collect($datos['productosIds'])
                ->map(fn ($id) => $porIdAntiguo->get($id)?->id)
                ->filter()
                ->all();

            if ($ids) {
                $promocion->productos()->sync($ids);
            }
        }
    }
}

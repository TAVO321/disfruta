<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Database\Seeder;

/**
 * Seeder para produccion. A diferencia de DatabaseSeeder no trae los pedidos de
 * ejemplo, y es idempotente: se puede correr en cada deploy sin duplicar nada.
 *
 * - El admin y los ajustes se refrescan siempre (updateOrCreate).
 * - El catalogo solo se carga si la base esta vacia, porque CatalogoSeeder usa
 *   create() y correrlo dos veces duplicaria productos, lotes y promociones.
 */
class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(AjustesSeeder::class);

        if (Categoria::query()->exists() || Producto::query()->exists()) {
            $this->command?->warn('Catalogo ya cargado: se omite CatalogoSeeder.');

            return;
        }

        $this->call(CatalogoSeeder::class);
    }
}

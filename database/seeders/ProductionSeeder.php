<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Database\Seeder;

/**
 * Seeder de produccion.
 *
 * Se divide en dos partes:
 *
 * 1. Lo que SIEMPRE corre, porque usa updateOrCreate y es idempotente:
 *    el usuario administrador y los ajustes del sitio.
 *
 * 2. La mercaderia de arranque (catalogo, promociones, resenas y pedidos de
 *    ejemplo), que SOLO corre si la base esta vacia. CatalogoSeeder y
 *    PedidosDemoSeeder usan create() y no son idempotentes: si se corrieran en
 *    cada deploy duplicarian productos, lotes, promociones y pedidos.
 *
 * Cuando cargues tu mercaderia real desde el panel de administracion, el guard
 * va a seguir omitiendo el catalogo, asi que ProductionSeeder se puede dejar
 * como deploy command sin riesgo.
 */
class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(AjustesSeeder::class);

        if (Categoria::query()->exists() || Producto::query()->exists()) {
            $this->command?->warn('El catalogo ya tiene mercaderia: se omite la carga inicial.');

            return;
        }

        $this->call(CatalogoSeeder::class);
        $this->call(PedidosDemoSeeder::class);
    }
}

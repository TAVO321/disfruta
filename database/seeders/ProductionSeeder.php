<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeder de produccion: deja la base con lo minimo indispensable para que el
 * sitio funcione, y nada de contenido de ejemplo.
 *
 * - AdminUserSeeder y AjustesSeeder usan updateOrCreate, asi que son idempotentes
 *   y se pueden correr en cada deploy sin duplicar nada.
 * - NO se carga CatalogoSeeder a proposito: los productos, lotes, promociones y
 *   resenas se cargan a mano desde el panel de administracion.
 * - NO se carga PedidosDemoSeeder: en produccion no hay pedidos falsos.
 */
class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(AjustesSeeder::class);
    }
}

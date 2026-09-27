<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(CatalogosSeeder::class);
        $this->call(CatalogoSeeder::class);
        $this->call(PaletaFamiliasSeeder::class);
        $this->call(PedidosDemoSeeder::class);
        $this->call(AjustesSeeder::class);
    }
}

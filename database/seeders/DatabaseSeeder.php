<?php

namespace Database\Seeders;

use App\Models\Ajuste;
use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Lote;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\Resena;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(CatalogoSeeder::class);
        $this->call(PedidosDemoSeeder::class);
        $this->call(AjustesSeeder::class);
    }
}

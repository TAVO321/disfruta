<?php

namespace Tests\Feature;

use App\Models\Ajuste;
use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Lote;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\Resena;
use App\Models\User;
use Database\Seeders\ProductionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProduccionSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_deja_la_lista_para_produccion_solo_con_admin_y_ajustes(): void
    {
        $this->seed(ProductionSeeder::class);

        // lo unico que debe cargar
        $this->assertSame(1, User::count());
        $this->assertTrue(User::first()->is_admin);
        $this->assertSame(4, Ajuste::count());

        // nada de contenido de ejemplo
        $this->assertSame(0, Producto::count());
        $this->assertSame(0, Categoria::count());
        $this->assertSame(0, Lote::count());
        $this->assertSame(0, Promocion::count());
        $this->assertSame(0, Resena::count());
        $this->assertSame(0, Cliente::count());
        $this->assertSame(0, Pedido::count());
    }

    public function test_se_puede_correr_de_varias_veces_sin_duplicar_nada(): void
    {
        $this->seed(ProductionSeeder::class);

        $ajustes = Ajuste::count();

        // simula un redeploy: el deploy command vuelve a correr el seeder
        $this->seed(ProductionSeeder::class);
        $this->seed(ProductionSeeder::class);

        $this->assertSame(1, User::count());
        $this->assertSame($ajustes, Ajuste::count());
    }
}

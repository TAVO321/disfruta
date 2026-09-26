<?php

namespace Tests\Feature;

use App\Models\Ajuste;
use App\Models\Categoria;
use App\Models\Lote;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\User;
use Database\Seeders\ProductionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProduccionSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_carga_el_catalogo_el_admin_y_los_ajustes_sin_pedidos_demo(): void
    {
        $this->seed(ProductionSeeder::class);

        $this->assertGreaterThan(0, Producto::count());
        $this->assertGreaterThan(0, Categoria::count());
        $this->assertGreaterThan(0, Lote::count());
        $this->assertGreaterThan(0, Promocion::count());
        $this->assertSame(4, Ajuste::count());
        $this->assertSame(1, User::count());
        $this->assertTrue(User::first()->is_admin);

        // lo unico que ProductionSeeder no debe tocar
        $this->assertSame(0, Pedido::count());
    }

    public function test_se_puede_correr_de_varias_veces_sin_duplicar_nada(): void
    {
        $this->seed(ProductionSeeder::class);

        $productos = Producto::count();
        $categorias = Categoria::count();
        $lotes = Lote::count();
        $promociones = Promocion::count();

        // simula un redeploy: el deploy command vuelve a correr el seeder
        $this->seed(ProductionSeeder::class);
        $this->seed(ProductionSeeder::class);

        $this->assertSame($productos, Producto::count());
        $this->assertSame($categorias, Categoria::count());
        $this->assertSame($lotes, Lote::count());
        $this->assertSame($promociones, Promocion::count());
        $this->assertSame(1, User::count());
        $this->assertSame(4, Ajuste::count());
    }
}

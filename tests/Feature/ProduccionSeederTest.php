<?php

namespace Tests\Feature;

use App\Models\Ajuste;
use App\Models\Categoria;
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

    public function test_carga_el_catalogo_el_admin_los_ajustes_y_los_pedidos_de_ejemplo(): void
    {
        $this->seed(ProductionSeeder::class);

        $this->assertSame(1, User::count());
        $this->assertTrue(User::first()->is_admin);
        $this->assertSame(4, Ajuste::count());

        $this->assertSame(5, Categoria::count());
        $this->assertSame(12, Producto::count());
        $this->assertGreaterThan(0, Lote::count());
        $this->assertGreaterThan(0, Promocion::count());
        $this->assertGreaterThan(0, Resena::count());
        $this->assertGreaterThan(0, Pedido::count());
    }

    public function test_se_puede_correr_de_varias_veces_sin_duplicar_nada(): void
    {
        $this->seed(ProductionSeeder::class);

        $productos = Producto::count();
        $categorias = Categoria::count();
        $lotes = Lote::count();
        $promociones = Promocion::count();
        $resenas = Resena::count();
        $pedidos = Pedido::count();

        // simula dos redeploys: el deploy command vuelve a correr el seeder
        $this->seed(ProductionSeeder::class);
        $this->seed(ProductionSeeder::class);

        $this->assertSame($categorias, Categoria::count());
        $this->assertSame($productos, Producto::count());
        $this->assertSame($lotes, Lote::count());
        $this->assertSame($promociones, Promocion::count());
        $this->assertSame($resenas, Resena::count());
        $this->assertSame($pedidos, Pedido::count());
        $this->assertSame(1, User::count());
        $this->assertSame(4, Ajuste::count());
    }
}

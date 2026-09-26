<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Lote;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class PanelAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        $this->admin = User::where('is_admin', true)->firstOrFail();
    }

    /**
     * Inertia 3 entrega el page object en <script data-page="app"> y el helper
     * assertInertia de inertia-laravel todavia no lo parsea, asi que se lee a mano.
     */
    private function pagina(TestResponse $response): array
    {
        preg_match(
            '#<script data-page="app" type="application/json">(.*?)</script>#s',
            $response->getContent(),
            $matches
        );

        $json = json_decode($matches[1] ?? '', true);

        $this->assertIsArray($json, 'No se encontro el page object de Inertia en el HTML.');

        return $json;
    }

    public function test_las_paginas_del_panel_requieren_sesion_de_admin(): void
    {
        $rutas = ['/admin', '/admin/productos', '/admin/lotes', '/admin/pedidos', '/admin/promociones', '/admin/clientes'];

        foreach ($rutas as $ruta) {
            $this->get($ruta)->assertRedirect('/admin/acceso');
        }

        // El seed solo crea el admin, asi que el usuario corriente se arma aca.
        $this->actingAs(User::create([
            'name' => 'Cliente Común',
            'email' => 'comun@disfruta.bo',
            'password' => 'disfruta2026',
            'is_admin' => false,
        ]));

        foreach ($rutas as $ruta) {
            $this->get($ruta)->assertForbidden();
        }
    }

    public function test_todas_las_paginas_del_panel_responden_con_sesion_de_admin(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::firstOrFail();
        $promocion = Promocion::firstOrFail();

        $paginas = [
            '/admin' => 'Admin/Panel',
            '/admin/productos' => 'Admin/Productos/Index',
            '/admin/productos/create' => 'Admin/Productos/Form',
            '/admin/productos/'.$producto->id.'/edit' => 'Admin/Productos/Form',
            '/admin/lotes' => 'Admin/Lotes/Index',
            '/admin/pedidos' => 'Admin/Pedidos/Index',
            '/admin/promociones' => 'Admin/Promociones/Index',
            '/admin/promociones/create' => 'Admin/Promociones/Form',
            '/admin/promociones/'.$promocion->id.'/edit' => 'Admin/Promociones/Form',
            '/admin/clientes' => 'Admin/Clientes/Index',
        ];

        foreach ($paginas as $ruta => $componente) {
            $response = $this->get($ruta)->assertOk();
            $this->assertSame($componente, $this->pagina($response)['component'], "Ruta: $ruta");
        }
    }

    public function test_el_formulario_de_edicion_manda_los_textos_largos_y_la_categoria(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::whereNotNull('descripcion')->firstOrFail();

        $props = $this->pagina($this->get('/admin/productos/'.$producto->id.'/edit'))['props'];

        // Si el Resource no manda estos campos, el formulario los pisaria con vacios.
        $this->assertSame($producto->id, $props['producto']['categoria']['id']);
        $this->assertNotSame('', $props['producto']['descripcion']);
        $this->assertNotNull($props['producto']['recomendacionConsumo']);
        $this->assertNotNull($props['producto']['conservacion']);
    }

    public function test_crear_un_producto_lo_registra_en_el_catalogo(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin);

        $this->post('/admin/productos', [
            'nombre' => 'Ajo Nuevo Test',
            'categoria_id' => Categoria::firstOrFail()->id,
            'descripcion_corta' => 'Descripcion corta de prueba.',
            'descripcion' => 'Descripcion completa de prueba con suficiente largo.',
            'precio' => 25,
            'presentacion' => 'Frasco 200 g',
            'nivel_picante' => 'suave',
            'stock' => 0,
            'stock_minimo' => 2,
            'peso' => 200,
            'ingredientes' => ['ajo'],
            'platos_recomendados' => ['parrillada'],
            'activo' => '1',
            'imagenes' => [UploadedFile::fake()->image('ajo.jpg')],
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('productos', ['nombre' => 'Ajo Nuevo Test', 'precio' => 25]);

        $producto = Producto::where('nombre', 'Ajo Nuevo Test')->firstOrFail();

        Storage::disk('public')->assertExists($producto->imagenes->first()->ruta);
    }

    public function test_actualizar_el_stock_desde_el_panel_recalcula_el_stock_del_producto(): void
    {
        $this->actingAs($this->admin);

        $lote = Lote::firstOrFail();

        $this->put('/admin/lotes/'.$lote->id, [
            'codigo' => $lote->codigo,
            'fecha_elaboracion' => $lote->fecha_elaboracion->toDateString(),
            'fecha_consumo_recomendado' => $lote->fecha_consumo_recomendado->toDateString(),
            'restante' => 7,
        ])->assertSessionHasNoErrors();

        $this->assertSame(7, $lote->fresh()->restante);
        $this->assertSame(
            (int) Lote::where('producto_id', $lote->producto_id)->sum('restante'),
            $lote->producto->fresh()->stock,
        );
    }

    public function test_registrar_un_lote_suma_stock_al_producto(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::where('activo', true)->firstOrFail();
        $stockInicial = $producto->stock;

        $this->post('/admin/lotes', [
            'producto_id' => $producto->id,
            'codigo' => 'TEST-0001',
            'fecha_elaboracion' => '2026-01-01',
            'fecha_consumo_recomendado' => '2027-01-01',
            'cantidad' => 12,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('lotes', ['codigo' => 'TEST-0001', 'restante' => 12]);
        $this->assertSame($stockInicial + 12, $producto->fresh()->stock);
    }

    public function test_cambiar_el_estado_de_un_pedido(): void
    {
        $this->actingAs($this->admin);

        $pedido = Pedido::where('estado', 'nuevo')->firstOrFail();

        $this->patch('/admin/pedidos/'.$pedido->id.'/estado', ['estado' => 'entregado'])
            ->assertSessionHasNoErrors();

        $this->assertSame('entregado', $pedido->fresh()->estado);
    }

    public function test_activar_y_desactivar_una_promocion_desde_el_listado(): void
    {
        $this->actingAs($this->admin);

        $promocion = Promocion::where('activa', true)->firstOrFail();

        $this->patch('/admin/promociones/'.$promocion->id.'/alternar', ['activa' => false])
            ->assertSessionHasNoErrors();

        $this->assertFalse($promocion->fresh()->activa);

        $this->assertNotContains(
            $promocion->id,
            array_column($this->pagina($this->get('/promociones'))['props']['promociones'], 'id'),
        );
    }

    public function test_el_stock_del_producto_siempre_coincide_con_la_suma_de_sus_lotes(): void
    {
        $this->actingAs($this->admin);

        foreach (Producto::all() as $producto) {
            $this->assertSame(
                (int) $producto->lotes()->sum('restante'),
                $producto->stock,
                "El stock de {$producto->nombre} no cuadra con sus lotes.",
            );
        }
    }

    public function test_el_cliente_se_crea_o_se_actualiza_al_confirmar_un_pedido(): void
    {
        $telefono = '70099999';

        $this->assertDatabaseMissing('clientes', ['telefono' => $telefono]);

        $producto = Producto::where('activo', true)->where('stock', '>', 0)->firstOrFail();

        foreach ([1, 2] as $indice) {
            $this->post('/carrito/confirmar', [
                'cliente' => $indice === 1 ? 'Nombre Uno' : 'Nombre Dos',
                'telefono' => $telefono,
                'items' => [
                    ['producto_id' => $producto->id, 'cantidad' => 1, 'reserva' => false],
                ],
            ])->assertSessionHasNoErrors();
        }

        // Mismo telefono, distinto nombre: debe actualizar, no duplicar.
        $this->assertSame(1, Cliente::where('telefono', $telefono)->count());
        $this->assertDatabaseHas('clientes', ['telefono' => $telefono, 'nombre' => 'Nombre Dos']);
    }
}

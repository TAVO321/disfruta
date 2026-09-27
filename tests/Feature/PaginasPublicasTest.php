<?php

namespace Tests\Feature;

use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class PaginasPublicasTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
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

    /** Los Resources de Coleccion llegan envueltos en { data: [...] }. */
    private function coleccion(array $props, string $clave): array
    {
        $valor = $props[$clave] ?? null;

        if ($valor instanceof Collection) {
            $valor = $valor->all();
        }

        if (is_array($valor) && array_key_exists('data', $valor)) {
            $valor = $valor['data'];
        }

        return is_array($valor) ? $valor : [];
    }

    public function test_la_tienda_publica_responde_en_todas_sus_rutas(): void
    {
        $producto = Producto::where('activo', true)->firstOrFail();

        $rutas = [
            '/',
            '/catalogo',
            '/catalogo?q=ajo',
            '/catalogo?categoria='.$producto->categoria->slug,
            '/catalogo?picante[]=suave&orden=precio-asc',
            '/catalogo/'.$producto->slug,
            '/promociones',
            '/nosotros',
            '/carrito',
        ];

        foreach ($rutas as $ruta) {
            $this->get($ruta)->assertOk();
        }
    }

    public function test_el_carrito_tiene_pagina_propia_ademas_del_panel(): void
    {
        $page = $this->get('/carrito')->assertOk();

        $this->assertSame('Carrito/Index', $page->viewData('page')['component']);
    }

    public function test_el_html_tiene_el_contenedor_where_se_monta_react(): void
    {
        // Inertia 3 entrega el page object en un <script data-page>: si el div
        // #app no existe, createRoot(null) revienta y la web queda en blanco.
        $this->get('/')
            ->assertOk()
            ->assertSee('id="app"', false);
    }

    public function test_el_detalle_expone_lotes_disponibles(): void
    {
        $producto = Producto::where('activo', true)
            ->whereHas('lotesDisponibles', fn ($q) => $q->where('restante', '>', 0))
            ->with('lotesDisponibles')
            ->firstOrFail();

        $response = $this->get('/catalogo/'.$producto->slug)->assertOk();
        $page = $this->pagina($response);

        $this->assertSame('Catalogo/Detalle', $page['component']);
        $this->assertSame($producto->id, $page['props']['producto']['id']);

        $lotes = $page['props']['producto']['lotes'] ?? [];

        $this->assertNotEmpty($lotes, 'El detalle deberia traer los lotes disponibles.');
        $this->assertContainsOnly('array', $lotes);

        foreach ($lotes as $lote) {
            $this->assertGreaterThan(0, $lote['restante'], 'No deben viajar lotes agotados.');
        }
    }

    public function test_confirmar_el_pedido_descuenta_stock_y_consume_el_lote_mas_proximo_a_vencer(): void
    {
        $producto = Producto::where('activo', true)
            ->whereHas('lotesDisponibles', fn ($q) => $q->where('restante', '>', 0))
            ->with('lotesDisponibles')
            ->firstOrFail();

        $loteProximo = $producto->lotesDisponibles
            ->where('restante', '>', 0)
            ->sortBy('fecha_consumo_recomendado')
            ->firstOrFail();

        $stockInicial = $producto->stock;
        $restanteInicial = $loteProximo->restante;
        $lotesTotales = (int) $producto->lotesDisponibles->sum('restante');

        $this->post('/carrito/confirmar', [
            'cliente' => 'Cliente Test',
            'telefono' => '70000000',
            'zona' => 'Zona Sur',
            'items' => [
                ['producto_id' => $producto->id, 'cantidad' => 2, 'reserva' => false],
            ],
        ])->assertRedirect();

        $pedido = Pedido::latest('id')->firstOrFail();

        $this->assertSame(2, $pedido->items->sum('cantidad'));
        $this->assertSame($stockInicial - 2, $producto->fresh()->stock);
        $this->assertSame($restanteInicial - 2, $loteProximo->fresh()->restante);
        $this->assertSame($lotesTotales - 2, (int) $producto->lotes()->sum('restante'));
    }

    public function test_se_puede_confirmar_un_pedido_de_un_producto_sin_lotes_registrados(): void
    {
        $producto = Producto::where('activo', true)->where('stock', '>', 2)->firstOrFail();

        // Un producto cargado desde el panel nace con stock pero sin lotes: nadie
        // registro inventario fisico para el. Igual tiene que poder venderse, o
        // el checkout responde 422 y el cliente se queda sin pedido.
        $producto->lotes()->delete();
        $producto->update(['stock' => 5]);

        $response = $this->post('/carrito/confirmar', [
            'cliente' => 'Cliente Test',
            'telefono' => '70000002',
            'zona' => 'Zona Sur',
            'items' => [
                ['producto_id' => $producto->id, 'cantidad' => 2, 'reserva' => false],
            ],
        ]);

        $this->assertNotSame(422, $response->getStatusCode(), 'Un producto sin lotes no puede dejar el checkout en 422.');

        $pedido = Pedido::where('telefono', '70000002')->latest('id')->firstOrFail();

        $this->assertSame(2, $pedido->items->sum('cantidad'));
        $this->assertSame(3, $producto->fresh()->stock);
    }

    public function test_la_pagina_de_confirmacion_solo_muestra_el_pedido_de_esta_sesion(): void
    {
        $producto = Producto::where('activo', true)->where('stock', '>', 1)->firstOrFail();

        $this->post('/carrito/confirmar', [
            'cliente' => 'Cliente Test',
            'telefono' => '70000001',
            'items' => [
                ['producto_id' => $producto->id, 'cantidad' => 1, 'reserva' => false],
            ],
        ])->assertRedirect();

        $pedido = Pedido::latest('id')->firstOrFail();

        $response = $this->get('/carrito/confirmado/'.$pedido->id)->assertOk();
        $page = $this->pagina($response);

        $this->assertSame('Carrito/Confirmado', $page['component']);
        $this->assertSame($pedido->id, $page['props']['pedido']['id']);

        // La segunda visita ya no debe servir el pedido: el id se consume.
        $this->get('/carrito/confirmado/'.$pedido->id)
            ->assertRedirect('/catalogo');
    }

    public function test_no_se_puede_confirmar_mas_stock_del_disponible(): void
    {
        $producto = Producto::where('activo', true)->firstOrFail();

        $this->post('/carrito/confirmar', [
            'cliente' => 'Cliente Test',
            'telefono' => '70000002',
            'items' => [
                ['producto_id' => $producto->id, 'cantidad' => $producto->stock + 50, 'reserva' => false],
            ],
        ])->assertStatus(422);

        $this->assertSame($producto->stock, $producto->fresh()->stock);
    }

    public function test_una_resena_nueva_queda_pendiente_de_moderacion(): void
    {
        $producto = Producto::where('activo', true)->firstOrFail();

        $this->post('/catalogo/'.$producto->slug.'/resenas', [
            'autor' => 'Ana',
            'estrellas' => 5,
            'texto' => 'Excelente sabor, muy recomendado.',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('resenas', [
            'producto_id' => $producto->id,
            'autor' => 'Ana',
            'visible' => false,
        ]);
    }

    public function test_el_honeypot_rechaza_las_ressenas_de_bots(): void
    {
        $producto = Producto::where('activo', true)->firstOrFail();

        $this->post('/catalogo/'.$producto->slug.'/resenas', [
            'autor' => 'Bot',
            'estrellas' => 5,
            'texto' => 'Comentario larguisimo para pasar la validacion.',
            'sitio_web' => 'https://spam.example',
        ])->assertSessionHasErrors('sitio_web');

        $this->assertDatabaseMissing('resenas', ['autor' => 'Bot']);
    }

    public function test_solo_se_muestran_las_promociones_activas_y_vigentes(): void
    {
        $vigente = Promocion::create([
            'titulo' => 'Promo test vigente',
            'slug' => 'promo-test-vigente',
            'descripcion' => 'Descripcion de prueba',
            'tipo' => 'oferta',
            'descuento' => 10,
            'activa' => true,
            'vigente_desde' => now()->subDay(),
            'vigente_hasta' => now()->addDay(),
        ]);

        $vencida = Promocion::create([
            'titulo' => 'Promo test vencida',
            'slug' => 'promo-test-vencida',
            'descripcion' => 'Descripcion de prueba',
            'tipo' => 'oferta',
            'descuento' => 10,
            'activa' => true,
            'vigente_desde' => now()->subDays(10),
            'vigente_hasta' => now()->subDay(),
        ]);

        $apagada = Promocion::create([
            'titulo' => 'Promo test apagada',
            'slug' => 'promo-test-apagada',
            'descripcion' => 'Descripcion de prueba',
            'tipo' => 'oferta',
            'descuento' => 10,
            'activa' => false,
            'vigente_desde' => now()->subDay(),
            'vigente_hasta' => now()->addDay(),
        ]);

        $response = $this->get('/promociones')->assertOk();
        $page = $this->pagina($response);

        $ids = array_column($this->coleccion($page['props'], 'promociones'), 'id');

        $this->assertContains($vigente->id, $ids, 'La promo vigente debe aparecer.');
        $this->assertNotContains($vencida->id, $ids, 'La promo vencida no debe aparecer.');
        $this->assertNotContains($apagada->id, $ids, 'La promo apagada no debe aparecer.');
    }

    public function test_el_admin_puede_iniciar_sesion_y_salir(): void
    {
        $admin = User::where('is_admin', true)->firstOrFail();

        $this->get('/admin/acceso')->assertOk();

        $this->post('/admin/acceso', [
            'email' => $admin->email,
            'password' => 'disfruta2026',
        ])->assertRedirect('/admin');

        $this->assertAuthenticatedAs($admin);

        $this->post('/admin/salir')->assertRedirect('/');

        $this->assertGuest();
    }
}

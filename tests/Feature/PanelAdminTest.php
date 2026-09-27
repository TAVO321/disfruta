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
use Illuminate\Support\Facades\DB;
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
        $rutas = ['/admin', '/admin/productos', '/admin/lotes', '/admin/pedidos', '/admin/promociones', '/admin/clientes', '/admin/usuarios', '/admin/ajustes'];

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
            '/admin/usuarios' => 'Admin/Usuarios/Index',
            '/admin/ajustes' => 'Admin/Ajustes/Index',
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

    public function test_un_producto_nuevo_nace_con_la_paleta_del_frasco_completa(): void
    {
        $this->actingAs($this->admin);

        // El formulario no manda tono. Sin este default la columna queda en
        // null, la ilustracion revienta al desestructurarla y la pagina
        // principal se queda solo con el fondo crema.
        $this->post('/admin/productos', [
            'nombre' => 'Producto Sin Tono',
            'categoria_id' => Categoria::firstOrFail()->id,
            'descripcion_corta' => 'Descripcion corta de prueba.',
            'descripcion' => 'Descripcion completa de prueba con suficiente largo.',
            'precio' => 25,
            'presentacion' => 'Frasco 200 g',
            'nivel_picante' => 'suave',
            'stock' => 5,
            'stock_minimo' => 2,
            'peso' => 200,
            'activo' => '1',
            'destacado' => '1',
        ])->assertSessionHasNoErrors();

        $tono = Producto::where('nombre', 'Producto Sin Tono')->firstOrFail()->tono;

        // El color no lo decide el producto: lo hereda de su familia, para que
        // un frasco nuevo de Encurtidos salga igual que los demas Encurtidos.
        $this->assertSame(Categoria::firstOrFail()->tonoParaProducto(), $tono);
        $this->assertNotEmpty($tono);
    }

    public function test_la_pagina_principal_manda_un_tono_completo_en_todos_los_productos(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/productos', [
            'nombre' => 'Producto Para La Home',
            'categoria_id' => Categoria::firstOrFail()->id,
            'descripcion_corta' => 'Descripcion corta de prueba.',
            'descripcion' => 'Descripcion completa de prueba con suficiente largo.',
            'precio' => 30,
            'presentacion' => 'Frasco 250 g',
            'nivel_picante' => 'medio',
            'stock' => 8,
            'stock_minimo' => 2,
            'peso' => 250,
            'activo' => '1',
            'destacado' => '1',
        ])->assertSessionHasNoErrors();

        // Inertia 3 entrega el page object en <script data-page="app"> y el
        // helper assertInertia todavia no lo parsea, asi que se lee a mano.
        preg_match(
            '#<script data-page="app" type="application/json">(.*?)</script>#s',
            $this->get('/')->assertOk()->getContent(),
            $matches
        );

        $json = json_decode($matches[1] ?? '', true);
        $this->assertIsArray($json, 'No se encontro el page object de Inertia en la home.');

        $productos = $json['props']['productos'] ?? [];
        $productos = is_array($productos['data'] ?? null) ? $productos['data'] : $productos;

        $this->assertNotEmpty($productos);

        // El Hero desestructura producto.tono en las tarjetas y en los frascos:
        // un solo null aca tumbaba la pagina entera.
        foreach ($productos as $producto) {
            $this->assertIsArray($producto['tono'] ?? null, "El producto {$producto['id']} llego sin tono");
            foreach (['fondo', 'contenido', 'acento', 'tapa'] as $clave) {
                $this->assertNotEmpty(
                    $producto['tono'][$clave] ?? null,
                    "El producto {$producto['id']} llego sin el color {$clave}"
                );
            }
        }
    }

    public function test_editar_un_producto_no_le_pisa_el_tono_que_ya_tenia(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::firstOrFail();
        $tonoOriginal = $producto->tono;

        $this->assertIsArray($tonoOriginal);
        $this->assertNotEmpty($tonoOriginal);

        $this->put("/admin/productos/{$producto->id}", [
            'nombre' => $producto->nombre,
            'categoria_id' => $producto->categoria_id,
            'descripcion_corta' => $producto->descripcion_corta,
            'descripcion' => $producto->descripcion,
            'precio' => $producto->precio,
            'presentacion' => $producto->presentacion,
            'nivel_picante' => $producto->nivel_picante,
            'stock' => $producto->stock,
            'stock_minimo' => $producto->stock_minimo,
            'peso' => $producto->peso,
            'activo' => '1',
        ])->assertSessionHasNoErrors();

        $this->assertSame($tonoOriginal, $producto->fresh()->tono);
    }

    public function test_la_migracion_completa_el_tono_de_los_productos_que_lo_tenian_vacio(): void
    {
        $producto = Producto::firstOrFail();

        // Se reproduce el estado roto: la columna tono en null, tal como
        // quedaron los productos creados desde el panel.
        DB::table('productos')->update(['tono' => null]);
        $this->assertNull($producto->fresh()->tono);

        // RefreshDatabase ya corrio las migraciones, asi que se invoca la
        // migracion puntual en vez de correr todo migrate de nuevo.
        $archivo = database_path('migrations/2026_09_27_191358_completa_el_tono_de_los_productos_sin_paleta.php');
        $this->assertFileExists($archivo);

        $migracion = require $archivo;
        $migracion->up();

        $this->assertSame(Producto::TONO_POR_DEFECTO, $producto->fresh()->tono);
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

    public function test_editar_un_producto_con_imagen_actualiza_los_datos_y_guarda_el_archivo(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin);

        $producto = Producto::firstOrFail();

        $this->patch("/admin/productos/{$producto->id}", [
            'nombre' => $producto->nombre,
            'categoria_id' => $producto->categoria_id,
            'descripcion_corta' => 'Descripcion corta editada.',
            'descripcion' => 'Descripcion completa editada con suficiente largo.',
            'precio' => 30,
            'presentacion' => $producto->presentacion,
            'nivel_picante' => $producto->nivel_picante,
            'stock' => $producto->stock,
            'stock_minimo' => $producto->stock_minimo,
            'peso' => $producto->peso,
            'ingredientes' => ['ajo'],
            'platos_recomendados' => ['parrillada'],
            'activo' => '1',
            'imagenes' => [UploadedFile::fake()->image('editada.jpg')],
        ])->assertSessionHasNoErrors();

        $producto->refresh();

        $this->assertSame(30.0, (float) $producto->precio);
        Storage::disk('public')->assertExists($producto->imagenes->sole()->ruta);
    }

    public function test_la_ruta_de_editar_un_producto_rechaza_un_post(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::firstOrFail();

        // El formulario mandaba POST con un _method en el cuerpo. Inertia
        // serializa ese cuerpo como JSON, el _method no llega, y la ruta
        // respondia 405 en vez de editar. El update tiene que ir por el verbo.
        $this->post("/admin/productos/{$producto->id}", [
            'nombre' => 'No deberia guardarse',
        ])->assertStatus(405);
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

    public function test_crear_una_promocion_la_registra_y_vuelve_al_listado(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::firstOrFail();

        // Cubre que el redirect apunte a una ruta que exista de verdad.
        $this->post('/admin/promociones', [
            'titulo' => 'Promo Test Automatico',
            'descripcion' => 'Promocion creada desde el test para validar el redirect.',
            'tipo' => 'oferta',
            'descuento' => 15,
            'activa' => '1',
            'productos' => [$producto->id],
        ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.promociones.index'));

        $this->assertDatabaseHas('promociones', ['titulo' => 'Promo Test Automatico', 'descuento' => 15]);

        $creada = Promocion::where('titulo', 'Promo Test Automatico')->firstOrFail();
        $this->assertTrue($creada->productos->contains($producto));
    }

    public function test_editar_una_promocion_actualiza_sus_productos(): void
    {
        $this->actingAs($this->admin);

        $promocion = Promocion::firstOrFail();
        $otro = Producto::where('id', '!=', $promocion->productos->first()?->id)->firstOrFail();

        $this->put('/admin/promociones/'.$promocion->id, [
            'titulo' => $promocion->titulo.' Editada',
            'descripcion' => $promocion->descripcion,
            'tipo' => $promocion->tipo,
            'descuento' => 20,
            'activa' => '1',
            'productos' => [$otro->id],
        ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.promociones.index'));

        $this->assertSame(20, $promocion->fresh()->descuento);
        $this->assertSame([$otro->id], $promocion->fresh()->productos->pluck('id')->all());
    }

    public function test_el_formulario_de_edicion_de_promocion_trae_los_productos_marcados(): void
    {
        $this->actingAs($this->admin);

        $promocion = Promocion::whereHas('productos')->firstOrFail();

        $props = $this->pagina($this->get('/admin/promociones/'.$promocion->id.'/edit'))['props'];

        $this->assertSame(
            $promocion->productos->pluck('id')->sort()->values()->all(),
            collect($props['promocion']['productos'])->sort()->values()->all(),
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

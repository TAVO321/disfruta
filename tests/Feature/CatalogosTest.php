<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\EstadoPedido;
use App\Models\NivelPicante;
use App\Models\Pedido;
use App\Models\Plato;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\TipoPromocion;
use App\Models\User;
use Database\Seeders\CatalogosSeeder;
use Database\Seeders\PaletaFamiliasSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/**
 * Los catalogos que antes vivian en el codigo y el vinculo entre la familia y
 * el color del frasco.
 */
class CatalogosTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        $this->admin = User::where('is_admin', true)->firstOrFail();
    }

    public function test_los_catalogos_se_sembraron_en_la_base(): void
    {
        $this->assertSame(5, NivelPicante::count());
        $this->assertSame(5, EstadoPedido::count());
        $this->assertSame(4, TipoPromocion::count());
        $this->assertSame(12, Plato::count());
    }

    public function test_las_paletas_de_las_familias_llegan_al_formulario_de_productos(): void
    {
        $this->actingAs($this->admin);

        $categoria = Categoria::firstOrFail();
        $categoria->update(['tono' => ['fondo' => '#111111', 'contenido' => '#222222', 'acento' => '#333333', 'tapa' => '#444444']]);

        $props = $this->pagina($this->get('/admin/productos/create'))['props'];

        $tonos = collect($props['categorias'])->keyBy('slug');

        $this->assertSame('#111111', $tonos[$categoria->slug]['tono']['fondo']);
    }

    public function test_un_producto_nuevo_hereda_el_tono_de_su_familia(): void
    {
        $this->actingAs($this->admin);

        $categoria = Categoria::firstOrFail();
        $categoria->update(['tono' => ['fondo' => '#0a0a0a', 'contenido' => '#0b0b0b', 'acento' => '#0c0c0c', 'tapa' => '#0d0d0d']]);

        $this->post('/admin/productos', $this->datosProducto(['categoria_id' => $categoria->id]))
            ->assertSessionHasNoErrors();

        $tono = Producto::where('nombre', 'Producto Heredado')->firstOrFail()->tono;

        $this->assertSame('#0a0a0a', $tono['fondo']);
        $this->assertSame('#0d0d0d', $tono['tapa']);
    }

    public function test_cambiar_el_tono_de_la_familia_no_repinta_sus_productos_hasta_pedirlo(): void
    {
        $this->actingAs($this->admin);

        $categoria = Categoria::whereHas('productos')->firstOrFail();
        $producto = $categoria->productos()->firstOrFail();
        $tonoOriginal = $producto->tono;

        $nuevo = ['fondo' => '#aaaaaa', 'contenido' => '#bbbbbb', 'acento' => '#cccccc', 'tapa' => '#dddddd'];

        $this->put("/admin/categorias/{$categoria->id}", [
            'nombre' => $categoria->nombre,
            'descripcion' => $categoria->descripcion,
            'tono' => $nuevo,
            'activo' => true,
        ])->assertSessionHasNoErrors();

        $this->assertSame($tonoOriginal, $producto->fresh()->tono);
    }

    public function test_aplicar_a_todos_repinta_los_productos_de_la_familia(): void
    {
        $this->actingAs($this->admin);

        $categoria = Categoria::whereHas('productos')->firstOrFail();
        $nuevo = ['fondo' => '#aaaaaa', 'contenido' => '#bbbbbb', 'acento' => '#cccccc', 'tapa' => '#dddddd'];

        $this->put("/admin/categorias/{$categoria->id}", [
            'nombre' => $categoria->nombre,
            'descripcion' => $categoria->descripcion,
            'tono' => $nuevo,
            'activo' => true,
        ])->assertSessionHasNoErrors();

        $this->patch("/admin/categorias/{$categoria->id}/aplicar-tono")
            ->assertSessionHasNoErrors();

        foreach ($categoria->productos()->get() as $producto) {
            $this->assertSame('#aaaaaa', $producto->fresh()->tono['fondo']);
        }
    }

    public function test_no_se_puede_borrar_una_familia_con_productos(): void
    {
        $this->actingAs($this->admin);

        $categoria = Categoria::whereHas('productos')->firstOrFail();

        $this->delete("/admin/categorias/{$categoria->id}")->assertSessionHas('error');

        $this->assertDatabaseHas('categorias', ['id' => $categoria->id]);
    }

    public function test_crear_una_familia_desde_el_panel(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/categorias', [
            'nombre' => 'Mermeladas',
            'descripcion' => 'Frutos rojos',
            'tono' => ['fondo' => '#101010', 'contenido' => '#202020', 'acento' => '#303030', 'tapa' => '#404040'],
            'activo' => true,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('categorias', ['nombre' => 'Mermeladas', 'slug' => 'mermeladas']);

        $this->assertSame('#101010', Categoria::where('slug', 'mermeladas')->firstOrFail()->tono['fondo']);
    }

    public function test_agregar_un_plato_nuevo_desde_el_panel_lo_hace_disponible_para_los_productos(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/catalogos/platos', ['nombre' => 'Empanadas de viento', 'emoji' => '🥠'])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('platos', ['id' => 'empanadas-de-viento']);

        $this->post('/admin/productos', $this->datosProducto(['platos_recomendados' => ['empanadas-de-viento']]))
            ->assertSessionHasNoErrors();

        $this->assertContains('empanadas-de-viento', Producto::where('nombre', 'Producto Heredado')->firstOrFail()->platos_recomendados);
    }

    public function test_un_plato_en_uso_se_desactiva_en_vez_de_borrarse(): void
    {
        $this->actingAs($this->admin);

        $producto = Producto::whereNotNull('platos_recomendados')->firstOrFail();
        $plato = collect($producto->platos_recomendados)->first();

        $this->delete("/admin/catalogos/platos/{$plato}")->assertSessionHas('error');

        $this->assertDatabaseHas('platos', ['id' => $plato, 'activo' => false]);
    }

    public function test_un_plato_sin_uso_se_borra(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/catalogos/platos', ['nombre' => 'Plato Libre', 'emoji' => '🍽️'])
            ->assertSessionHasNoErrors();

        $this->delete('/admin/catalogos/platos/plato-libre')->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('platos', ['id' => 'plato-libre']);
    }

    public function test_agregar_un_nivel_de_picante_nuevo_lo_acepta_el_formulario_de_productos(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/catalogos/niveles', [
            'nombre' => 'Fuego de la hécula',
            'chilis' => 5,
            'descripcion' => 'No recommended',
        ])->assertSessionHasNoErrors();

        $this->post('/admin/productos', $this->datosProducto(['nivel_picante' => 'fuego-de-la-hecula']))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('productos', ['nombre' => 'Producto Heredado', 'nivel_picante' => 'fuego-de-la-hecula']);
    }

    public function test_el_tipo_limitado_que_ya_existe_ahora_se_puede_editar(): void
    {
        $this->actingAs($this->admin);

        // 'limitado' no estaba en la lista del modelo, asi que editar una
        // promocion con ese tipo fallaba la validacion.
        $this->assertDatabaseHas('tipos_promocion', ['id' => 'limitado']);

        $this->post('/admin/promociones', [
            'titulo' => 'Promo Limitada',
            'descripcion' => 'Prueba del tipo que faltaba',
            'tipo' => 'limitado',
            'descuento' => 10,
            'activa' => true,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('promociones', ['titulo' => 'Promo Limitada', 'tipo' => 'limitado']);
    }

    public function test_cambiar_el_estado_de_un_pedido_acepta_un_estado_agregado_desde_el_panel(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/catalogos/estados', ['nombre' => 'Reagendado', 'tono' => 'dorado-suave'])
            ->assertSessionHasNoErrors();

        $pedido = Pedido::firstOrFail();

        $this->patch("/admin/pedidos/{$pedido->id}/estado", ['estado' => 'reagendado'])
            ->assertSessionHasNoErrors();

        $this->assertSame('reagendado', $pedido->fresh()->estado);
    }

    public function test_el_catalogo_de_estados_sigue_siendo_el_que_usa_el_panel(): void
    {
        $this->actingAs($this->admin);

        $props = $this->pagina($this->get('/admin/pedidos'))['props'];

        $estados = collect($props['estados'])->pluck('id');

        $this->assertTrue($estados->contains('nuevo'));
        $this->assertTrue($estados->contains('entregado'));
    }

    public function test_una_categoria_que_no_existe_no_puede_guardarse(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/catalogos/platos', ['nombre' => 'x'])->assertSessionHasNoErrors();
        $this->delete('/admin/catalogos/platos/x');

        // Un catalogo desconocido no debe llegar a tocar ninguna tabla.
        $this->post('/admin/catalogos/inventado', ['nombre' => 'nada'])->assertNotFound();
    }

    public function test_no_se_puede_agregar_un_plato_con_un_nombre_repetido_generando_ids_distintos(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/catalogos/platos', ['nombre' => 'Parrillada', 'emoji' => '🔥'])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('platos', ['id' => 'parrillada-2']);
    }

    public function test_las_promociones_existentes_conservan_su_tipo_al_abrir_el_formulario(): void
    {
        $this->actingAs($this->admin);

        $promocion = Promocion::where('tipo', 'limitado')->firstOrFail();

        $this->get("/admin/promociones/{$promocion->id}/edit")->assertOk()->assertSessionHasNoErrors();
    }

    public function test_las_pantallas_de_familias_y_catalogos_abren_con_sus_datos(): void
    {
        $this->actingAs($this->admin);

        $familias = $this->pagina($this->get('/admin/categorias'))['props'];
        $catalogos = $this->pagina($this->get('/admin/catalogos'))['props'];

        $primera = collect($familias['categorias'])->first();

        $this->assertSame('Encurtidos', $primera['nombre']);
        $this->assertArrayHasKey('fondo', $primera['tono']);

        $this->assertSame(
            ['platos', 'niveles', 'estados', 'tipos'],
            collect($catalogos['catalogos'])->pluck('clave')->all(),
        );

        $platos = collect($catalogos['catalogos'])->firstWhere('clave', 'platos');
        $this->assertCount(12, $platos['filas']);
    }

    public function test_una_instalacion_nueva_deja_todas_las_familias_con_paleta(): void
    {
        // La migracion del tono corre antes que los seeders, asi que sin esto
        // una base recien creada queda con las familias sin color.
        $this->assertSame(
            Categoria::query()->count(),
            Categoria::query()->whereNotNull('tono')->count(),
        );
    }

    public function test_la_paleta_de_la_familia_se_deriva_del_frasco_que_mas_se_usa(): void
    {
        $categoria = Categoria::query()->where('slug', 'encurtidos')->firstOrFail();

        $esperado = $categoria->productos()
            ->pluck('tono')
            ->countBy(fn (array $tono) => json_encode($tono))
            ->sortDesc()
            ->keys()
            ->first();

        $this->assertSame(json_decode($esperado, true), $categoria->tono);
    }

    public function test_asignar_paletas_no_pisa_el_color_que_ya_eligio_el_admin(): void
    {
        $categoria = Categoria::query()->where('slug', 'picantes')->firstOrFail();
        $elegido = ['fondo' => '#111111', 'contenido' => '#222222', 'acento' => '#333333', 'tapa' => '#444444'];

        $categoria->update(['tono' => $elegido]);

        $this->seed(PaletaFamiliasSeeder::class);

        $this->assertSame($elegido, $categoria->fresh()->tono);
    }

    public function test_sembrar_de_nuevo_no_pisa_lo_que_se_edito_en_el_panel(): void
    {
        $plato = Plato::query()->where('id', 'parrillada')->firstOrFail();
        $nivel = NivelPicante::query()->where('id', 'suave')->firstOrFail();
        $estado = EstadoPedido::query()->where('id', 'nuevo')->firstOrFail();

        $plato->update(['nombre' => 'Parrillada de la casa', 'emoji' => '🍢', 'orden' => 99, 'activo' => false]);
        $nivel->update(['nombre' => 'Sin picante', 'chilis' => 7, 'orden' => 99]);
        $estado->update(['nombre' => 'Recibido', 'tono' => 'verde', 'orden' => 99]);

        // Lo que corre en cada deploy.
        $this->seed(CatalogosSeeder::class);

        $this->assertSame('Parrillada de la casa', $plato->fresh()->nombre);
        $this->assertSame('🍢', $plato->fresh()->emoji);
        $this->assertSame(99, $plato->fresh()->orden);
        $this->assertFalse($plato->fresh()->activo);

        $this->assertSame('Sin picante', $nivel->fresh()->nombre);
        $this->assertSame(7, $nivel->fresh()->chilis);

        $this->assertSame('Recibido', $estado->fresh()->nombre);
        $this->assertSame('verde', $estado->fresh()->tono);
    }

    public function test_sembrar_de_nuevo_no_crea_duplicados_ni_borra_los_editados(): void
    {
        $antes = [
            'platos' => Plato::query()->count(),
            'niveles' => NivelPicante::query()->count(),
            'estados' => EstadoPedido::query()->count(),
            'tipos' => TipoPromocion::query()->count(),
        ];

        $this->seed(CatalogosSeeder::class);
        $this->seed(CatalogosSeeder::class);

        $this->assertSame($antes['platos'], Plato::query()->count());
        $this->assertSame($antes['niveles'], NivelPicante::query()->count());
        $this->assertSame($antes['estados'], EstadoPedido::query()->count());
        $this->assertSame($antes['tipos'], TipoPromocion::query()->count());
    }

    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    private function datosProducto(array $extra = []): array
    {
        return array_merge([
            'nombre' => 'Producto Heredado',
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
        ], $extra);
    }

    /**
     * @return array<string, mixed>
     */
    private function pagina(TestResponse $response): array
    {
        preg_match(
            '#<script data-page="app" type="application/json">(.*?)</script>#s',
            $response->getContent(),
            $matches,
        );

        return json_decode(html_entity_decode($matches[1] ?? '{}'), true) ?: [];
    }
}

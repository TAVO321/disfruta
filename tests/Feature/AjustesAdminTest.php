<?php

namespace Tests\Feature;

use App\Models\Ajuste;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AjustesAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        $this->admin = User::where('is_admin', true)->firstOrFail();
    }

    public function test_la_pagina_de_ajustes_requiere_sesion_de_admin(): void
    {
        $this->get('/admin/ajustes')->assertRedirect('/admin/acceso');

        $this->actingAs(User::create([
            'name' => 'Cliente Común',
            'email' => 'comun-ajustes@disfruta.bo',
            'password' => 'disfruta2026',
            'is_admin' => false,
        ]));

        $this->get('/admin/ajustes')->assertForbidden();
    }

    public function test_la_pagina_de_ajustes_manda_los_campos_editables(): void
    {
        $this->actingAs($this->admin);

        $response = $this->get('/admin/ajustes')->assertOk();

        preg_match(
            '#<script data-page="app" type="application/json">(.*?)</script>#s',
            $response->getContent(),
            $matches
        );
        $json = json_decode($matches[1] ?? '', true);

        $this->assertSame('Admin/Ajustes/Index', $json['component']);

        $claves = array_column($json['props']['ajustes'], 'clave');
        $this->assertSame(['whatsapp', 'zonas_entrega', 'horario_atencion', 'banco'], $claves);

        // El valor guardado tiene que llegar al formulario, no vacio.
        $porClave = array_column($json['props']['ajustes'], 'valor', 'clave');
        $this->assertSame(Ajuste::valor('whatsapp'), $porClave['whatsapp']);
    }

    public function test_guarda_los_ajustes_editados(): void
    {
        $this->actingAs($this->admin);

        $this->put('/admin/ajustes', [
            'whatsapp' => '59171234567',
            'zonas_entrega' => 'Sopocachi|Cotocolma',
            'horario_atencion' => 'Lunes a viernes de 8:00 a 18:00',
            'banco' => 'Banco Nacional, cuenta 12345678-9',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('ajustes', ['clave' => 'whatsapp', 'valor' => '59171234567']);
        $this->assertDatabaseHas('ajustes', ['clave' => 'banco', 'valor' => 'Banco Nacional, cuenta 12345678-9']);
    }

    public function test_el_whatsapp_invalido_se_rechaza(): void
    {
        $this->actingAs($this->admin);

        $this->put('/admin/ajustes', [
            'whatsapp' => '+54 9 11 1234-5678',
            'zonas_entrega' => '',
            'horario_atencion' => '',
            'banco' => '',
        ])->assertSessionHasErrors('whatsapp');

        $this->assertSame('59170000000', Ajuste::valor('whatsapp'));
    }

    /**
     * Ajuste::valor() cachea por 1 hora, asi que guardar tiene que limpiar la
     * cache o la web seguiria mostrando el numero viejo.
     */
    public function test_guardar_invalida_el_cache_del_ajuste(): void
    {
        $this->actingAs($this->admin);

        $this->assertSame('59170000000', Ajuste::valor('whatsapp'));

        $this->put('/admin/ajustes', [
            'whatsapp' => '59179999999',
            'zonas_entrega' => '',
            'horario_atencion' => '',
            'banco' => '',
        ])->assertSessionHasNoErrors();

        $this->assertSame('59179999999', Ajuste::valor('whatsapp'));
    }
}

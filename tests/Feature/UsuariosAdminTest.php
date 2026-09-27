<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UsuariosAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        $this->admin = User::where('is_admin', true)->firstOrFail();
    }

    public function test_la_pagina_de_usuarios_requiere_sesion_de_admin(): void
    {
        $this->get('/admin/usuarios')->assertRedirect('/admin/acceso');

        $this->actingAs(User::create([
            'name' => 'Cliente Común',
            'email' => 'comun-usuarios@disfruta.bo',
            'password' => 'disfruta2026',
            'is_admin' => false,
        ]));

        $this->get('/admin/usuarios')->assertForbidden();
    }

    public function test_la_pagina_de_usuarios_lista_las_cuentas_sin_exponer_el_hash(): void
    {
        $this->actingAs($this->admin);

        $response = $this->get('/admin/usuarios')->assertOk();

        preg_match(
            '#<script data-page="app" type="application/json">(.*?)</script>#s',
            $response->getContent(),
            $matches
        );
        $json = json_decode($matches[1] ?? '', true);

        $this->assertSame('Admin/Usuarios/Index', $json['component']);
        $this->assertNotEmpty($json['props']['usuarios']);
        $this->assertSame($this->admin->id, $json['props']['actual']);

        foreach ($json['props']['usuarios'] as $usuario) {
            $this->assertArrayNotHasKey('password', $usuario);
        }
    }

    public function test_crea_una_cuenta_de_administrador(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/usuarios', [
            'name' => 'Segunda Admin',
            'email' => 'segunda@disfruta.bo',
            'password' => 'claveSegura123',
            'is_admin' => true,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('users', ['email' => 'segunda@disfruta.bo', 'is_admin' => true]);

        $creada = User::where('email', 'segunda@disfruta.bo')->firstOrFail();
        $this->assertTrue(Hash::check('claveSegura123', $creada->password));
    }

    public function test_no_se_puede_crear_una_cuenta_con_un_correo_repetido(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/usuarios', [
            'name' => 'Duplicada',
            'email' => $this->admin->email,
            'password' => 'claveSegura123',
            'is_admin' => true,
        ])->assertSessionHasErrors('email');
    }

    public function test_editar_sin_password_no_cambia_la_contrasena(): void
    {
        $this->actingAs($this->admin);

        $this->post('/admin/usuarios', [
            'name' => 'Tercera Admin',
            'email' => 'tercera@disfruta.bo',
            'password' => 'claveOriginal123',
            'is_admin' => true,
        ])->assertSessionHasNoErrors();

        $tercera = User::where('email', 'tercera@disfruta.bo')->firstOrFail();

        $this->put('/admin/usuarios/'.$tercera->id, [
            'name' => 'Tercera Admin Renombrada',
            'email' => 'tercera@disfruta.bo',
            'password' => '',
            'is_admin' => true,
        ])->assertSessionHasNoErrors();

        $tercera->refresh();

        $this->assertSame('Tercera Admin Renombrada', $tercera->name);
        $this->assertTrue(Hash::check('claveOriginal123', $tercera->password));
    }

    public function test_editar_con_password_si_la_cambia(): void
    {
        $this->actingAs($this->admin);

        $otro = User::create([
            'name' => 'Admin Prueba',
            'email' => 'prueba@disfruta.bo',
            'password' => 'claveVieja123',
            'is_admin' => true,
        ]);

        $this->put('/admin/usuarios/'.$otro->id, [
            'name' => 'Admin Prueba',
            'email' => 'prueba@disfruta.bo',
            'password' => 'claveNueva456',
            'is_admin' => true,
        ])->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('claveNueva456', $otro->fresh()->password));
    }

    public function test_no_se_puede_quitarle_el_acceso_al_unico_administrador(): void
    {
        $this->actingAs($this->admin);

        $this->assertSame(1, User::where('is_admin', true)->count());

        $this->put('/admin/usuarios/'.$this->admin->id, [
            'name' => $this->admin->name,
            'email' => $this->admin->email,
            'password' => '',
            'is_admin' => false,
        ])->assertSessionHasErrors('is_admin');

        $this->assertTrue($this->admin->fresh()->is_admin);
    }

    public function test_no_se_puede_eliminar_al_unico_administrador(): void
    {
        $this->actingAs($this->admin);

        $this->delete('/admin/usuarios/'.$this->admin->id)->assertSessionHasErrors('usuario');

        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }

    public function test_no_se_puede_eliminar_la_propia_cuenta(): void
    {
        $this->actingAs($this->admin);

        $otro = User::create([
            'name' => 'Otro Admin',
            'email' => 'otro@disfruta.bo',
            'password' => 'claveSegura123',
            'is_admin' => true,
        ]);

        $this->delete('/admin/usuarios/'.$this->admin->id)->assertSessionHasErrors('usuario');
        $this->delete('/admin/usuarios/'.$otro->id)->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $otro->id]);
    }

    public function test_quitar_el_acceso_cierra_las_sesiones_abiertas(): void
    {
        $otro = User::create([
            'name' => 'Admin Con Sesion',
            'email' => 'sesion@disfruta.bo',
            'password' => 'claveSegura123',
            'is_admin' => true,
        ]);

        // actingAs no escribe en la tabla sessions, asi que se simula a mano
        // una sesion abierta por ese usuario.
        DB::table('sessions')->insert([
            'id' => 'sesion-de-prueba',
            'user_id' => $otro->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'test',
            'payload' => 'x',
            'last_activity' => now()->timestamp,
        ]);

        $this->assertDatabaseHas('sessions', ['user_id' => $otro->id]);

        $this->actingAs($this->admin);
        $this->put('/admin/usuarios/'.$otro->id, [
            'name' => $otro->name,
            'email' => $otro->email,
            'password' => '',
            'is_admin' => false,
        ])->assertSessionHasNoErrors();

        $this->assertFalse($otro->fresh()->is_admin);
        $this->assertDatabaseMissing('sessions', ['user_id' => $otro->id]);
    }

    public function test_una_cuenta_que_sigue_siendo_admin_conserva_su_sesion(): void
    {
        DB::table('sessions')->insert([
            'id' => 'sesion-que-sobrevive',
            'user_id' => $this->admin->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'test',
            'payload' => 'x',
            'last_activity' => now()->timestamp,
        ]);

        $this->actingAs($this->admin);
        $this->put('/admin/usuarios/'.$this->admin->id, [
            'name' => 'Administrador Renombrado',
            'email' => $this->admin->email,
            'password' => '',
            'is_admin' => true,
        ])->assertSessionHasNoErrors();

        $this->assertSame('Administrador Renombrado', $this->admin->fresh()->name);
        $this->assertDatabaseHas('sessions', ['id' => 'sesion-que-sobrevive']);
    }

    public function test_editar_una_cuenta_que_ya_no_es_admin_conserva_su_sesion(): void
    {
        $comun = User::create([
            'name' => 'Cliente Comun',
            'email' => 'comun-editado@disfruta.bo',
            'password' => 'disfruta2026',
            'is_admin' => false,
        ]);

        DB::table('sessions')->insert([
            'id' => 'sesion-de-un-cliente',
            'user_id' => $comun->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'test',
            'payload' => 'x',
            'last_activity' => now()->timestamp,
        ]);

        $this->actingAs($this->admin);
        $this->put('/admin/usuarios/'.$comun->id, [
            'name' => 'Cliente Renombrado',
            'email' => $comun->email,
            'password' => '',
            'is_admin' => false,
        ])->assertSessionHasNoErrors();

        $this->assertSame('Cliente Renombrado', $comun->fresh()->name);
        $this->assertDatabaseHas('sessions', ['id' => 'sesion-de-un-cliente']);
    }
}

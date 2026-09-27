<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Crea la cuenta de arranque solo si todavia no hay ningun administrador.
     *
     * Usa firstOrCreate en vez de updateOrCreate a proposito: el panel permite
     * editar y eliminar cuentas, asi que un redeploy no debe resetear la
     * contrasena ni recrear al administrador que se haya dado de baja.
     */
    public function run(): void
    {
        if (User::where('is_admin', true)->exists()) {
            return;
        }

        User::create([
            'name' => env('ADMIN_NAME', 'Administrador'),
            'email' => env('ADMIN_EMAIL', 'admin@disfruta.bo'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'disfruta2026')),
            'is_admin' => true,
        ]);
    }
}

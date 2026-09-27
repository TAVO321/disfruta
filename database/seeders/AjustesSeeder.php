<?php

namespace Database\Seeders;

use App\Models\Ajuste;
use Illuminate\Database\Seeder;

class AjustesSeeder extends Seeder
{
    /**
     * Crea los ajustes de arranque solo si faltan.
     *
     * firstOrCreate en vez de updateOrCreate: estos valores se editan desde el
     * panel, y el deploy command vuelve a correr el seeder en cada despliegue.
     */
    public function run(): void
    {
        $ajustes = [
            'whatsapp' => '59170000000',
            'zonas_entrega' => 'Sopocachi|Zona Sur|San Miguel|Achocalla|Cotocolma|Villa Fatima',
            'horario_atencion' => 'Lunes a sábado de 9:00 a 19:00',
            'banco' => null,
        ];

        foreach ($ajustes as $clave => $valor) {
            Ajuste::firstOrCreate(['clave' => $clave], ['valor' => $valor]);
        }
    }
}

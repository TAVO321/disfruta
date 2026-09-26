<?php

namespace Database\Seeders;

use App\Models\Ajuste;
use Illuminate\Database\Seeder;

class AjustesSeeder extends Seeder
{
    public function run(): void
    {
        $ajustes = [
            'whatsapp' => '59170000000',
            'zonas_entrega' => 'Sopocachi|Zona Sur|San Miguel|Achocalla|Cotocolma|Villa Fatima',
            'horario_atencion' => 'Lunes a sábado de 9:00 a 19:00',
            'banco' => null,
        ];

        foreach ($ajustes as $clave => $valor) {
            Ajuste::updateOrCreate(['clave' => $clave], ['valor' => $valor]);
        }
    }
}

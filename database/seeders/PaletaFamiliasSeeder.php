<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Database\Seeder;

/**
 * Le da una paleta a cada familia que todavia no tiene.
 *
 * La migracion que agrega la columna corre antes que los seeders, asi que en una
 * base recien creada no hay productos todavia y se queda sin hacer. Este seeder
 * cierra ese hueco: se corre al final, cuando la mercaderia ya esta cargada, y
 * usa la misma regla de la migracion (la paleta que ya comparten sus productos).
 *
 * Solo rellena familias con la paleta vacia, asi que nunca pisa el color que
 * haya elegido alguien desde el panel.
 */
class PaletaFamiliasSeeder extends Seeder
{
    public function run(): void
    {
        $asignadas = 0;

        foreach (Categoria::query()->with('productos')->get() as $categoria) {
            if (is_array($categoria->tono) && $categoria->tono !== []) {
                continue;
            }

            $masUsada = $categoria->productos
                ->pluck('tono')
                ->filter(fn ($tono) => is_array($tono) && $tono !== [])
                ->map(fn (array $tono) => json_encode($tono))
                ->countBy()
                ->sortDesc()
                ->keys()
                ->first();

            $categoria->update([
                'tono' => $masUsada
                    ? json_decode($masUsada, true)
                    : Producto::TONO_POR_DEFECTO,
            ]);

            $asignadas++;
        }

        if ($asignadas > 0) {
            $this->command?->info("Paletas asignadas a {$asignadas} familia(s).");
        }
    }
}

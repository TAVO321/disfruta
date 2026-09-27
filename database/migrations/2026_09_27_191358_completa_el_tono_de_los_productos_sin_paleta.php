<?php

use App\Models\Producto;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Los productos creados desde el panel quedaron con la columna tono en null
     * porque el formulario no la maneja. Con el tono en null la ilustracion del
     * frasco revienta al desestructurarlo y la pagina principal queda solo con
     * el fondo crema. Se completa con la paleta por defecto de la marca.
     */
    public function up(): void
    {
        $tono = json_encode(Producto::TONO_POR_DEFECTO, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        DB::table('productos')
            ->where(function ($query) {
                $query->whereNull('tono')->orWhere('tono', 'null')->orWhere('tono', '{}');
            })
            ->update(['tono' => $tono]);
    }

    public function down(): void
    {
        // Irreversible a proposito: no se puede saber que productos tenian la
        // columna vacia antes de la migracion, y borrarle el tono a los que
        // si lo traian seria peor que dejar la migracion sin revertir.
    }
};

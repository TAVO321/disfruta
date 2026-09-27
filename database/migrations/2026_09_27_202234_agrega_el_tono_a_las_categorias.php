<?php

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * La paleta de la ilustracion del frasco pasa a ser de la categoria.
 *
 * Antes el tono vivia solo en el producto, y como el formulario del panel no
 * lo manejaba, todo producto nuevo nacia sin paleta. Con esta columna la
 * categoria es la dueña del color de la familia y el producto lo hereda al
 * crearse, que es lo que hace que un frasco nuevo de Encurtidos salga siempre
 * con el color de los demas Encurtidos.
 *
 * Cada categoria existente se siembra con la paleta que ya usan sus productos,
 * para que el vinculo sea cierto desde el primer dia y no un color inventado.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->json('tono')->nullable()->after('descripcion');
        });

        $this->sembrarTonos();
    }

    /**
     * Elige, para cada categoria, la paleta mas usada por sus productos. Las
     * familias del catalogo ya venían con un color propio, asi que con esto la
     * categoria queda afinada a la mercaderia que ya existe.
     */
    private function sembrarTonos(): void
    {
        $fallback = Producto::TONO_POR_DEFECTO;

        foreach (Categoria::with('productos')->get() as $categoria) {
            $tonos = $categoria->productos
                ->pluck('tono')
                ->filter(fn ($tono) => is_array($tono) && $tono !== [])
                ->map(fn (array $tono) => json_encode($tono))
                ->countBy()
                ->sortDesc();

            $categoria->update(['tono' => $tonos->keys()->first() ? json_decode($tonos->keys()->first(), true) : $fallback]);
        }
    }

    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropColumn('tono');
        });
    }
};

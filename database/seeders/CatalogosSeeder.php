<?php

namespace Database\Seeders;

use App\Models\EstadoPedido;
use App\Models\NivelPicante;
use App\Models\Plato;
use App\Models\TipoPromocion;
use Illuminate\Database\Seeder;

/**
 * Rescate de los catalogos que antes vivian en el codigo.
 *
 * Estos datos estaban repartidos entre app/Lib/Platos.php,
 * app/Lib/NivelPicante.php, Pedido::ESTADOS, Promocion::TIPOS y una copia en
 * resources/js/lib/config.js. Agregar un plato o un nivel de picante exigia un
 * deploy y tocar cuatro archivos. Ahora viven en la base y se editan desde el
 * panel.
 *
 * El identificador de cada fila es el mismo texto que ya guardan las columnas
 * que lo referencian, asi que sembrar esto no reescribe ni invalida ningun
 * producto, pedido o promocion que ya exista.
 *
 * Solo inserta lo que falta: usa firstOrCreate, no updateOrInsert. Si se
 * escribiera con updateOrInsert, cada deploy pisaria los nombres, emojis y
 * colores que el negocio edito desde el panel, y el catalogo seria ineditable
 * en la practica. Va en la parte siempre-activa de ProductionSeeder justamente
 * porque es inocuo de correr: no duplica y no pisa nada.
 */
class CatalogosSeeder extends Seeder
{
    public function run(): void
    {
        $this->platos();
        $this->nivelesDePicante();
        $this->estadosDePedido();
        $this->tiposDePromocion();
    }

    private function platos(): void
    {
        $platos = [
            ['id' => 'parrillada', 'nombre' => 'Parrillada', 'emoji' => '🔥'],
            ['id' => 'choripan', 'nombre' => 'Choripán', 'emoji' => '🥖'],
            ['id' => 'hamburguesas', 'nombre' => 'Hamburguesas', 'emoji' => '🍔'],
            ['id' => 'pollo', 'nombre' => 'Pollo', 'emoji' => '🍗'],
            ['id' => 'pique-macho', 'nombre' => 'Pique macho', 'emoji' => '🍖'],
            ['id' => 'carnes', 'nombre' => 'Carnes', 'emoji' => '🥩'],
            ['id' => 'pastas', 'nombre' => 'Pastas', 'emoji' => '🍝'],
            ['id' => 'empanadas', 'nombre' => 'Empanadas', 'emoji' => '🥟'],
            ['id' => 'pizzas', 'nombre' => 'Pizzas', 'emoji' => '🍕'],
            ['id' => 'papas', 'nombre' => 'Papas y guarniciones', 'emoji' => '🥔'],
            ['id' => 'tacos', 'nombre' => 'Tacos y wraps', 'emoji' => '🌮'],
            ['id' => 'queso', 'nombre' => 'Quesos y tablas', 'emoji' => '🧀'],
        ];

        foreach ($platos as $indice => $plato) {
            Plato::firstOrCreate(
                ['id' => $plato['id']],
                ['nombre' => $plato['nombre'], 'emoji' => $plato['emoji'], 'orden' => $indice + 1],
            );
        }
    }

    private function nivelesDePicante(): void
    {
        $niveles = [
            ['id' => 'suave', 'nombre' => 'Suave', 'chilis' => 0, 'descripcion' => 'Para todos los paladares'],
            ['id' => 'medio', 'nombre' => 'Medio', 'chilis' => 1, 'descripcion' => 'Un toque que se nota'],
            ['id' => 'picante', 'nombre' => 'Picante', 'chilis' => 2, 'descripcion' => 'Marcado y aromático'],
            ['id' => 'muy-picante', 'nombre' => 'Muy picante', 'chilis' => 3, 'descripcion' => 'Para los que la buscan'],
            ['id' => 'infierno', 'nombre' => 'Infierno', 'chilis' => 4, 'descripcion' => 'Sin vuelta atrás'],
        ];

        foreach ($niveles as $indice => $nivel) {
            NivelPicante::firstOrCreate(
                ['id' => $nivel['id']],
                [
                    'nombre' => $nivel['nombre'],
                    'chilis' => $nivel['chilis'],
                    'descripcion' => $nivel['descripcion'],
                    'orden' => $indice + 1,
                ],
            );
        }
    }

    private function estadosDePedido(): void
    {
        // El tono es el token de color del badge (--color-dorado,
        // --color-dorado-suave, etc). Entregado y cancelado son finales: el
        // panel no ofrece volver atras desde ahi.
        $estados = [
            ['id' => 'nuevo', 'nombre' => 'Nuevo', 'tono' => 'dorado', 'es_final' => false],
            ['id' => 'confirmado', 'nombre' => 'Confirmado', 'tono' => 'verde', 'es_final' => false],
            ['id' => 'preparando', 'nombre' => 'Preparando', 'tono' => 'dorado-suave', 'es_final' => false],
            ['id' => 'entregado', 'nombre' => 'Entregado', 'tono' => 'verde-suave', 'es_final' => true],
            ['id' => 'cancelado', 'nombre' => 'Cancelado', 'tono' => 'rojo', 'es_final' => true],
        ];

        foreach ($estados as $indice => $estado) {
            EstadoPedido::firstOrCreate(
                ['id' => $estado['id']],
                [
                    'nombre' => $estado['nombre'],
                    'tono' => $estado['tono'],
                    'es_final' => $estado['es_final'],
                    'orden' => $indice + 1,
                ],
            );
        }
    }

    private function tiposDePromocion(): void
    {
        // 'limitado' faltaba en la lista del modelo y hay al menos una
        // promocion con ese tipo en la base, asi que al editarla la validacion
        // la rechazaba. Va incluido para que el panel acepte lo que ya existe.
        $tipos = [
            ['id' => 'oferta', 'nombre' => 'Oferta', 'descripcion' => 'Precio rebajado sobre un producto'],
            ['id' => 'combo', 'nombre' => 'Combo', 'descripcion' => 'Varios productos a un precio conjunto'],
            ['id' => 'temporada', 'nombre' => 'Temporada', 'descripcion' => 'Promocion de fecha o temporada'],
            ['id' => 'limitado', 'nombre' => 'Cantidad limitada', 'descripcion' => 'Disponible hasta agotar el stock'],
        ];

        foreach ($tipos as $indice => $tipo) {
            TipoPromocion::firstOrCreate(
                ['id' => $tipo['id']],
                [
                    'nombre' => $tipo['nombre'],
                    'descripcion' => $tipo['descripcion'],
                    'orden' => $indice + 1,
                ],
            );
        }
    }
}

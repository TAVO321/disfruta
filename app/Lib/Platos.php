<?php

namespace App\Lib;

class Platos
{
    /**
     * Fuente unica de la lista de platos. Se comparte con el frontend por
     * props de Inertia para no duplicarla en JS.
     */
    public static function todos(): array
    {
        return [
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
    }
}

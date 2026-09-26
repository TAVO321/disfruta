<?php

namespace App\Lib;

class NivelPicante
{
    /**
     * Fuente unica de los niveles de picante. Se comparte con el frontend
     * por props de Inertia para no duplicarla en JS.
     */
    public static function todos(): array
    {
        return [
            ['id' => 'suave', 'nombre' => 'Suave', 'chilis' => 0, 'descripcion' => 'Para todos los paladares'],
            ['id' => 'medio', 'nombre' => 'Medio', 'chilis' => 1, 'descripcion' => 'Un toque que se nota'],
            ['id' => 'picante', 'nombre' => 'Picante', 'chilis' => 2, 'descripcion' => 'Marcado y aromático'],
            ['id' => 'muy-picante', 'nombre' => 'Muy picante', 'chilis' => 3, 'descripcion' => 'Para los que la buscan'],
            ['id' => 'infierno', 'nombre' => 'Infierno', 'chilis' => 4, 'descripcion' => 'Sin vuelta atrás'],
        ];
    }

    /** @return array<int,string> */
    public static function ids(): array
    {
        return array_column(self::todos(), 'id');
    }
}

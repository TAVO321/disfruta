<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Resena;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ResenaController extends Controller
{
    /**
     * Guarda una reseña publica. Queda con visible=false a la espera de que
     * el administrador la apruebe, por eso la columna existe.
     */
    public function store(Request $request, Producto $producto): RedirectResponse
    {
        abort_unless($producto->activo, 404);

        $datos = $request->validate([
            'autor' => ['required', 'string', 'max:60'],
            'estrellas' => ['required', 'integer', 'min:1', 'max:5'],
            'texto' => ['required', 'string', 'min:10', 'max:600'],
            // Campo trampa: si viene relleno es un bot.
            'sitio_web' => ['prohibited'],
        ], [
            'texto.min' => 'Contanos un poco más (mínimo 10 caracteres).',
            'sitio_web.prohibited' => 'Reseña rechazada.',
        ]);

        $resena = $producto->resenas()->create([
            'autor' => $datos['autor'],
            'estrellas' => $datos['estrellas'],
            'texto' => $datos['texto'],
            'visible' => false,
        ]);

        return back()->with(
            'success',
            $resena->wasRecentlyCreated
                ? '¡Gracias! Tu reseña quedó pendiente de aprobación.'
                : 'Reseña registrada.',
        );
    }
}

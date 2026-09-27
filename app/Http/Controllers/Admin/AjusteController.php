<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ajuste;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AjusteController extends Controller
{
    /** Claves editables desde el panel, con su etiqueta y tipo de campo. */
    private const CAMPOS = [
        'whatsapp' => ['etiqueta' => 'Numero de WhatsApp', 'tipo' => 'telefono', 'ayuda' => 'Solo numeros, con codigo de pais. Se usa en los botones de contacto y los enlaces wa.me.'],
        'zonas_entrega' => ['etiqueta' => 'Zonas de entrega', 'tipo' => 'lista', 'ayuda' => 'Separalas con |. Es la lista que se muestra en el carrito y el pie de pagina.'],
        'horario_atencion' => ['etiqueta' => 'Horario de atencion', 'tipo' => 'texto', 'ayuda' => 'Por ejemplo: Lunes a sabado de 9:00 a 19:00.'],
        'banco' => ['etiqueta' => 'Datos bancarios', 'tipo' => 'texto', 'ayuda' => 'Se muestran al confirmar el pedido. Dejalo vacio si no cobras por transferencia.'],
    ];

    public function index(): Response
    {
        $valores = Ajuste::whereIn('clave', array_keys(self::CAMPOS))
            ->pluck('valor', 'clave')
            ->all();

        return Inertia::render('Admin/Ajustes/Index', [
            'ajustes' => collect(self::CAMPOS)->map(fn (array $meta, string $clave) => [
                'clave' => $clave,
                'etiqueta' => $meta['etiqueta'],
                'tipo' => $meta['tipo'],
                'ayuda' => $meta['ayuda'],
                'valor' => $valores[$clave] ?? '',
            ])->values(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'whatsapp' => ['required', 'string', 'regex:/^[0-9]{7,15}$/'],
            'zonas_entrega' => ['nullable', 'string', 'max:255'],
            'horario_atencion' => ['nullable', 'string', 'max:255'],
            'banco' => ['nullable', 'string', 'max:255'],
        ], [
            'whatsapp.regex' => 'El WhatsApp debe tener entre 7 y 15 digitos, sin el + ni espacios.',
        ]);

        foreach ($datos as $clave => $valor) {
            Ajuste::guardar($clave, $valor);
        }

        return back()->with('success', 'Ajustes guardados.');
    }
}

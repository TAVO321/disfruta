<?php

namespace App\Http\Middleware;

use App\Models\Ajuste;
use App\Models\Categoria;
use App\Models\NivelPicante;
use App\Models\Plato;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * Lo que se comparte aca viaja en todas las paginas, asi que cada prop se
     * cobra en cada request: son 4 consultas fijas y ~2,9 KB que se pagan
     * tambien en /nosotros, que no muestra un solo producto. Los catalogos que
     * solo necesita el panel (estados de pedido, tipos de promocion) los pasan
     * los controladores de esas paginas, no desde aca.
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email', 'is_admin'),
            ],

            // El scope activas() ya ordena por orden.
            'categorias' => fn () => Categoria::activas()
                ->get(['id', 'slug', 'nombre', 'tono'])
                ->all(),

            'platos' => fn () => Plato::catalogo(),

            'niveles' => fn () => NivelPicante::catalogo(),

            'ajustes' => function () {
                $valores = Ajuste::todos();

                return [
                    'whatsapp' => $valores['whatsapp'] ?? '',
                    'zonasEntrega' => array_values(array_filter(explode('|', (string) ($valores['zonas_entrega'] ?? '')))),
                    'horarios' => $valores['horario_atencion'] ?? '',
                ];
            },

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}

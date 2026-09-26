<?php

namespace App\Http\Middleware;

use App\Lib\NivelPicante;
use App\Lib\Platos;
use App\Models\Ajuste;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user()?->only('id', 'name', 'email', 'is_admin'),
            ],

            'categorias' => fn () => Categoria::activas()
                ->orderBy('orden')
                ->get(['id', 'slug', 'nombre'])
                ->all(),

            'platos' => fn () => Platos::todos(),

            'niveles' => fn () => NivelPicante::todos(),

            'ajustes' => fn () => [
                'whatsapp' => Ajuste::valor('whatsapp', ''),
                'zonasEntrega' => array_values(array_filter(explode('|', (string) Ajuste::valor('zonas_entrega', '')))),
                'horarios' => Ajuste::valor('horario_atencion', ''),
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}

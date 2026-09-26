<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Los Resources se consumyen planos en React (producto.nombre, no
        // producto.data.nombre). Sin esto Laravel envolvería cada prop en
        // { data: ... } y el frontend leería undefined en todas las páginas.
        JsonResource::withoutWrapping();
    }
}

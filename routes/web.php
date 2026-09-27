<?php

use App\Http\Controllers\Admin\AjusteController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CatalogoController;
use App\Http\Controllers\Admin\CategoriaController;
use App\Http\Controllers\Admin\ClienteController;
use App\Http\Controllers\Admin\LoteController;
use App\Http\Controllers\Admin\PanelController;
use App\Http\Controllers\Admin\PedidoController;
use App\Http\Controllers\Admin\ProductoController;
use App\Http\Controllers\Admin\PromocionController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\ResenaController;
use App\Http\Controllers\TiendaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TiendaController::class, 'home'])->name('home');
Route::get('/catalogo', [TiendaController::class, 'catalogo'])->name('catalogo');
Route::get('/catalogo/{producto:slug}', [TiendaController::class, 'detalle'])->name('catalogo.detalle');
Route::post('/catalogo/{producto:slug}/resenas', [ResenaController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('catalogo.resenas.store');
Route::get('/promociones', [TiendaController::class, 'promociones'])->name('promociones');
Route::get('/nosotros', [TiendaController::class, 'nosotros'])->name('nosotros');
Route::get('/carrito', [CarritoController::class, 'index'])->name('carrito');
Route::post('/carrito/confirmar', [CarritoController::class, 'confirmar'])->name('carrito.confirmar');
Route::get('/carrito/confirmado/{pedido}', [CarritoController::class, 'confirmado'])->name('carrito.confirmado');

Route::get('/admin/acceso', [AuthController::class, 'mostrar'])->name('admin.acceso')->middleware('guest');
Route::post('/admin/acceso', [AuthController::class, 'entrar'])->middleware('guest');
Route::post('/admin/salir', [AuthController::class, 'salir'])->name('admin.salir')->middleware('auth');

Route::prefix('admin')->name('admin.')->middleware('auth', 'admin')->group(function () {
    Route::get('/', [PanelController::class, 'index'])->name('panel');

    Route::resource('productos', ProductoController::class)
        ->except(['show'])
        ->parameters(['productos' => 'producto']);

    Route::resource('lotes', LoteController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('pedidos', [PedidoController::class, 'index'])->name('pedidos');
    Route::patch('pedidos/{pedido}/estado', [PedidoController::class, 'estado'])->name('pedidos.estado');
    Route::delete('pedidos/{pedido}', [PedidoController::class, 'destroy'])->name('pedidos.destroy');

    Route::resource('promociones', PromocionController::class)
        ->except(['show'])
        ->parameters(['promociones' => 'promocion']);
    Route::patch('promociones/{promocion}/alternar', [PromocionController::class, 'alternar'])
        ->name('promociones.alternar');
    Route::get('clientes', [ClienteController::class, 'index'])->name('clientes');
    Route::delete('clientes/{cliente}', [ClienteController::class, 'destroy'])->name('clientes.destroy');

    // Alta y edicion viven en la misma pantalla, asi que no hay create/edit.
    Route::resource('categorias', CategoriaController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['categorias' => 'categoria']);
    Route::patch('categorias/{categoria}/aplicar-tono', [CategoriaController::class, 'aplicarTono'])
        ->name('categorias.aplicar-tono');

    Route::get('catalogos', [CatalogoController::class, 'index'])->name('catalogos.index');
    Route::post('catalogos/{catalogo}', [CatalogoController::class, 'store'])->name('catalogos.store');
    Route::put('catalogos/{catalogo}/{id}', [CatalogoController::class, 'update'])->name('catalogos.update');
    Route::delete('catalogos/{catalogo}/{id}', [CatalogoController::class, 'destroy'])->name('catalogos.destroy');

    Route::get('ajustes', [AjusteController::class, 'index'])->name('ajustes.index');
    Route::put('ajustes', [AjusteController::class, 'update'])->name('ajustes.update');

    Route::resource('usuarios', UsuarioController::class)->only(['index', 'store', 'update', 'destroy']);
});

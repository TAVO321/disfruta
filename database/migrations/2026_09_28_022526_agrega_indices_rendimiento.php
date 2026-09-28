<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->index(['categoria_id', 'activo']);
            $table->index(['activo', 'stock', 'stock_minimo']);
            $table->index('nivel_picante');
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->index(['estado', 'created_at']);
        });

        Schema::table('pedido_items', function (Blueprint $table) {
            $table->index('nombre');
        });

        Schema::table('promociones', function (Blueprint $table) {
            $table->index(['activa', 'vigente_desde', 'vigente_hasta']);
        });

        Schema::table('categorias', function (Blueprint $table) {
            $table->index(['activo', 'orden']);
        });
    }

    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropIndex(['activo', 'orden']);
        });

        Schema::table('promociones', function (Blueprint $table) {
            $table->dropIndex(['activa', 'vigente_desde', 'vigente_hasta']);
        });

        Schema::table('pedido_items', function (Blueprint $table) {
            $table->dropIndex(['nombre']);
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropIndex(['estado', 'created_at']);
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex(['categoria_id', 'activo']);
            $table->dropIndex(['activo', 'stock', 'stock_minimo']);
            $table->dropIndex(['nivel_picante']);
        });
    }
};

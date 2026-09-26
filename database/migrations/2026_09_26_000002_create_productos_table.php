<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->string('slug')->unique();
            $table->string('descripcion_corta', 300);
            $table->text('descripcion');
            $table->decimal('precio', 10, 2);
            $table->decimal('precio_antes', 10, 2)->nullable();
            $table->string('presentacion', 60);
            $table->string('nivel_picante', 20)->default('suave');
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('stock_minimo')->default(0);
            $table->unsignedInteger('peso')->default(0);
            $table->json('ingredientes')->nullable();
            $table->json('platos_recomendados')->nullable();
            $table->json('tono')->nullable();
            $table->text('recomendacion_consumo')->nullable();
            $table->text('conservacion')->nullable();
            $table->string('insignia', 40)->nullable();
            $table->boolean('limitado')->default(false);
            $table->boolean('temporada')->default(false);
            $table->boolean('combo')->default(false);
            $table->boolean('destacado')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['activo', 'destacado']);
            $table->index('precio');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

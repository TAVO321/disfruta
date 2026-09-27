<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Los catalogos que antes vivian en el codigo (app/Lib/Platos,
 * app/Lib/NivelPicante, Pedido::ESTADOS y Promocion::TIPOS) pasan a ser
 * datos. La idea es que nada de lo que el negocio pueda querer cambiar quede
 * repartido entre el codigo, el frontend y la base: si hay que agregar un
 * plato, un nivel de picante o un estado de pedido, se hace desde el panel y
 * no en un deploy.
 *
 * La clave primaria de las cuatro tablas es el identificador de texto que ya
 * usan las columnas que las referencian (productos.nivel_picante,
 * productos.platos_recomendados, pedidos.estado y promociones.tipo), y no un
 * autoincremental. Por eso los pedidos en curso siguen apuntando a su estado y
 * las promociones a su tipo sin tocar una sola fila: el 'limitado' que ya
 * existe en promociones.tipo queda valido desde el primer momento.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platos', function (Blueprint $table) {
            $table->string('id', 40)->primary();
            $table->string('nombre', 80);
            $table->string('emoji', 16)->nullable();
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('niveles_picante', function (Blueprint $table) {
            $table->string('id', 40)->primary();
            $table->string('nombre', 60);
            // Cantidad de chilis que dibuja el frontend. Es presentacion, pero
            // conviene que viva junto al nivel y no en el componente.
            $table->unsignedTinyInteger('chilis')->default(0);
            $table->string('descripcion', 160)->nullable();
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('estados_pedido', function (Blueprint $table) {
            $table->string('id', 40)->primary();
            $table->string('nombre', 40);
            // Tono del badge en el panel y en la tienda.
            $table->string('tono', 20)->default('dorado');
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activo')->default(true);
            // Un estado final no ofrece volver atras en el selector del panel.
            $table->boolean('es_final')->default(false);
            $table->timestamps();
        });

        Schema::create('tipos_promocion', function (Blueprint $table) {
            $table->string('id', 40)->primary();
            $table->string('nombre', 40);
            $table->string('descripcion', 160)->nullable();
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_promocion');
        Schema::dropIfExists('estados_pedido');
        Schema::dropIfExists('niveles_picante');
        Schema::dropIfExists('platos');
    }
};

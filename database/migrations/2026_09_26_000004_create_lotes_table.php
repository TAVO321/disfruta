<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained()->cascadeOnDelete();
            $table->string('codigo', 40);
            $table->date('fecha_elaboracion');
            $table->date('fecha_consumo_recomendado');
            $table->unsignedInteger('cantidad');
            $table->unsignedInteger('restante');
            $table->timestamps();

            $table->index(['producto_id', 'restante']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lotes');
    }
};

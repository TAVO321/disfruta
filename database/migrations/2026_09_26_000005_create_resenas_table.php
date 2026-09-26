<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resenas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained()->cascadeOnDelete();
            $table->string('autor');
            $table->unsignedTinyInteger('estrellas');
            $table->text('texto');
            $table->boolean('visible')->default(true);
            $table->timestamps();

            $table->index(['producto_id', 'visible']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};

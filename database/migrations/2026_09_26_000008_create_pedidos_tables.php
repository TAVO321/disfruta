<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->nullable()->constrained()->nullOnDelete();
            $table->string('cliente_nombre');
            $table->string('telefono', 40);
            $table->string('zona', 80)->nullable();
            $table->text('notas')->nullable();
            $table->string('estado', 20)->default('nuevo');
            $table->decimal('total', 10, 2)->default(0);
            $table->timestamps();

            $table->index('estado');
            $table->index('created_at');
        });

        Schema::create('pedido_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained()->cascadeOnDelete();
            $table->foreignId('producto_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nombre');
            $table->decimal('precio', 10, 2);
            $table->unsignedInteger('cantidad');
            $table->boolean('reserva')->default(false);
            $table->decimal('subtotal', 10, 2);

            $table->index('pedido_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedido_items');
        Schema::dropIfExists('pedidos');
    }
};

<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class PedidosDemoSeeder extends Seeder
{
    private const PEDIDOS = [
        ['nombre' => 'Valentina Rojas', 'telefono' => '+591 70111222', 'zona' => 'Sopocachi', 'estado' => 'entregado', 'dias' => 12, 'notas' => 'Entregar por la tarde.'],
        ['nombre' => 'Marcelo Salinas', 'telefono' => '+591 71233445', 'zona' => 'Zona Sur', 'estado' => 'confirmado', 'dias' => 4, 'notas' => null],
        ['nombre' => 'Camila Ferrufino', 'telefono' => '+591 68455667', 'zona' => 'Achocalla', 'estado' => 'preparando', 'dias' => 2, 'notas' => 'Sin cebolla en el combo.'],
        ['nombre' => 'Diego Mamani', 'telefono' => '+591 77688990', 'zona' => 'San Miguel', 'estado' => 'nuevo', 'dias' => 0, 'notas' => 'Reserva para el próximo lote.'],
    ];

    public function run(): void
    {
        $productos = Producto::activos()->get();

        if ($productos->isEmpty()) {
            return;
        }

        foreach (self::PEDIDOS as $indice => $datos) {
            $cliente = Cliente::create([
                'nombre' => $datos['nombre'],
                'telefono' => $datos['telefono'],
                'zona' => $datos['zona'],
                'notas' => $datos['notas'],
            ]);

            $seleccion = $productos->random(random_int(2, 3));
            $items = $seleccion->map(function (Producto $producto) {
                $cantidad = random_int(1, 3);
                $reserva = (bool) random_int(0, 1);

                return [
                    'producto_id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'precio' => $producto->precio,
                    'cantidad' => $cantidad,
                    'reserva' => $reserva,
                    'subtotal' => $producto->precio * $cantidad,
                ];
            });

            $pedido = Pedido::create([
                'cliente_id' => $cliente->id,
                'cliente_nombre' => $datos['nombre'],
                'telefono' => $datos['telefono'],
                'zona' => $datos['zona'],
                'notas' => $datos['notas'],
                'estado' => $datos['estado'],
                'total' => $items->sum('subtotal'),
                'created_at' => now()->subDays($datos['dias'])->setTime(10, $indice * 7),
            ]);

            $pedido->items()->createMany($items->all());
        }
    }
}

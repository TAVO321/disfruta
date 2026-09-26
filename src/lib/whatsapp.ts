import { CATEGORIAS, MARCA, precio } from '@/lib/config'
import type { ItemCarrito, Producto } from '@/types'

export function mensajeWhatsApp(
  items: (ItemCarrito & { producto: Producto })[],
  total: number,
  datos: { nombre: string; telefono: string; zona: string; notas: string },
) {
  const filas = items.map((item, i) => {
    const subtotal = item.producto.precio * item.cantidad
    return (
      `${i + 1}. ${item.producto.nombre} (${item.producto.presentacion})` +
      ` x ${item.cantidad}` +
      `${item.reserva ? ' [RESERVA proximo lote]' : ''}` +
      ` - ${precio(subtotal)}`
    )
  })

  const hayReservas = items.some((i) => i.reserva)
  const hayStock = items.some((i) => !i.reserva)

  const cuerpo = [
    `Hola ${MARCA.nombre}! Quiero hacer este pedido:`,
    '',
    `*Cliente:* ${datos.nombre || '(a completar)'}`,
    datos.telefono ? `*Telefono:* ${datos.telefono}` : null,
    `*Zona de entrega:* ${datos.zona || '(a completar)'}`,
    '',
    '*Productos:*',
    ...filas,
    '',
    `*Total aproximado:* ${precio(total)}`,
    datos.notas ? `*Notas:* ${datos.notas}` : null,
    '',
    hayReservas && hayStock
      ? '_Incluye productos con stock y reservas del proximo lote._'
      : hayReservas
        ? '_Es una reserva del proximo lote: consulten la fecha estimada._'
        : '_Consultar disponibilidad y forma de pago al confirmar._',
  ]
    .filter((l) => l !== null)
    .join('\n')

  return encodeURIComponent(cuerpo)
}

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${MARCA.whatsapp}?text=${texto}`
}

export function mensajeConsultaSimple(asunto: string) {
  return encodeURIComponent(`Hola ${MARCA.nombre}! Quiero consultar por ${asunto}. Me contas?`)
}

export function resumenCarrito(items: (ItemCarrito & { producto: Producto })[]) {
  const categorias = new Set(items.map((i) => i.producto.categoria))
  return {
    items: items.length,
    unidades: items.reduce((n, i) => n + i.cantidad, 0),
    categorias: [...categorias]
      .map((c) => CATEGORIAS.find((x) => x.id === c)?.nombre)
      .filter(Boolean)
      .join(', '),
  }
}

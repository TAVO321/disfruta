import { MARCA, precio } from '@/lib/config'

export function mensajeWhatsApp(items, total, datos, numeroWhatsapp) {
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

export function linkWhatsApp(texto, numeroWhatsapp) {
  const numero = String(numeroWhatsapp ?? '').replace(/\D/g, '')
  // Sin numero configurado no hay enlace valido: se devuelve null para que el
  // llamador oculte el boton en vez de generar un wa.me roto.
  if (!numero) return null
  return `https://wa.me/${numero}?text=${texto}`
}

export function mensajeConsultaSimple(asunto) {
  return encodeURIComponent(`Hola ${MARCA.nombre}! Quiero consultar por ${asunto}. Me contas?`)
}

export function resumenCarrito(items) {
  const categorias = new Set(items.map((i) => i.producto.categoria?.nombre).filter(Boolean))
  return {
    items: items.length,
    unidades: items.reduce((n, i) => n + i.cantidad, 0),
    categorias: [...categorias].join(', '),
  }
}

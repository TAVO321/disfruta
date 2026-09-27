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

/**
 * Normaliza un telefono para wa.me asumiendo Bolivia como destino habitual.
 * Acepta 70123456, 070123456, +591 70123456 o 59170123456 y siempre devuelve
 * el numero con codigo de pais. Devuelve null si no hay digitos utilizables.
 */
export function telefonoWhatsApp(numero, prefijo = '591') {
  const digitos = String(numero ?? '').replace(/\D/g, '')

  if (!digitos) return null

  // Ya viene con codigo de pais: se respeta tal cual.
  if (digitos.startsWith(prefijo)) return digitos

  // Formato local: se descarta el 0 inicial y se antepone el prefijo.
  const local = digitos.replace(/^0+/, '')

  if (!local) return null

  return prefijo + local
}

/**
 * Arma el enlace de wa.me. Ojo con el orden: primero el TEXTO (ya codificado
 * con encodeURIComponent) y despues el NUMERO de destino.
 */
export function linkWhatsApp(texto, numero) {
  const destino = telefonoWhatsApp(numero)

  // Sin numero utilizable no hay enlace valido: se devuelve null para que el
  // llamador oculte el boton en vez de generar un wa.me roto.
  if (!destino) return null

  return `https://wa.me/${destino}?text=${texto}`
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

export const MARCA = {
  nombre: 'DISFRUTA',
  lema: 'El sabor que acompaña tus mejores momentos',
  descripcion:
    'Productos artesanales de alta calidad, ideales para parrilladas, reuniones, familia y celebraciones.',
}

export const MONEDA = {
  codigo: 'BOB',
  simbolo: 'Bs',
  locale: 'es-BO',
}

// Los catalogos (platos, niveles de picante, estados de pedido y tipos de
// promocion) viven en la base y llegan como props globales de Inertia, para no
// duplicarlos ni en PHP ni en JS.

/**
 * Une un tono de la base con las clases del disenio. El color del badge es un
 * dato editable desde el panel; la clase de Tailwind es codigo, y esta es la
 * unica parte del proyecto que traduce uno en otro.
 *
 * @param {string} tono token de color, por ejemplo 'dorado-suave'
 * @returns {string} clases de Tailwind
 */
export function claseTono(tono) {
  return (
    {
      dorado: 'bg-dorado text-verde',
      'dorado-claro': 'bg-dorado-claro text-verde',
      'dorado-suave': 'bg-dorado-suave text-verde',
      verde: 'bg-verde text-crema',
      'verde-medio': 'bg-verde-medio text-crema',
      'verde-claro': 'bg-verde-claro text-crema',
      'verde-suave': 'bg-verde-suave text-verde',
      crema: 'bg-crema text-verde',
      'crema-oscuro': 'bg-crema-oscuro text-verde',
      rojo: 'bg-rojo text-crema',
      'rojo-suave': 'bg-rojo-suave text-rojo',
    }[tono] ?? 'bg-crema text-verde'
  )
}

const entero = new Intl.NumberFormat(MONEDA.locale, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function precio(valor) {
  return `${MONEDA.simbolo} ${entero.format(valor)}`
}

export function numero(valor) {
  return entero.format(valor)
}

export function fecha(iso) {
  if (!iso) return '—'
  return new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(MONEDA.locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function fechaCorta(iso) {
  if (!iso) return '—'
  return new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(MONEDA.locale, {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })
}

export function fechaHora(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(MONEDA.locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function whatsappLegible(numero) {
  const limpio = String(numero || '').replace(/\D/g, '')
  if (limpio.length < 8) return numero || ''
  return `+${limpio.slice(0, 3)} ${limpio.slice(3, 6)} ${limpio.slice(6, 9)} ${limpio.slice(9)}`.trim()
}

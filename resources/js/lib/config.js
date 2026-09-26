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

// Las listas de platos y niveles de picante viven en PHP (App\Lib\Platos y
// App\Lib\NivelPicante) y llegan como props globales de Inertia para no duplicarlas.

export const ESTADOS_PEDIDO = [
  { id: 'nuevo', nombre: 'Nuevo', tono: 'dorado' },
  { id: 'confirmado', nombre: 'Confirmado', tono: 'verde' },
  { id: 'preparando', nombre: 'Preparando', tono: 'dorado' },
  { id: 'entregado', nombre: 'Entregado', tono: 'crema' },
  { id: 'cancelado', nombre: 'Cancelado', tono: 'rojo' },
]

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

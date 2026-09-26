export const MARCA = {
  nombre: 'DISFRUTA',
  lema: 'El sabor que acompaña tus mejores momentos',
  descripcion:
    'Productos artesanales de alta calidad, ideales para parrilladas, reuniones, familia y celebraciones.',
  // EDITÁ ESTOS DATOS ANTES DE PUBLICAR
  whatsapp: '59170000000',
  whatsappLegible: '+591 7 0000 0000',
  zonasEntrega: [
    'La Paz y zona central',
    'Santa Cruz de la Sierra',
    'Cochabamba y Tarija',
  ],
  horarios: 'Lunes a sábado de 9 a 20 hs',
} as const

export const MONEDA = {
  codigo: 'BOB',
  simbolo: 'Bs',
  // Contexto regional Bolivia: separador de miles "." y decimal ",".
  locale: 'es-BO',
} as const

export const NIVELES_PICANTE = [
  { id: 'suave', nombre: 'Suave', chilis: 0, descripcion: 'Para todos los paladares' },
  { id: 'medio', nombre: 'Medio', chilis: 1, descripcion: 'Un toque que se nota' },
  { id: 'picante', nombre: 'Picante', chilis: 2, descripcion: 'Marcado y aromático' },
  { id: 'muy-picante', nombre: 'Muy picante', chilis: 3, descripcion: 'Para los que la buscan' },
  { id: 'infierno', nombre: 'Infierno', chilis: 4, descripcion: 'Sin vuelta atrás' },
] as const

export const CATEGORIAS = [
  { id: 'encurtidos', nombre: 'Encurtidos', descripcion: 'Cebollas, pepinos y vegetales en vinagre' },
  { id: 'escabechos', nombre: 'Escabechos', descripcion: 'En aceite y vinagre, con especias' },
  { id: 'picantes', nombre: 'Picantes', descripcion: 'Uchus, chiles y picantes de verdad' },
  { id: 'ajos', nombre: 'Ajos y aromáticos', descripcion: 'Bases con mucho carácter' },
  { id: 'combos', nombre: 'Combos', descripcion: 'Selecciones para compartir' },
] as const

export const PLATOS = [
  { id: 'parrillada', nombre: 'Parrillada', emoji: '🔥' },
  { id: 'choripan', nombre: 'Choripán', emoji: '🥖' },
  { id: 'hamburguesas', nombre: 'Hamburguesas', emoji: '🍔' },
  { id: 'pollo', nombre: 'Pollo', emoji: '🍗' },
  { id: 'pique-macho', nombre: 'Pique macho', emoji: '🍖' },
  { id: 'carnes', nombre: 'Carnes', emoji: '🥩' },
  { id: 'pastas', nombre: 'Pastas', emoji: '🍝' },
  { id: 'empanadas', nombre: 'Empanadas', emoji: '🥟' },
  { id: 'pizzas', nombre: 'Pizzas', emoji: '🍕' },
  { id: 'papas', nombre: 'Papas y guarniciones', emoji: '🥔' },
  { id: 'tacos', nombre: 'Tacos y wraps', emoji: '🌮' },
  { id: 'queso', nombre: 'Quesos y tablas', emoji: '🧀' },
] as const

export function precio(pesos: number) {
  return `${MONEDA.simbolo} ${new Intl.NumberFormat(MONEDA.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos)}`
}

export function numero(n: number) {
  return new Intl.NumberFormat(MONEDA.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function fecha(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(MONEDA.locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function fechaCorta(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(MONEDA.locale, {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })
}

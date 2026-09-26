export type NivelPicante = 'suave' | 'medio' | 'picante' | 'muy-picante' | 'infierno'

export type CategoriaId = 'encurtidos' | 'escabechos' | 'picantes' | 'ajos' | 'combos'

export type Presentacion = 'Frasco 220 g' | 'Frasco 350 g' | 'Frasco 500 g' | 'Frasco 1 kg' | 'Pack x3' | 'Pack x6'

export type EstadoPedido = 'nuevo' | 'confirmado' | 'preparando' | 'entregado' | 'cancelado'

export interface Lote {
  id: string
  codigo: string
  fechaElaboracion: string
  fechaConsumoRecomendado: string
  cantidad: number
  restante: number
}

export interface Reseña {
  id: string
  productoId: string
  autor: string
  estrellas: number
  texto: string
  fecha: string
}

export interface Producto {
  id: string
  nombre: string
  categoria: CategoriaId
  precio: number
  precioAntes?: number
  descripcionCorta: string
  descripcion: string
  presentacion: Presentacion
  nivelPicante: NivelPicante
  stock: number
  stockMinimo: number
  activo: boolean
  destacado: boolean
  limitado: boolean
  temporada: boolean
  combo: boolean
  insignia?: string
  peso: number
  ingredientes: string[]
  recommendedPlatos: string[]
  recomendacionConsumo: string
  conservacion: string
  lotes: Lote[]
  gallery: string[]
  tono: { fondo: string; contenido: string; acento: string; tapa: string }
  creado: string
}

export interface ItemCarrito {
  productoId: string
  cantidad: number
  reserva: boolean
}

export interface Pedido {
  id: string
  cliente: string
  telefono: string
  zona: string
  items: { productoId: string; nombre: string; cantidad: number; precio: number; reserva: boolean }[]
  total: number
  notas: string
  estado: EstadoPedido
  creado: string
}

export interface Promocion {
  id: string
  titulo: string
  descripcion: string
  tipo: 'oferta' | 'combo' | 'temporada' | 'limitado'
  descuento: number
  productosIds: string[]
  activa: boolean
  vigente: string
}

export interface Cliente {
  id: string
  nombre: string
  telefono: string
  zona: string
  pedidos: number
  gastado: number
  favoritosIds: string[]
  reservasIds: string[]
  ultimoContacto: string
}

export interface ResenaGuardada {
  productoId: string
  estrellas: number
  texto: string
  autor: string
  fecha: string
}

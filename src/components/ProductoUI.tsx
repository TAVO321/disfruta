import { IlustracionFrasco } from '@/components/FrascoIlustrado'
import { precio } from '@/lib/config'
import type { NivelPicante, Producto } from '@/types'
import { IconoEstrella } from './Iconos'

const ORDEN: NivelPicante[] = ['suave', 'medio', 'picante', 'muy-picante', 'infierno']
const CHILIS = { suave: 0, medio: 1, picante: 2, 'muy-picante': 3, infierno: 4 }

export function NivelPicanteBar({
  nivel,
  conTexto = true,
  className = '',
}: {
  nivel: NivelPicante
  conTexto?: boolean
  className?: string
}) {
  const cantidad = CHILIS[nivel]
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex items-center gap-0.5" aria-hidden>
        {ORDEN.slice(0, 4).map((n, i) => (
          <svg
            key={n}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill={i < cantidad ? '#B23434' : 'none'}
            stroke={i < cantidad ? '#B23434' : '#D9CFBB'}
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path d="M12 22c3.9 0 6.5-2.4 6.5-6 0-4.4-4.3-6.2-4-11-2.3 1.2-3.2 3.4-3.2 5.4 0 1.2-1 1.8-1.7 1.1-.5-.5-.7-1.2-.6-2C7 11 5.5 13.2 5.5 16c0 3.6 2.6 6 6.5 6Z" />
          </svg>
        ))}
      </span>
      {conTexto && (
        <span className="text-xs font-medium text-tinta-suave">
          {nivel === 'suave' ? 'Sin picante' : `Picante ${nivel.replace('-', ' ')}`}
        </span>
      )}
    </span>
  )
}

export function ImagenProducto({
  producto,
  indice = 0,
  className = '',
}: {
  producto: Producto
  indice?: number
  className?: string
}) {
  const foto = producto.gallery[indice]
  if (foto) {
    return (
      <img
        src={foto}
        alt={`${producto.nombre}${indice > 0 ? ` · foto ${indice + 1}` : ''}`}
        className={`h-full w-full object-cover ${className}`}
        loading={indice === 0 ? 'eager' : 'lazy'}
      />
    )
  }
  return <IlustracionFrasco producto={producto} className={`h-full w-full ${className}`} />
}

export function Insignia({
  children,
  tono = 'verde',
}: {
  children: React.ReactNode
  tono?: 'verde' | 'dorado' | 'rojo' | 'crema'
}) {
  const tonos = {
    verde: 'bg-verde text-crema',
    dorado: 'bg-dorado text-verde',
    rojo: 'bg-rojo text-crema',
    crema: 'bg-crema text-verde border border-crema-profundo',
  }
  return (
    <span
      className={`eyebrow inline-flex items-center rounded-full px-2.5 py-1 ${tonos[tono]}`}
    >
      {children}
    </span>
  )
}

export function PrecioProducto({
  producto,
  className = 'text-lg',
}: {
  producto: Producto
  className?: string
}) {
  return (
    <span className={`font-serif font-semibold text-verde ${className}`}>
      {precio(producto.precio)}
      {producto.precioAntes && producto.precioAntes > producto.precio && (
        <span className="ml-2 text-sm font-normal text-tinta-suave line-through">
          {precio(producto.precioAntes)}
        </span>
      )}
    </span>
  )
}

export function PromedioEstrellas({ valor, cantidad }: { valor: number; cantidad: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex items-center gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <IconoEstrella key={i} llena={i <= Math.round(valor)} width={13} height={13} className="text-dorado" />
        ))}
      </span>
      <span className="text-xs font-medium text-tinta-suave">
        {valor.toFixed(1)} · {cantidad} {cantidad === 1 ? 'reseña' : 'reseñas'}
      </span>
    </span>
  )
}

export function EtiquetaStock({ producto }: { producto: Producto }) {
  if (producto.stock === 0) {
    return <Insignia tono="rojo">Sin stock</Insignia>
  }
  if (producto.stock <= producto.stockMinimo) {
    return <Insignia tono="dorado">Últimos {producto.stock}</Insignia>
  }
  return <Insignia tono="verde">Disponible</Insignia>
}

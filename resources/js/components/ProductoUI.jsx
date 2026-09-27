import { usePage } from '@inertiajs/react'
import { IlustracionFrasco } from '@/components/FrascoIlustrado'
import { precio } from '@/lib/config'
import { IconoEstrella } from './Iconos'

// Los chilis y el nombre de cada nivel llegan como prop global desde la tabla
// niveles_picante, para no duplicar el catalogo en el frontend.
export function NivelPicanteBar({ nivel, conTexto = true, className = '' }) {
  const { niveles } = usePage().props
  const definicion = (niveles ?? []).find((n) => n.id === nivel)
  const cantidad = definicion?.chilis ?? 0
  const nombre = definicion?.nombre ?? nivel

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <svg
            key={i}
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
          {nivel === 'suave' ? 'Sin picante' : `Picante ${nombre.toLowerCase()}`}
        </span>
      )}
    </span>
  )
}

export function ImagenProducto({ producto, indice = 0, className = '' }) {
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

export function Insignia({ children, tono = 'verde' }) {
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

export function PrecioProducto({ producto, className = 'text-lg' }) {
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

export function PromedioEstrellas({ valor, cantidad }) {
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

export function EtiquetaStock({ producto }) {
  if (producto.stock === 0) {
    return <Insignia tono="rojo">Sin stock</Insignia>
  }
  if (producto.stock <= producto.stockMinimo) {
    return <Insignia tono="dorado">Últimos {producto.stock}</Insignia>
  }
  return <Insignia tono="verde">Disponible</Insignia>
}

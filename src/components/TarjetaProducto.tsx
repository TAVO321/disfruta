import { useState } from 'react'
import { IconoCarrito, IconoCheck, IconoCorazon } from '@/components/Iconos'
import { EtiquetaStock, ImagenProducto, NivelPicanteBar, PrecioProducto } from '@/components/ProductoUI'
import type { Producto } from '@/types'
import { useTienda } from '@/store/tienda'

export function TarjetaProducto({
  producto,
  onVer,
  indice,
}: {
  producto: Producto
  onVer: (p: Producto) => void
  indice: number
}) {
  const { agregar, alternarFavorito, esFavorito, enCarrito } = useTienda()
  const [agregado, setAgregado] = useState(false)
  const favorito = esFavorito(producto.id)
  const agotado = producto.stock === 0

  const sumar = () => {
    agregar(producto.id, 1)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1600)
  }

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl border border-crema-profundo bg-white shadow-suave transition-all duration-300 hover:-translate-y-1 hover:shadow-media"
      style={{ animationDelay: `${Math.min(indice, 8) * 45}ms` }}
    >
      <div className="relative block aspect-4/3 w-full overflow-hidden bg-crema-oscuro">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <ImagenProducto producto={producto} />
        </div>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {producto.insignia && (
            <span
              className={`eyebrow rounded-full px-2.5 py-1 ${
                producto.stock === 0
                  ? 'bg-rojo text-crema'
                  : producto.limitado
                    ? 'bg-rojo text-crema'
                    : 'bg-verde text-crema'
              }`}
            >
              {producto.insignia}
            </span>
          )}
          {producto.temporada && producto.stock > 0 && (
            <span className="eyebrow rounded-full bg-dorado px-2.5 py-1 text-verde">
              Temporada
            </span>
          )}
        </div>

        {producto.precioAntes && producto.precioAntes > producto.precio && (
          <span className="eyebrow absolute top-3 right-3 rounded-full bg-rojo px-2.5 py-1 text-crema">
            -{Math.round((1 - producto.precio / producto.precioAntes) * 100)}%
          </span>
        )}

        <button
          type="button"
          onClick={() => onVer(producto)}
          className="absolute inset-0 cursor-pointer"
          aria-label={`Ver ${producto.nombre}`}
        />

        <button
          type="button"
          onClick={() => alternarFavorito(producto.id)}
          className="absolute right-3 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-verde shadow-suave backdrop-blur transition-colors hover:bg-rojo hover:text-white"
          aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={favorito}
        >
          <IconoCorazon lleno={favorito} width={16} height={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <NivelPicanteBar nivel={producto.nivelPicante} />
          <EtiquetaStock producto={producto} />
        </div>

        <h3 className="font-serif text-lg leading-snug font-semibold text-verde">
          <button type="button" onClick={() => onVer(producto)} className="text-left hover:text-rojo">
            {producto.nombre}
          </button>
        </h3>

        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-tinta-suave">
          {producto.descripcionCorta}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <PrecioProducto producto={producto} />
          {agotado ? (
            <span className="text-xs font-medium text-tinta-suave">
              Reserva el próximo lote
            </span>
          ) : (
            <span className="text-xs text-tinta-suave">
              {producto.stock} disp.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={agotado ? () => onVer(producto) : sumar}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide uppercase transition-colors ${
            agregado
              ? 'bg-verde-claro text-crema'
              : agotado
                ? 'border border-verde text-verde hover:bg-verde hover:text-crema'
                : 'bg-verde text-crema hover:bg-verde-medio'
          }`}
        >
          {agregado ? (
            <>
              <IconoCheck width={16} height={16} /> Agregado
            </>
          ) : agotado ? (
            'Reservar próximo lote'
          ) : enCarrito(producto.id) ? (
            <>
              <IconoCheck width={16} height={16} /> En el carrito
            </>
          ) : (
            <>
              <IconoCarrito width={16} height={16} /> Agregar
            </>
          )}
        </button>
      </div>
    </article>
  )
}

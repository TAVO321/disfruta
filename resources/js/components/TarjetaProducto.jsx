import { memo, useEffect, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import { IconoCarrito, IconoCheck } from '@/components/Iconos'
import { EtiquetaStock, ImagenProducto, NivelPicanteBar, PrecioProducto } from '@/components/ProductoUI'
import { useCarritoAcciones, useCarritoIds } from '@/context/Carrito'

/**
 * Recibe `enCarrito` como prop en vez de leerlo del carrito: asi la tarjeta
 * queda memoizada y al agregar un producto solo se repinta esa tarjeta, no las
 * doce de la grilla.
 */
const TarjetaProducto = memo(function TarjetaProducto({ producto, indice, enCarrito }) {
  const { agregar } = useCarritoAcciones()
  const [agregado, setAgregado] = useState(false)
  const temporizador = useRef(null)
  const agotado = producto.stock === 0

  const ver = () => router.visit(`/catalogo/${producto.slug}`)

  const sumar = () => {
    agregar(producto, 1)
    setAgregado(true)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setAgregado(false), 1600)
  }

  useEffect(() => () => clearTimeout(temporizador.current), [])

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
          onClick={ver}
          className="absolute inset-0 cursor-pointer"
          aria-label={`Ver ${producto.nombre}`}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <NivelPicanteBar nivel={producto.nivelPicante} />
          <EtiquetaStock producto={producto} />
        </div>

        <h3 className="font-serif text-lg leading-snug font-semibold text-verde">
          <button type="button" onClick={ver} className="text-left hover:text-rojo">
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
          onClick={agotado ? ver : sumar}
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
          ) : enCarrito ? (
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
})

/**
 * La grilla es la unica que se suscribe al carrito, de modo que agregar un
 * producto re-renderiza esta lista y las tarjetas memoizadas omiten el resto.
 */
export const GrillaProductos = memo(function GrillaProductos({
  items,
  columnas = 'sm:grid-cols-2 lg:grid-cols-3',
  className = '',
}) {
  const ids = useCarritoIds()

  return (
    <div className={`grid gap-5 ${columnas} ${className}`}>
      {items.map((p, i) => (
        <TarjetaProducto key={p.id} producto={p} indice={i} enCarrito={ids.has(p.id)} />
      ))}
    </div>
  )
})

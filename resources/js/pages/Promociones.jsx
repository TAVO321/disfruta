import { useMemo } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { IconoFlecha, IconoWhatsapp } from '@/components/Iconos'
import { ImagenProducto, NivelPicanteBar, PrecioProducto } from '@/components/ProductoUI'
import { fecha, precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

const TIPOS = {
  oferta: { nombre: 'Ofertas', desc: 'Descuentos directos por tiempo limitado.', color: 'bg-rojo text-crema' },
  combo: { nombre: 'Combos', desc: 'Selecciones que comparten un precio especial.', color: 'bg-verde text-crema' },
  temporada: { nombre: 'Temporada', desc: 'Lo que está en su mejor momento ahora.', color: 'bg-dorado text-verde' },
  limitado: { nombre: 'Edición limitada', desc: 'Lotes chicos que no se repiten.', color: 'bg-rojo text-crema' },
}

export default function Promociones({ promociones, productos }) {
  const { ajustes, platos } = usePage().props

  return (
    <>
      <Head title="Promociones" />

      <div className="container-disfruta py-12">
        <header className="max-w-3xl">
          <p className="eyebrow text-dorado">Ofertas, combos y ediciones</p>
          <h1 className="mt-2.5 font-serif text-4xl leading-tight font-bold text-balance text-verde sm:text-5xl">
            Promociones DISFRUTA
          </h1>
          <p className="mt-4 leading-relaxed text-tinta-suave">
            Promociones por tiempo limitado, combos pensados para compartir y ediciones limitadas
            que elaboramos por pequeñas cantidades. Los precios ya están descontados en el
            catálogo.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(TIPOS).map(([id, t]) => {
            const n = promociones.filter((p) => p.tipo === id).length
            return (
              <div key={id} className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave">
                <span className={`eyebrow inline-block rounded-full px-2.5 py-1 ${t.color}`}>{t.nombre}</span>
                <p className="mt-3 font-serif text-3xl font-bold text-verde">{n}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-tinta-suave">{t.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 space-y-6">
          {promociones.map((promo) => {
            const prod = promo.productos[0]
            const tipo = TIPOS[promo.tipo] ?? TIPOS.oferta
            return (
              <article
                key={promo.id}
                className="grid overflow-hidden rounded-2xl border border-crema-profundo bg-white shadow-suave md:grid-cols-[18rem_1fr]"
              >
                <div className="relative aspect-4/3 bg-crema-oscuro md:aspect-auto">
                  {prod && <ImagenProducto producto={prod} />}
                  {promo.descuento > 0 && (
                    <span className="absolute top-3 left-3 rounded-full bg-rojo px-3 py-1.5 text-xs font-bold text-crema">
                      -{promo.descuento}%
                    </span>
                  )}
                </div>

                <div className="flex flex-col p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`eyebrow rounded-full px-2.5 py-1 ${tipo.color}`}>{tipo.nombre}</span>
                    {prod?.stock === 0 && (
                      <span className="eyebrow rounded-full bg-crema-profundo px-2.5 py-1 text-tinta-suave">
                        Reserva próximo lote
                      </span>
                    )}
                    {promo.vigenteHasta && (
                      <span className="text-xs text-tinta-suave">
                        Vigente hasta {fecha(promo.vigenteHasta)}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 font-serif text-2xl leading-snug font-bold text-verde">{promo.titulo}</h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-tinta-suave">{promo.descripcion}</p>

                  {prod && (
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <PrecioProducto producto={prod} className="text-xl" />
                      {prod.precioAntes && promo.descuento > 0 && (
                        <span className="text-xs text-tinta-suave">
                          Precio lista: {precio(prod.precioAntes)} ·{' '}
                          {precio(Math.round((prod.precioAntes * (100 - promo.descuento)) / 100))}
                        </span>
                      )}
                      <NivelPicanteBar nivel={prod.nivelPicante} className="ml-auto" />
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {prod && (
                      <>
                        <Link
                          href={`/catalogo/${prod.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
                        >
                          Ver el producto
                          <IconoFlecha width={15} height={15} />
                        </Link>
                        {prod.stock > 0 && (
                          <Link
                            href="/catalogo"
                            className="inline-flex items-center gap-2 rounded-full border border-crema-profundo px-5 py-2.5 text-sm font-semibold text-verde transition-colors hover:border-verde hover:bg-verde hover:text-crema"
                          >
                            Armar mi pedido
                          </Link>
                        )}
                      </>
                    )}
                    <a
                      href={linkWhatsApp(
                        mensajeConsultaSimple(`la promoción "${promo.titulo}"`),
                        ajustes?.whatsapp,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-dorado bg-dorado-suave px-5 py-2.5 text-sm font-semibold text-verde transition-colors hover:bg-dorado"
                    >
                      <IconoWhatsapp width={15} height={15} />
                      Consultar
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {promociones.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-crema-profundo bg-white px-8 py-16 text-center">
            <p className="font-serif text-xl text-verde">No hay promociones activas</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Mirá el catálogo completo: todos los productos están a la venta.
            </p>
            <Link
              href="/catalogo"
              className="mt-6 inline-block rounded-full bg-verde px-6 py-3 text-sm font-semibold text-crema"
            >
              Ir al catálogo
            </Link>
          </div>
        )}

        <CombinaTuComida productos={productos} platos={platos} />
      </div>
    </>
  )
}

function CombinaTuComida({ productos, platos }) {
  const grupos = useMemo(
    () =>
      (platos ?? [])
        .map((plato) => ({
          plato,
          items: productos.filter((p) => p.platosRecomendados.includes(plato.id)),
        }))
        .filter((x) => x.items.length > 0),
    [productos, platos],
  )

  if (grupos.length === 0) return null

  return (
    <section className="mt-20">
      <div className="max-w-2xl">
        <p className="eyebrow text-dorado">Guía de combinaciones</p>
        <h2 className="mt-2.5 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
          Combina tu comida
        </h2>
        <p className="mt-3.5 leading-relaxed text-tinta-suave">
          Elegí el plato que tenés en la mesa y te decimos con qué acompañarlo. Cada frasco tiene
          un plato donde rinde de verdad.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {grupos.map(({ plato, items }) => (
          <div
            key={plato.id}
            className="grid gap-4 rounded-2xl border border-crema-profundo bg-white p-5 sm:grid-cols-[13rem_1fr] sm:p-6"
          >
            <div className="flex min-w-0 items-center gap-3 sm:block">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-verde-suave text-3xl sm:mx-auto sm:h-16 sm:w-16">
                {plato.emoji}
              </span>
              <h3 className="min-w-0 font-serif text-xl font-semibold text-verde sm:mt-3 sm:text-center">
                {plato.nombre}
              </h3>
            </div>

            <ul className="grid min-w-0 gap-2.5 sm:grid-cols-2">
              {items.map((p) => (
                <li key={p.id} className="min-w-0">
                  <Link
                    href={`/catalogo/${p.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-crema-oscuro px-3.5 py-2.5 transition-colors hover:border-verde"
                  >
                    <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
                      <ImagenProducto producto={p} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-verde">{p.nombre}</span>
                      <span className="text-xs text-tinta-suave">
                        {p.stock > 0 ? `${p.stock} disponibles` : 'Próximo lote'}
                      </span>
                    </span>
                    <span className="shrink-0 font-serif text-sm font-semibold text-verde">
                      {precio(p.precio)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

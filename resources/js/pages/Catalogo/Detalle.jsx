import { useEffect, useMemo, useState } from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import {
  IconoCalendario,
  IconoCarrito,
  IconoCheck,
  IconoEtiqueta,
  IconoEstrella,
  IconoLote,
} from '@/components/Iconos'
import { useCarrito } from '@/context/Carrito'
import { EtiquetaStock, ImagenProducto, NivelPicanteBar, PrecioProducto } from '@/components/ProductoUI'
import { fecha, precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

export default function Detalle({ producto, relacionados }) {
  const { ajustes, platos } = usePage().props
  const { agregar } = useCarrito()
  const [foto, setFoto] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const [pestana, setPestana] = useState('detalle')

  const resenas = useMemo(() => producto.resenas ?? [], [producto.resenas])
  const promedio = useMemo(
    () => (resenas.length ? resenas.reduce((s, r) => s + r.estrellas, 0) / resenas.length : 0),
    [resenas],
  )

  const lote = producto.lotes?.[0]
  const agotado = producto.stock === 0
  const tope = agotado ? 1 : producto.stock

  useEffect(() => {
    setCantidad((c) => Math.min(Math.max(1, c), Math.max(1, tope)))
  }, [tope])

  const sumar = () => {
    agregar(producto, cantidad, agotado)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1800)
  }

  return (
    <>
      <Head title={producto.nombre} />

      <div className="container-disfruta py-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-tinta-suave">
          <Link href="/" className="hover:text-verde">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-verde">
            Catálogo
          </Link>
          <span>/</span>
          {producto.categoria && (
            <>
              <Link href={`/catalogo?categoria=${producto.categoria.slug}`} className="hover:text-verde">
                {producto.categoria.nombre}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-verde">{producto.nombre}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-crema-oscuro p-5 sm:p-7">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-suave">
              <ImagenProducto producto={producto} indice={foto} />
              {agotado && (
                <span className="eyebrow absolute top-3 left-3 rounded-full bg-rojo px-3 py-1.5 text-crema">
                  Sin stock · próximo lote
                </span>
              )}
            </div>

            {(producto.gallery ?? []).length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {producto.gallery.map((f, i) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFoto(i)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      i === foto ? 'border-verde' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`Ver foto ${i + 1}`}
                  >
                    <img src={f} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {(producto.gallery ?? []).length === 0 && (
              <p className="mt-3 text-center text-xs text-tinta-suave">
                Ilustración de referencia. Desde el panel admin podés cargar las fotos reales del
                producto.
              </p>
            )}

            <div className="mt-5 rounded-2xl border border-crema-profundo bg-white p-4">
              <p className="eyebrow mb-2.5 flex items-center gap-2 text-tinta-suave">
                <IconoEtiqueta width={14} height={14} /> Presentación
              </p>
              <p className="font-serif text-lg font-semibold text-verde">{producto.presentacion}</p>
              <div className="mt-3 space-y-2.5 border-t border-crema-oscuro pt-3 text-sm">
                <Fila
                  etiqueta="Categoría"
                  valor={producto.categoria?.nombre ?? '—'}
                />
                <Fila etiqueta="Nivel de picante" valor={<NivelPicanteBar nivel={producto.nivelPicante} />} />
                {producto.peso > 0 && <Fila etiqueta="Peso neto" valor={`${producto.peso} g`} />}
                <Fila
                  etiqueta="Disponibilidad"
                  valor={agotado ? 'Sin stock' : `${producto.stock} frascos`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col p-1 sm:p-3">
            <div className="flex flex-wrap items-center gap-2">
              <EtiquetaStock producto={producto} />
              {producto.limitado && (
                <span className="eyebrow rounded-full bg-rojo px-2.5 py-1 text-crema">
                  Edición limitada
                </span>
              )}
              {producto.temporada && (
                <span className="eyebrow rounded-full bg-dorado px-2.5 py-1 text-verde">
                  Temporada
                </span>
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
              {producto.nombre}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {resenas.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPestana('resenas')}
                  className="inline-flex items-center gap-1.5 text-xs text-tinta-suave hover:text-verde"
                >
                  <span className="flex gap-0.5" aria-hidden>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <IconoEstrella
                        key={i}
                        llena={i <= Math.round(promedio)}
                        width={13}
                        height={13}
                        className="text-dorado"
                      />
                    ))}
                  </span>
                  {promedio.toFixed(1)} ({resenas.length})
                </button>
              )}
              <NivelPicanteBar nivel={producto.nivelPicante} />
            </div>

            <div className="mt-4">
              <PrecioProducto producto={producto} className="text-3xl" />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-tinta-suave">{producto.descripcion}</p>

            {producto.recomendacionConsumo && (
              <div className="mt-5 rounded-2xl border border-dorado/25 bg-dorado-suave/50 p-4">
                <p className="eyebrow mb-1.5 text-dorado">Cómo lo consumimos</p>
                <p className="text-sm leading-relaxed text-tinta">{producto.recomendacionConsumo}</p>
                {producto.platosRecomendados.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {producto.platosRecomendados.map((id) => {
                      const plato = (platos ?? []).find((x) => x.id === id)
                      if (!plato) return null
                      return (
                        <Link
                          key={id}
                          href={`/catalogo?plato[]=${plato.id}`}
                          className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-verde transition-colors hover:bg-verde hover:text-crema"
                        >
                          {plato.emoji} {plato.nombre}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {pestana === 'detalle' ? (
              <div className="mt-5 space-y-5">
                {producto.ingredientes.length > 0 && (
                  <div>
                    <p className="eyebrow mb-2 text-tinta-suave">Ingredientes</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {producto.ingredientes.map((i) => (
                        <li
                          key={i}
                          className="rounded-full border border-crema-profundo bg-white px-2.5 py-1 text-xs text-tinta"
                        >
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lote && (
                  <div>
                    <p className="eyebrow mb-2 flex items-center gap-2 text-tinta-suave">
                      <IconoLote width={14} height={14} /> Lote vigente
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Dato
                        icono={<IconoEtiqueta width={15} height={15} />}
                        etiqueta="Número de lote"
                        valor={lote.codigo}
                      />
                      <Dato
                        icono={<IconoCalendario width={15} height={15} />}
                        etiqueta="Fecha de elaboración"
                        valor={fecha(lote.fechaElaboracion)}
                      />
                      <Dato
                        icono={<IconoCalendario width={15} height={15} />}
                        etiqueta="Consumo recomendado"
                        valor={fecha(lote.fechaConsumoRecomendado)}
                      />
                      <Dato
                        etiqueta="Unidades del lote"
                        valor={`${lote.restante} de ${lote.cantidad} disponibles`}
                      />
                    </div>
                  </div>
                )}

                {(producto.lotes ?? []).length > 1 && (
                  <details className="rounded-xl border border-crema-profundo bg-white px-4 py-3">
                    <summary className="cursor-pointer text-sm font-semibold text-verde">
                      Ver los {producto.lotes.length} lotes disponibles
                    </summary>
                    <ul className="mt-3 space-y-2">
                      {producto.lotes.map((l) => (
                        <li
                          key={l.id}
                          className="flex flex-wrap items-center justify-between gap-3 text-xs text-tinta-suave"
                        >
                          <span className="font-semibold text-verde">{l.codigo}</span>
                          <span>Elaborado {fecha(l.fechaElaboracion)}</span>
                          <span>Vence {fecha(l.fechaConsumoRecomendado)}</span>
                          <span className={l.restante === 0 ? 'text-rojo' : ''}>
                            {l.restante === 0 ? 'Agotado' : `${l.restante} u.`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                {producto.conservacion && (
                  <p className="text-xs leading-relaxed text-tinta-suave">
                    <strong className="font-semibold text-verde">Conservación:</strong>{' '}
                    {producto.conservacion}
                  </p>
                )}
              </div>
            ) : (
              <Resenas producto={producto} resenas={resenas} promedio={promedio} />
            )}

            <div className="mt-auto pt-6">
              <div className="flex flex-wrap items-center gap-3">
                {!agotado && (
                  <div className="flex items-center rounded-full border border-crema-profundo bg-white">
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      className="px-4 py-3 text-verde"
                      aria-label="Restar"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center font-semibold text-verde">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.min(tope, c + 1))}
                      className="px-4 py-3 text-verde disabled:opacity-30"
                      aria-label="Sumar"
                      disabled={cantidad >= tope}
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={sumar}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide uppercase transition-colors ${
                    agregado
                      ? 'bg-verde-claro text-crema'
                      : agotado
                        ? 'border-2 border-verde text-verde hover:bg-verde hover:text-crema'
                        : 'bg-verde text-crema hover:bg-verde-medio'
                  }`}
                >
                  {agregado ? (
                    <>
                      <IconoCheck width={16} height={16} /> Agregado al carrito
                    </>
                  ) : agotado ? (
                    'Reservar próximo lote'
                  ) : (
                    <>
                      <IconoCarrito width={16} height={16} /> Agregar al carrito
                    </>
                  )}
                </button>
              </div>

              {agotado && (
                <p className="mt-2.5 text-xs text-tinta-suave">
                  Te avisamos por WhatsApp apenas salga el próximo lote
                  {lote ? ` (${fecha(lote.fechaConsumoRecomendado)})` : ''}.
                </p>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPestana(pestana === 'detalle' ? 'resenas' : 'detalle')}
                  className="text-xs text-tinta-suave underline-offset-4 hover:underline"
                >
                  {pestana === 'detalle' ? `Ver reseñas (${resenas.length})` : 'Ver ficha completa'}
                </button>
                <a
                  href={linkWhatsApp(
                    mensajeConsultaSimple(`"${producto.nombre}" (${producto.presentacion})`),
                    ajustes?.whatsapp,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-verde hover:text-rojo"
                >
                  Consultar por este producto
                </a>
              </div>

              <p className="mt-3 text-[0.7rem] text-tinta-suave">
                Precio de referencia: {precio(producto.precio)} por {producto.presentacion.toLowerCase()}.
                No trabajamos con pasarela de pagos: confirmamos todo por WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-16 border-t border-crema-profundo pt-12">
            <h2 className="font-serif text-2xl font-bold text-verde">También te puede gustar</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relacionados.map((p, i) => (
                <TarjetaMini key={p.id} producto={p} indice={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function TarjetaMini({ producto, indice }) {
  return (
    <Link
      href={`/catalogo/${producto.slug}`}
      className="group block overflow-hidden rounded-2xl border border-crema-profundo bg-white transition-shadow hover:shadow-media"
    >
      <div className="aspect-square overflow-hidden bg-crema-oscuro">
        <ImagenProducto producto={producto} indice={indice} />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base leading-snug font-semibold text-verde group-hover:text-verde-medio">
          {producto.nombre}
        </h3>
        <p className="mt-1.5 text-sm font-semibold text-verde">{precio(producto.precio)}</p>
        {producto.stock === 0 && (
          <span className="mt-1 block text-xs text-rojo">Sin stock · próximo lote</span>
        )}
      </div>
    </Link>
  )
}

function Resenas({ producto, resenas, promedio }) {
  const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    autor: '',
    estrellas: 5,
    texto: '',
    sitio_web: '',
  })

  useEffect(() => {
    if (wasSuccessful) {
      const t = setTimeout(reset, 4000)
      return () => clearTimeout(t)
    }
  }, [wasSuccessful, reset])

  return (
    <div className="mt-5 space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          post(`/catalogo/${producto.slug}/resenas`)
        }}
        className="rounded-2xl border border-crema-profundo bg-white p-4"
      >
        <p className="eyebrow mb-2 text-tinta-suave">Dejá tu reseña</p>

        <div className="mb-2.5 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setData('estrellas', i)}
              aria-label={`${i} estrellas`}
            >
              <IconoEstrella
                llena={i <= data.estrellas}
                width={20}
                height={20}
                className={i <= data.estrellas ? 'text-dorado' : 'text-crema-profundo'}
              />
            </button>
          ))}
        </div>

        <input
          type="text"
          value={data.autor}
          onChange={(e) => setData('autor', e.target.value)}
          placeholder="Tu nombre"
          className="mb-2 w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2 text-sm"
        />
        <textarea
          value={data.texto}
          onChange={(e) => setData('texto', e.target.value)}
          rows={3}
          placeholder="¿Cómo te fue con este acompañamiento?"
          className="w-full resize-none rounded-lg border border-crema-profundo bg-crema px-3 py-2 text-sm"
        />

        <input
          type="text"
          name="sitio_web"
          value={data.sitio_web}
          onChange={(e) => setData('sitio_web', e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {errors.texto && <p className="mt-2 text-xs text-rojo">{errors.texto}</p>}
        {errors.autor && <p className="mt-2 text-xs text-rojo">{errors.autor}</p>}

        <button
          type="submit"
          disabled={processing}
          className="mt-2.5 w-full rounded-full bg-verde py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-40"
        >
          {processing ? 'Enviando...' : 'Enviar reseña'}
        </button>
        <p className="mt-2 text-center text-[0.7rem] text-tinta-suave">
          Las reseñas se aprueban antes de publicarse.
        </p>
      </form>

      {resenas.length === 0 ? (
        <p className="text-sm text-tinta-suave">Todavía no hay reseñas de este producto.</p>
      ) : (
        <ul className="space-y-3">
          {resenas.map((r) => (
            <li key={r.id} className="rounded-2xl border border-crema-profundo bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="flex gap-0.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconoEstrella
                      key={i}
                      llena={i <= r.estrellas}
                      width={12}
                      height={12}
                      className="text-dorado"
                    />
                  ))}
                </span>
                <span className="text-[0.7rem] text-tinta-suave">{fecha(r.fecha)}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-tinta">{r.texto}</p>
              <p className="mt-1.5 text-xs font-semibold text-verde">{r.autor}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Fila({ etiqueta, valor }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-tinta-suave">{etiqueta}</span>
      <span className="text-right font-medium text-verde">{valor}</span>
    </div>
  )
}

function Dato({ icono, etiqueta, valor }) {
  return (
    <div className="rounded-xl border border-crema-profundo bg-crema px-3.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[0.65rem] tracking-wide text-tinta-suave uppercase">
        {icono}
        {etiqueta}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-verde">{valor}</p>
    </div>
  )
}

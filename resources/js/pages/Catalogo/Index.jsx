import { useEffect, useMemo, useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { IconoBuscar, IconoCerrar, IconoChili, IconoFiltro } from '@/components/Iconos'
import { GrillaProductos } from '@/components/TarjetaProducto'
import { useEsDesktop } from '@/lib/useEsDesktop'
import { precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

const ORDENES = [
  { id: 'destacados', nombre: 'Destacados primero' },
  { id: 'precio-asc', nombre: 'Precio: menor a mayor' },
  { id: 'precio-desc', nombre: 'Precio: mayor a menor' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
  { id: 'picante', nombre: 'Nivel de picante' },
]

const DISPONIBILIDADES = [
  { id: 'todas', t: 'Todas' },
  { id: 'disponibles', t: 'Con stock' },
  { id: 'ultimos', t: 'Últimos' },
  { id: 'agotados', t: 'Sin stock' },
]

const VACIO = { q: '', categoria: null, picante: [], plato: [], disponibilidad: 'todas', precio_max: null, orden: 'destacados' }

export default function Catalogo({ productos, filtros, precios, conteos, platos, niveles }) {
  const { ajustes } = usePage().props
  const esDesktop = useEsDesktop()
  const paginador = productos.meta ?? {}
  const [busqueda, setBusqueda] = useState(filtros.q)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [precioLocal, setPrecioLocal] = useState(filtros.precio_max ?? null)

  // Sincroniza el input con el valor que viene del servidor (Link con query,后退, etc).
  useEffect(() => setBusqueda(filtros.q), [filtros.q])
  useEffect(() => setPrecioLocal(filtros.precio_max ?? null), [filtros.precio_max])

  const actualizar = (cambios) => {
    const siguiente = { ...filtros, ...cambios }

    router.get(
      '/catalogo',
      {
        q: siguiente.q || undefined,
        categoria: siguiente.categoria || undefined,
        picante: siguiente.picante.length ? siguiente.picante : undefined,
        plato: siguiente.plato.length ? siguiente.plato : undefined,
        disponibilidad: siguiente.disponibilidad === 'todas' ? undefined : siguiente.disponibilidad,
        precio_max: siguiente.precio_max || undefined,
        orden: siguiente.orden === 'destacados' ? undefined : siguiente.orden,
      },
      { preserveScroll: true, preserveState: true, replace: true, only: ['productos', 'filtros'] },
    )
  }

  // Búsqueda con debounce para no pegarle a la base en cada tecla.
  useEffect(() => {
    if (busqueda === filtros.q) return
    const t = setTimeout(() => actualizar({ q: busqueda }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda])

  const alternar = (lista, valor) =>
    lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor]

  // El slider dispara un onChange por cada valor mientras se arrastra. Sin
  // debounce, recorrerlo entero mandaba ~100 pedidos al servidor y cada
  // respuesta repintaba la grilla completa. El precio se muestra al instante
  // desde el estado local y solo se commits al soltar.
  useEffect(() => {
    if (precioLocal === (filtros.precio_max ?? null)) return
    const t = setTimeout(() => actualizar({ precio_max: precioLocal }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precioLocal])

  const activos =
    (filtros.categoria ? 1 : 0) +
    filtros.picante.length +
    filtros.plato.length +
    (filtros.disponibilidad !== 'todas' ? 1 : 0) +
    (precioLocal ? 1 : 0)

  const precioTecho = Math.max(precios.max, 1)
  const topeEfectivo = precioLocal ?? precioTecho

  const panelFiltros = (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Categoría</p>
        <div className="flex flex-wrap gap-1.5">
          {conteos.categorias.map((c) => {
            const activo = filtros.categoria === c.slug
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => actualizar({ categoria: activo ? null : c.slug })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activo
                    ? 'border-verde bg-verde text-crema'
                    : 'border-crema-profundo bg-white text-tinta hover:border-verde'
                }`}
              >
                {c.nombre} <span className="opacity-60">({c.total})</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Nivel de picante</p>
        <div className="space-y-1">
          {niveles.map((n) => {
            const total = conteos.picantes[n.id] ?? 0
            if (!total) return null
            const activo = filtros.picante.includes(n.id)
            return (
              <label
                key={n.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-white"
              >
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={() => actualizar({ picante: alternar(filtros.picante, n.id) })}
                  className="h-4 w-4 accent-verde"
                />
                <span className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: n.chilis }, (_, i) => (
                    <IconoChili key={i} lleno width={10} height={10} />
                  ))}
                </span>
                <span className="text-sm text-tinta">{n.nombre}</span>
                <span className="ml-auto text-xs text-tinta-suave">({total})</span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Combina con tu plato</p>
        <div className="flex flex-wrap gap-1.5">
          {platos.map((pl) => {
            const total = conteos.platos[pl.id] ?? 0
            if (!total) return null
            const activo = filtros.plato.includes(pl.id)
            return (
              <button
                key={pl.id}
                type="button"
                onClick={() => actualizar({ plato: alternar(filtros.plato, pl.id) })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activo
                    ? 'border-rojo bg-rojo text-crema'
                    : 'border-crema-profundo bg-white text-tinta hover:border-rojo'
                }`}
              >
                {pl.emoji} {pl.nombre} <span className="opacity-60">({total})</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Disponibilidad</p>
        <div className="grid grid-cols-2 gap-1.5">
          {DISPONIBILIDADES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => actualizar({ disponibilidad: d.id })}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                filtros.disponibilidad === d.id
                  ? 'border-verde bg-verde text-crema'
                  : 'border-crema-profundo bg-white text-tinta hover:border-verde'
              }`}
            >
              {d.t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="eyebrow text-tinta-suave">Precio máximo</p>
          <span className="text-xs font-semibold text-verde">{precio(topeEfectivo)}</span>
        </div>
        <input
          type="range"
          min={Math.max(1, Math.round(precioTecho * 0.2))}
          max={precioTecho}
          step={1}
          value={topeEfectivo}
          onChange={(e) => setPrecioLocal(Number(e.target.value))}
          className="w-full accent-verde"
          aria-label="Precio máximo"
        />
        {precioLocal && (
          <button
            type="button"
            onClick={() => setPrecioLocal(null)}
            className="mt-1.5 text-xs text-tinta-suave underline-offset-4 hover:underline"
          >
            Quitar el límite de precio
          </button>
        )}
      </div>

      {activos > 0 && (
        <button
          type="button"
          onClick={() => {
            setBusqueda('')
            setPrecioLocal(null)
            router.get('/catalogo', {}, { preserveScroll: true, replace: true })
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-crema-profundo py-2.5 text-xs font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
        >
          <IconoCerrar width={13} height={13} /> Limpiar filtros ({activos})
        </button>
      )}
    </div>
  )

  const items = productos.data ?? []

  return (
    <>
      <Head title="Catálogo" />

      <div className="container-disfruta py-12">
        <header className="max-w-3xl">
          <p className="eyebrow text-dorado">Catálogo completo</p>
          <h1 className="mt-2.5 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl lg:text-5xl">
            Todos nuestros acompañamientos
          </h1>
          <p className="mt-4 leading-relaxed text-tinta-suave">
            Acá está todo lo que elaboramos,{' '}
            <strong className="font-semibold text-verde">incluyendo lo que está agotado</strong>:
            si ves un producto sin stock podés reservar el próximo lote y te avisamos por WhatsApp
            apenas esté listo.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <IconoBuscar className="absolute top-1/2 left-4 -translate-y-1/2 text-tinta-suave" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, ingrediente o plato..."
              className="w-full rounded-full border border-crema-profundo bg-white py-3.5 pr-4 pl-11 text-sm text-tinta placeholder:text-tinta-suave/60 focus:border-verde-claro"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-tinta-suave hover:text-rojo"
                aria-label="Limpiar búsqueda"
              >
                <IconoCerrar width={16} height={16} />
              </button>
            )}
          </div>

          <select
            value={filtros.orden}
            onChange={(e) => actualizar({ orden: e.target.value })}
            className="rounded-full border border-crema-profundo bg-white px-4 py-3.5 text-sm text-tinta focus:border-verde-claro"
            aria-label="Ordenar por"
          >
            {ORDENES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="flex items-center gap-2 rounded-full border border-crema-profundo bg-white px-5 py-3.5 text-sm font-semibold text-verde lg:hidden"
          >
            <IconoFiltro width={16} height={16} />
            Filtros
            {activos > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-verde text-[0.65rem] text-crema">
                {activos}
              </span>
            )}
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
          {esDesktop && (
            <aside>
              <div className="sticky top-24 rounded-2xl border border-crema-profundo bg-crema-oscuro/40 p-5">
                <p className="eyebrow mb-5 flex items-center gap-2 text-verde">
                  <IconoFiltro width={14} height={14} /> Filtros
                </p>
                {panelFiltros}
              </div>
            </aside>
          )}

          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <p className="text-sm text-tinta-suave">
                <strong className="font-semibold text-verde">{paginador.total ?? items.length}</strong>{' '}
                {(paginador.total ?? items.length) === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-crema-profundo bg-white px-8 py-16 text-center">
                <p className="font-serif text-xl text-verde">No encontramos productos</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-tinta-suave">
                  Probá cambiando algún filtro o escribinos por WhatsApp: es posible que tengamos
                  un lote próximo en producción.
                </p>
                <a
                  href={linkWhatsApp(mensajeConsultaSimple('no encuentro el producto que busco'), ajustes?.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block rounded-full bg-verde px-6 py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            ) : (
              <>
                <GrillaProductos items={items} columnas="sm:grid-cols-2 xl:grid-cols-3" />

                {(paginador.last_page ?? 1) > 1 && (
                  <Paginacion
                    meta={paginador}
                    params={{ ...filtros }}
                    etiqueta={`Ver ${items.length} productos`}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {menuAbierto && (
          <div className="fixed inset-0 z-60 lg:hidden">
            <button
              type="button"
              aria-label="Cerrar filtros"
              onClick={() => setMenuAbierto(false)}
              className="animar-aparece absolute inset-0 bg-tinta/45"
            />
            <div className="animar-sube-panel absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-crema p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-verde">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setMenuAbierto(false)}
                  className="rounded-full p-2 text-tinta-suave hover:bg-verde-suave hover:text-verde"
                  aria-label="Cerrar"
                >
                  <IconoCerrar />
                </button>
              </div>
              {panelFiltros}
              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                className="mt-6 w-full rounded-full bg-verde py-3.5 text-sm font-semibold tracking-wide text-crema uppercase"
              >
                Ver {paginador.total ?? items.length} productos
              </button>
            </div>
          </div>
        )}

        <SugerenciasPlato platos={platos} />
      </div>
    </>
  )
}

function Paginacion({ meta, params, etiqueta }) {
  const links = meta.links?.filter((l) => l.url) ?? []
  if (links.length <= 1) return null

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {links.map((l) => (
        <button
          key={l.url}
          type="button"
          disabled={!l.active && l.url === null}
          onClick={() => router.get(l.url, {}, { preserveScroll: true, replace: true })}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            l.active
              ? 'border-verde bg-verde text-crema'
              : l.url
                ? 'border-crema-profundo bg-white text-tinta hover:border-verde'
                : 'border-crema-profundo bg-white text-tinta-suave/40'
          }`}
          dangerouslySetInnerHTML={{ __html: l.label }}
        />
      ))}
    </nav>
  )
}

function SugerenciasPlato({ platos }) {
  return (
    <div className="mt-16 rounded-2xl border border-crema-profundo bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-verde">¿Buscabas por un plato?</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Entrá directo a los acompañamientos que mejor van con cada uno.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {platos.map((p) => (
          <Link
            key={p.id}
            href={`/catalogo?plato[]=${p.id}`}
            className="rounded-full border border-crema-profundo px-4 py-2 text-sm text-tinta transition-colors hover:border-verde hover:bg-verde hover:text-crema"
          >
            {p.emoji} {p.nombre}
          </Link>
        ))}
      </div>
    </div>
  )
}

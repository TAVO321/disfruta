import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { IconoBuscar, IconoCerrar, IconoFiltro } from '@/components/Iconos'
import { TarjetaProducto } from '@/components/TarjetaProducto'
import { CATEGORIAS, NIVELES_PICANTE, PLATOS, precio } from '@/lib/config'
import type { CategoriaId, NivelPicante, Producto } from '@/types'
import { useTienda } from '@/store/tienda'

type Disponibilidad = 'todas' | 'disponibles' | 'agotados' | 'ultimos'

const ORDEN_PRECIOS: { id: string; nombre: string }[] = [
  { id: 'destacados', nombre: 'Destacados primero' },
  { id: 'precio-asc', nombre: 'Precio: menor a mayor' },
  { id: 'precio-desc', nombre: 'Precio: mayor a menor' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
  { id: 'picante', nombre: 'Nivel de picante' },
]

export function Catalogo({ onVer }: { onVer: (p: Producto) => void }) {
  const { productos } = useTienda()
  const [params, setParams] = useSearchParams()

  const [busqueda, setBusqueda] = useState('')
  const [categorias, setCategorias] = useState<CategoriaId[]>([])
  const [niveles, setNiveles] = useState<NivelPicante[]>([])
  const [platosSel, setPlatosSel] = useState<string[]>([])
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad>('todas')
  const [precioMax, setPrecioMax] = useState(0)
  const [orden, setOrden] = useState('destacados')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const precioTecho = useMemo(
    () => Math.max(...productos.map((p) => p.precio), 1),
    [productos],
  )
  // 0 = sin tope aplicado; se resuelve contra el precio más alto del catálogo.
  const topeEfectivo = precioMax === 0 ? precioTecho : precioMax

  // Sincroniza con los query params de la URL (links del hero y del footer)
  useEffect(() => {
    const cat = params.get('categoria') as CategoriaId | null
    const plato = params.get('plato')
    if (cat && CATEGORIAS.some((c) => c.id === cat)) setCategorias([cat])
    if (plato && PLATOS.some((p) => p.id === plato)) setPlatosSel([plato])
  }, [params])

  const resultados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    const lista = productos.filter((p) => {
      if (!p.activo) return false
      if (categorias.length && !categorias.includes(p.categoria)) return false
      if (niveles.length && !niveles.includes(p.nivelPicante)) return false
      if (platosSel.length && !p.recommendedPlatos.some((x) => platosSel.includes(x))) return false
      if (p.precio > topeEfectivo) return false

      if (disponibilidad === 'disponibles' && p.stock === 0) return false
      if (disponibilidad === 'agotados' && p.stock > 0) return false
      if (disponibilidad === 'ultimos' && (p.stock === 0 || p.stock > p.stockMinimo)) return false

      if (q) {
        const texto = [
          p.nombre,
          p.descripcion,
          p.descripcionCorta,
          p.categoria,
          ...p.ingredientes,
          ...p.recommendedPlatos,
        ]
          .join(' ')
          .toLowerCase()
        if (!texto.includes(q)) return false
      }
      return true
    })

    const nivelOrden: Record<NivelPicante, number> = {
      suave: 0,
      medio: 1,
      picante: 2,
      'muy-picante': 3,
      infierno: 4,
    }

    return [...lista].sort((a, b) => {
      switch (orden) {
        case 'precio-asc':
          return a.precio - b.precio
        case 'precio-desc':
          return b.precio - a.precio
        case 'nombre':
          return a.nombre.localeCompare(b.nombre, 'es')
        case 'picante':
          return nivelOrden[b.nivelPicante] - nivelOrden[a.nivelPicante]
        default:
          return Number(b.destacado) - Number(a.destacado) || b.creado.localeCompare(a.creado)
      }
    })
  }, [productos, busqueda, categorias, niveles, platosSel, disponibilidad, topeEfectivo, orden])

  const activos =
    categorias.length +
    niveles.length +
    platosSel.length +
    (disponibilidad !== 'todas' ? 1 : 0)

  const limpiar = () => {
    setBusqueda('')
    setCategorias([])
    setNiveles([])
    setPlatosSel([])
    setDisponibilidad('todas')
    setPrecioMax(0)
    setParams({})
  }

  const alternar = <T,>(lista: T[], valor: T, set: (v: T[]) => void) =>
    set(lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor])

  const filtros = (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Categoría</p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIAS.map((c) => {
            const activo = categorias.includes(c.id)
            const n = productos.filter((p) => p.activo && p.categoria === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => alternar(categorias, c.id, setCategorias)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activo
                    ? 'border-verde bg-verde text-crema'
                    : 'border-crema-profundo bg-white text-tinta hover:border-verde'
                }`}
              >
                {c.nombre} <span className="opacity-60">({n})</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Nivel de picante</p>
        <div className="space-y-1">
          {NIVELES_PICANTE.map((n) => {
            const activo = niveles.includes(n.id)
            const cantidad = productos.filter((p) => p.activo && p.nivelPicante === n.id).length
            return (
              <label
                key={n.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-white"
              >
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={() => alternar(niveles, n.id, setNiveles)}
                  className="h-4 w-4 accent-verde"
                />
                <span className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: n.chilis }, (_, i) => (
                    <svg
                      key={i}
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="#B23434"
                      aria-hidden
                    >
                      <path d="M12 22c3.9 0 6.5-2.4 6.5-6 0-4.4-4.3-6.2-4-11-2.3 1.2-3.2 3.4-3.2 5.4 0 1.2-1 1.8-1.7 1.1-.5-.5-.7-1.2-.6-2C7 11 5.5 13.2 5.5 16c0 3.6 2.6 6 6.5 6Z" />
                    </svg>
                  ))}
                </span>
                <span className="text-sm text-tinta">{n.nombre}</span>
                <span className="ml-auto text-xs text-tinta-suave">({cantidad})</span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Combina con tu plato</p>
        <div className="flex flex-wrap gap-1.5">
          {PLATOS.map((pl) => {
            const activo = platosSel.includes(pl.id)
            const n = productos.filter(
              (p) => p.activo && p.recommendedPlatos.includes(pl.id),
            ).length
            return (
              <button
                key={pl.id}
                type="button"
                onClick={() => alternar(platosSel, pl.id, setPlatosSel)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  activo
                    ? 'border-rojo bg-rojo text-crema'
                    : 'border-crema-profundo bg-white text-tinta hover:border-rojo'
                }`}
              >
                {pl.emoji} {pl.nombre} <span className="opacity-60">({n})</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2.5 text-tinta-suave">Disponibilidad</p>
        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              { id: 'todas', t: 'Todas' },
              { id: 'disponibles', t: 'Con stock' },
              { id: 'ultimos', t: 'Últimos' },
              { id: 'agotados', t: 'Sin stock' },
            ] as { id: Disponibilidad; t: string }[]
          ).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDisponibilidad(d.id)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                disponibilidad === d.id
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
          <span className="text-xs font-semibold text-verde">
            {precio(topeEfectivo)}
          </span>
        </div>
        <input
          type="range"
          min={Math.max(1, Math.round(precioTecho * 0.2))}
          max={precioTecho}
          step={1}
          value={topeEfectivo}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
          className="w-full accent-verde"
          aria-label="Precio máximo"
        />
        {topeEfectivo < precioTecho && (
          <button
            type="button"
            onClick={() => setPrecioMax(0)}
            className="mt-1.5 text-xs text-tinta-suave underline-offset-4 hover:underline"
          >
            Quitar el límite de precio
          </button>
        )}
      </div>

      {activos > 0 && (
        <button
          type="button"
          onClick={limpiar}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-crema-profundo py-2.5 text-xs font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
        >
          <IconoCerrar width={13} height={13} /> Limpiar filtros ({activos})
        </button>
      )}
    </div>
  )

  return (
    <div className="container-disfruta py-12">
      <header className="max-w-3xl">
        <p className="eyebrow text-dorado">Catálogo completo</p>
        <h1 className="mt-2.5 font-serif text-4xl leading-tight font-bold text-balance text-verde sm:text-5xl">
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
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="rounded-full border border-crema-profundo bg-white px-4 py-3.5 text-sm text-tinta focus:border-verde-claro"
          aria-label="Ordenar por"
        >
          {ORDEN_PRECIOS.map((o) => (
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
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-crema-profundo bg-crema-oscuro/40 p-5">
            <p className="eyebrow mb-5 flex items-center gap-2 text-verde">
              <IconoFiltro width={14} height={14} /> Filtros
            </p>
            {filtros}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="text-sm text-tinta-suave">
              <strong className="font-semibold text-verde">{resultados.length}</strong>{' '}
              {resultados.length === 1 ? 'producto' : 'productos'}
              {resultados.length !== productos.filter((p) => p.activo).length && ' de '}
              {resultados.length !== productos.filter((p) => p.activo).length &&
                productos.filter((p) => p.activo).length}
            </p>
            {(['limitado', 'temporada', 'combo'] as const).map((flag) => {
              const n = resultados.filter((p) => p[flag]).length
              if (!n) return null
              return (
                <span
                  key={flag}
                  className="rounded-full bg-verde-suave px-2.5 py-1 text-xs font-medium text-verde"
                >
                  {n} {flag === 'combo' ? 'combos' : flag + 's'}
                </span>
              )
            })}
          </div>

          {resultados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-crema-profundo bg-white px-8 py-16 text-center">
              <p className="font-serif text-xl text-verde">No encontramos productos</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-tinta-suave">
                Probá cambiando algún filtro o escribinos por WhatsApp: es posible que tengamos
                un lote próximo en producción.
              </p>
              <button
                type="button"
                onClick={limpiar}
                className="mt-6 rounded-full bg-verde px-6 py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {resultados.map((p, i) => (
                <TarjetaProducto key={p.id} producto={p} onVer={onVer} indice={i} />
              ))}
            </div>
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
            {filtros}
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              className="mt-6 w-full rounded-full bg-verde py-3.5 text-sm font-semibold tracking-wide text-crema uppercase"
            >
              Ver {resultados.length} productos
            </button>
          </div>
        </div>
      )}

      <SugerenciasPlato />
    </div>
  )
}

function SugerenciasPlato() {
  return (
    <div className="mt-16 rounded-2xl border border-crema-profundo bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-verde">¿Buscabas por un plato?</h2>
      <p className="mt-2 text-sm text-tinta-suave">
        Entrá directo a los acompañamientos que mejor van con cada uno.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {PLATOS.map((p) => (
          <a
            key={p.id}
            href={`/catalogo?plato=${p.id}`}
            className="rounded-full border border-crema-profundo px-4 py-2 text-sm text-tinta transition-colors hover:border-verde hover:bg-verde hover:text-crema"
          >
            {p.emoji} {p.nombre}
          </a>
        ))}
      </div>
    </div>
  )
}

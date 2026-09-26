import { useState } from 'react'
import { TarjetaAdmin } from '@/admin/AdminLayout'
import { FormularioProducto, productoVacio } from '@/admin/FormularioProducto'
import { IconoBuscar, IconoCerrar, IconoMas } from '@/components/Iconos'
import { ImagenProducto, NivelPicanteBar } from '@/components/ProductoUI'
import { CATEGORIAS, precio } from '@/lib/config'
import type { Producto } from '@/types'
import { useTienda } from '@/store/tienda'

export function AdminProductos() {
  const { productos, guardarProducto, eliminarProducto } = useTienda()
  const [editando, setEditando] = useState<Producto | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [confirmarBorrado, setConfirmarBorrado] = useState<string | null>(null)

  const lista = productos
    .filter((p) => (categoria === 'todas' ? true : p.categoria === categoria))
    .filter((p) => (busqueda ? p.nombre.toLowerCase().includes(busqueda.toLowerCase()) : true))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-verde">Productos</h1>
          <p className="mt-1.5 text-sm text-tinta-suave">
            {productos.length} productos · {productos.filter((p) => p.activo).length} activos
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditando(productoVacio())}
          className="inline-flex items-center gap-2 rounded-full bg-verde px-5 py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
        >
          <IconoMas width={16} height={16} />
          Agregar producto
        </button>
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1">
          <IconoBuscar className="absolute top-1/2 left-4 -translate-y-1/2 text-tinta-suave" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full rounded-full border border-crema-profundo bg-white py-3 pr-4 pl-11 text-sm focus:border-verde-claro"
          />
        </div>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-full border border-crema-profundo bg-white px-4 py-3 text-sm"
        >
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <TarjetaAdmin
        titulo="Listado"
        subtitulo={`${lista.length} producto${lista.length === 1 ? '' : 's'}`}
      >
        {lista.length === 0 ? (
          <p className="py-8 text-center text-sm text-tinta-suave">No hay productos con ese filtro.</p>
        ) : (
          <ul className="divide-y divide-crema-oscuro">
            {lista.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 py-3.5">
                <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-crema-oscuro">
                  <ImagenProducto producto={p} />
                </span>

                <div className="min-w-40 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-serif text-base font-semibold text-verde">{p.nombre}</p>
                    {!p.activo && (
                      <span className="eyebrow rounded-full bg-crema-profundo px-2 py-0.5 text-tinta-suave">
                        Inactivo
                      </span>
                    )}
                    {p.destacado && (
                      <span className="eyebrow rounded-full bg-dorado px-2 py-0.5 text-verde">
                        Destacado
                      </span>
                    )}
                    {p.limitado && (
                      <span className="eyebrow rounded-full bg-rojo px-2 py-0.5 text-crema">
                        Limitado
                      </span>
                    )}
                    {p.temporada && (
                      <span className="eyebrow rounded-full bg-verde px-2 py-0.5 text-crema">
                        Temporada
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-tinta-suave">
                    {CATEGORIAS.find((c) => c.id === p.categoria)?.nombre} · {p.presentacion}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <NivelPicanteBar nivel={p.nivelPicante} />
                    <span
                      className={`text-xs font-semibold ${
                        p.stock === 0
                          ? 'text-rojo'
                          : p.stock <= p.stockMinimo
                            ? 'text-dorado'
                            : 'text-verde-claro'
                      }`}
                    >
                      Stock: {p.stock}
                      {p.stock === 0 && ' · sin stock'}
                    </span>
                  </div>
                </div>

                <span className="shrink-0 font-serif text-base font-semibold text-verde">
                  {precio(p.precio)}
                </span>

                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => guardarProducto({ ...p, activo: !p.activo })}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      p.activo
                        ? 'border-crema-profundo text-tinta-suave hover:border-dorado hover:text-dorado'
                        : 'border-verde text-verde hover:bg-verde hover:text-crema'
                    }`}
                  >
                    {p.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditando(p)}
                    className="rounded-full bg-verde px-3.5 py-2 text-xs font-semibold text-crema transition-colors hover:bg-verde-medio"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmarBorrado(p.id)}
                    className="rounded-full border border-crema-profundo px-3.5 py-2 text-xs font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </TarjetaAdmin>

      {editando && (
        <FormularioProducto producto={editando} onCerrar={() => setEditando(null)} />
      )}
      {confirmarBorrado && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-5">
          <button
            type="button"
            aria-label="Cancelar"
            onClick={() => setConfirmarBorrado(null)}
            className="animar-aparece absolute inset-0 bg-tinta/55"
          />
          <div className="animar-desliza relative w-full max-w-sm rounded-2xl bg-crema p-6 shadow-flotante">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rojo-suave text-rojo">
              <IconoCerrar width={20} height={20} />
            </span>
            <h2 className="mt-4 font-serif text-xl font-bold text-verde">Eliminar producto</h2>
            <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
              Vas a eliminar{' '}
              <strong className="text-verde">
                {productos.find((p) => p.id === confirmarBorrado)?.nombre}
              </strong>{' '}
              del catálogo. Se quitará también de los favoritos y carritos de los clientes. Esta
              acción no se puede deshacer.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmarBorrado(null)}
                className="flex-1 rounded-full border border-crema-profundo py-2.5 text-sm font-semibold text-tinta-suave"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  eliminarProducto(confirmarBorrado)
                  setConfirmarBorrado(null)
                }}
                className="flex-1 rounded-full bg-rojo py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-rojo-claro"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

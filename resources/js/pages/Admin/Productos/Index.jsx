import { useEffect, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { ImagenProducto } from '@/components/ProductoUI'
import { IconoBuscar, IconoCerrar } from '@/components/Iconos'
import { precio } from '@/lib/config'

export default function ProductosIndex({ productos, categorias, filtros }) {
  const [q, setQ] = useState(filtros.q ?? '')

  useEffect(() => setQ(filtros.q ?? ''), [filtros.q])

  const ir = (params) =>
    router.get(
      '/admin/productos',
      { ...params },
      { preserveScroll: true, preserveState: true, replace: true, only: ['productos', 'filtros'] },
    )

  useEffect(() => {
    if (q === (filtros.q ?? '')) return
    const t = setTimeout(() => ir({ q: q || undefined, categoria: filtros.categoria || undefined }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const items = productos.data ?? []
  const meta = productos.meta ?? {}

  const eliminar = (producto) => {
    if (!confirm(`¿Eliminar "${producto.nombre}"? Se perderá en el catálogo.`)) return
    router.delete(`/admin/productos/${producto.id}`, { preserveScroll: true })
  }

  return (
    <>
      <Head title="Productos" />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Productos</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            {meta.total ?? items.length} en el catálogo. El stock se descuenta solo con cada
            pedido.
          </p>
        </div>
        <Link
          href="/admin/productos/create"
          className="rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
        >
          + Nuevo producto
        </Link>
      </header>

      <TarjetaAdmin>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <IconoBuscar className="absolute top-1/2 left-3.5 -translate-y-1/2 text-tinta-suave" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full rounded-full border border-crema-profundo bg-crema py-2.5 pr-4 pl-10 text-sm focus:border-verde-claro"
            />
          </div>

          <select
            value={filtros.categoria ?? ''}
            onChange={(e) => ir({ q: q || undefined, categoria: e.target.value || undefined })}
            className="rounded-full border border-crema-profundo bg-crema px-4 py-2.5 text-sm focus:border-verde-claro"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>

          {(q || filtros.categoria) && (
            <button
              type="button"
              onClick={() => {
                setQ('')
                ir({})
              }}
              className="flex items-center gap-1.5 rounded-full border border-crema-profundo px-3.5 py-2.5 text-xs font-semibold text-tinta-suave hover:border-rojo hover:text-rojo"
            >
              <IconoCerrar width={13} height={13} /> Limpiar
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-tinta-suave">
            No hay productos que coincidan con el filtro.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-crema-oscuro text-left text-[0.7rem] tracking-wide text-tinta-suave uppercase">
                  <th className="pb-2.5 font-semibold">Producto</th>
                  <th className="pb-2.5 font-semibold">Categoría</th>
                  <th className="pb-2.5 text-right font-semibold">Precio</th>
                  <th className="pb-2.5 text-right font-semibold">Stock</th>
                  <th className="pb-2.5 text-center font-semibold">Estado</th>
                  <th className="pb-2.5 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-crema-oscuro last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
                          <ImagenProducto producto={p} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-verde">{p.nombre}</span>
                          <span className="block truncate text-xs text-tinta-suave">
                            {p.presentacion}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-tinta-suave">{p.categoria?.nombre ?? '—'}</td>
                    <td className="py-3 text-right font-serif font-semibold text-verde">
                      {precio(p.precio)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`font-semibold ${
                          p.stock === 0
                            ? 'text-rojo'
                            : p.stock <= p.stockMinimo
                              ? 'text-dorado'
                              : 'text-tinta'
                        }`}
                      >
                        {p.stock}
                      </span>
                      <span className="text-xs text-tinta-suave"> / mín {p.stockMinimo}</span>
                    </td>
                    <td className="py-3 text-center">
                      {p.activo ? (
                        <span className="eyebrow rounded-full bg-verde-suave px-2 py-0.5 text-verde">
                          Activo
                        </span>
                      ) : (
                        <span className="eyebrow rounded-full bg-crema-profundo px-2 py-0.5 text-tinta-suave">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/catalogo/${p.slug}`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-tinta-suave hover:bg-crema hover:text-verde"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/admin/productos/${p.id}/edit`}
                          className="rounded-lg bg-verde px-2.5 py-1.5 text-xs font-semibold text-crema hover:bg-verde-medio"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => eliminar(p)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-tinta-suave hover:bg-rojo hover:text-crema"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(meta.last_page ?? 1) > 1 && (
          <nav className="mt-5 flex flex-wrap justify-center gap-2">
            {(meta.links ?? [])
              .filter((l) => l.url)
              .map((l, i) => (
                <button
                  key={`${l.label}-${i}`}
                  type="button"
                  onClick={() => router.get(l.url, {}, { preserveScroll: true, replace: true })}
                  className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                    l.active
                      ? 'border-verde bg-verde text-crema'
                      : 'border-crema-profundo bg-white text-tinta hover:border-verde'
                  }`}
                  dangerouslySetInnerHTML={{ __html: l.label }}
                />
              ))}
          </nav>
        )}
      </TarjetaAdmin>
    </>
  )
}

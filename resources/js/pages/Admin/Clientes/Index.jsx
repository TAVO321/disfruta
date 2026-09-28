import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { fecha, precio } from '@/lib/config'
import { BotonAdmin } from '@/components/BotonAdmin'

export default function ClientesIndex({ clientes, filtros }) {
  const [q, setQ] = useState(filtros.q ?? '')

  useEffect(() => setQ(filtros.q ?? ''), [filtros.q])

  useEffect(() => {
    if (q === (filtros.q ?? '')) return
    const t = setTimeout(
      () => router.get('/admin/clientes', { q: q || undefined }, { preserveScroll: true, replace: true, only: ['clientes', 'filtros'] }),
      350,
    )
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const eliminar = (cliente) => {
    if (!confirm(`¿Eliminar a ${cliente.nombre}? Sus pedidos quedan sin cliente asignado.`)) return
    router.delete(`/admin/clientes/${cliente.id}`, { preserveScroll: true })
  }

  const items = clientes.data ?? []
  const meta = clientes.meta ?? {}

  return (
    <>
      <Head title="Clientes" />

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Clientes</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          {meta.total ?? items.length} clientes registrados. 'Gastado' excluye pedidos cancelados.
        </p>
      </header>

      <TarjetaAdmin>
        <div className="relative mb-5 max-w-sm">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="w-full rounded-full border border-crema-profundo bg-crema px-4 py-2.5 text-sm"
          />
        </div>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-tinta-suave">No hay clientes con ese filtro.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-crema-oscuro text-left text-[0.7rem] tracking-wide text-tinta-suave uppercase">
                  <th className="pb-2.5 font-semibold">Cliente</th>
                  <th className="pb-2.5 font-semibold">Zona</th>
                  <th className="pb-2.5 text-right font-semibold">Pedidos</th>
                  <th className="pb-2.5 text-right font-semibold">Gastado</th>
                  <th className="pb-2.5 font-semibold">Último</th>
                  <th className="pb-2.5 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-crema-oscuro last:border-0">
                    <td className="py-3">
                      <span className="block font-medium text-verde">{c.nombre}</span>
                      <span className="block text-xs text-tinta-suave">{c.telefono}</span>
                    </td>
                    <td className="py-3 text-tinta-suave">{c.zona ?? '—'}</td>
                    <td className="py-3 text-right font-semibold text-tinta">{c.pedidos}</td>
                    <td className="py-3 text-right font-serif font-semibold text-verde">
                      {precio(c.gastado)}
                    </td>
                    <td className="py-3 text-xs text-tinta-suave">{fecha(c.ultimo)}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${c.telefono.replace(/\s/g, '')}`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-tinta-suave hover:bg-crema hover:text-verde"
                        >
                          Llamar
                        </a>
                  <BotonAdmin variante="peligro" onClick={() => eliminar(c)}>
                    Eliminar
                  </BotonAdmin>
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
                  className={`rounded-full border px-3.5 py-1.5 text-xs ${
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

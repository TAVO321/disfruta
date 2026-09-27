import { useEffect, useState } from 'react'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { claseTono, fechaHora, precio } from '@/lib/config'
import { linkWhatsApp } from '@/lib/whatsapp'

export default function PedidosIndex({ pedidos, estados, filtros }) {
  const { estadosPedido } = usePage().props
  const nombreEstado = Object.fromEntries((estadosPedido ?? []).map((e) => [e.id, e.nombre]))
  const tonoEstado = Object.fromEntries((estadosPedido ?? []).map((e) => [e.id, e.tono]))
  const [q, setQ] = useState(filtros.q ?? '')
  const { data, setData, patch, processing, errors } = useForm({ estado: '' })
  const [editando, setEditando] = useState(null)

  useEffect(() => setQ(filtros.q ?? ''), [filtros.q])

  const ir = (params) =>
    router.get(
      '/admin/pedidos',
      { ...params },
      { preserveScroll: true, preserveState: true, replace: true, only: ['pedidos', 'filtros'] },
    )

  useEffect(() => {
    if (q === (filtros.q ?? '')) return
    const t = setTimeout(
      () => ir({ q: q || undefined, estado: filtros.estado || undefined }),
      350,
    )
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const cambiarEstado = (pedido) => {
    setEditando(pedido.id)
    setData('estado', pedido.estado)
    // La ruta de estado solo admite PATCH: con POST devolvia 405.
    patch(`/admin/pedidos/${pedido.id}/estado`, { preserveScroll: true })
  }

  const eliminar = (pedido) => {
    if (!confirm(`¿Eliminar el pedido #${pedido.id} de ${pedido.cliente}?`)) return
    router.delete(`/admin/pedidos/${pedido.id}`, { preserveScroll: true })
  }

  const items = pedidos.data ?? []
  const meta = pedidos.meta ?? {}

  return (
    <>
      <Head title="Pedidos" />

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Pedidos</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          El stock ya se descontó al confirmar. Cancelar no lo devuelve automáticamente.
        </p>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="w-full rounded-full border border-crema-profundo bg-white px-4 py-2.5 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => ir({ q: q || undefined })}
            className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${
              !filtros.estado
                ? 'border-verde bg-verde text-crema'
                : 'border-crema-profundo bg-white text-tinta hover:border-verde'
            }`}
          >
            Todos
          </button>
          {estados.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => ir({ q: q || undefined, estado: filtros.estado === e ? undefined : e })}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold ${
                filtros.estado === e
                  ? 'border-verde bg-verde text-crema'
                  : 'border-crema-profundo bg-white text-tinta hover:border-verde'
              }`}
            >
              {nombreEstado[e] ?? e}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <TarjetaAdmin>
          <p className="py-12 text-center text-sm text-tinta-suave">
            No hay pedidos que coincidan con el filtro.
          </p>
        </TarjetaAdmin>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => {
            const abierto = editando === p.id
            return (
              <li key={p.id} className="rounded-2xl border border-crema-profundo bg-white p-4 shadow-suave">
                {/* Movil: los datos se apilan en filas legibles con margen.
                    Escritorio: vuelven a una sola linea (sm:contents + order). */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center justify-between gap-2 sm:contents">
                    <span className="font-serif text-lg font-bold text-verde sm:order-1">#{p.id}</span>
                    <span
                      className={`eyebrow shrink-0 rounded-full px-2.5 py-1 sm:order-3 ${
                        claseTono(tonoEstado[p.estado])
                      }`}
                    >
                      {nombreEstado[p.estado] ?? p.estado}
                    </span>
                  </div>

                  <div className="min-w-0 sm:order-2 sm:flex-1">
                    <p className="font-medium text-tinta sm:truncate">{p.cliente}</p>
                    <p className="mt-1 text-sm text-tinta-suave">
                      {p.telefono}
                      {p.zona ? ` · ${p.zona}` : ''}
                    </p>
                    <p className="mt-0.5 text-xs text-tinta-suave">{fechaHora(p.creado)}</p>
                  </div>

                  <span className="font-serif text-lg font-bold text-verde sm:order-4 sm:text-base">
                    {precio(p.total)}
                  </span>

                  <button
                    type="button"
                    onClick={() => setEditando(abierto ? null : p.id)}
                    className="w-full shrink-0 rounded-lg border border-crema-profundo px-3 py-2 text-sm font-semibold text-tinta hover:border-verde hover:text-verde sm:order-5 sm:w-auto sm:border-0 sm:px-2.5 sm:py-1.5 sm:text-xs sm:text-tinta-suave sm:hover:bg-crema"
                  >
                    {abierto ? 'Ocultar' : 'Gestionar'}
                  </button>
                </div>

                {abierto && (
                  <div className="mt-4 space-y-4 border-t border-crema-oscuro pt-4">
                    <ul className="space-y-1.5">
                      {p.items.map((i) => (
                        <li key={i.id} className="flex justify-between gap-3 text-sm">
                          <span className="text-tinta">
                            {i.cantidad} × {i.nombre}
                            {i.reserva && (
                              <span className="ml-1.5 text-[0.65rem] text-tinta-suave">(reserva)</span>
                            )}
                          </span>
                          <span className="font-serif font-semibold text-verde">
                            {precio(i.subtotal)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {p.notas && (
                      <p className="rounded-lg bg-crema px-3.5 py-2.5 text-xs text-tinta-suave">
                        <span className="font-semibold text-tinta">Notas:</span> {p.notas}
                      </p>
                    )}

                    <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-end">
                      <div className="w-full sm:w-auto">
                        <label className="mb-1.5 block text-[0.7rem] font-semibold tracking-wide text-tinta-suave uppercase">
                          Cambiar estado
                        </label>
                        <select
                          value={data.estado}
                          onChange={(e) => setData('estado', e.target.value)}
                          className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm sm:w-auto"
                        >
                          {estados.map((e) => (
                            <option key={e} value={e}>
                              {nombreEstado[e] ?? e}
                            </option>
                          ))}
                        </select>
                        {errors.estado && <p className="mt-1 text-xs text-rojo">{errors.estado}</p>}
                      </div>

                      <button
                        type="button"
                        onClick={() => cambiarEstado(p)}
                        disabled={processing}
                        className="w-full rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema hover:bg-verde-medio disabled:opacity-50 sm:w-auto"
                      >
                        Guardar
                      </button>

                      <a
                        href={linkWhatsApp(
                          encodeURIComponent(
                            `Hola ${p.cliente}, te escribimos de DISFRUTA por tu pedido #${p.id}.`,
                          ),
                          p.telefono,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full rounded-full border border-verde px-5 py-2.5 text-center text-sm font-semibold text-verde hover:bg-verde hover:text-crema sm:w-auto"
                      >
                        WhatsApp
                      </a>

                      <button
                        type="button"
                        onClick={() => eliminar(p)}
                        className="w-full rounded-full border border-crema-profundo px-4 py-2.5 text-xs font-semibold text-tinta-suave hover:border-rojo hover:bg-rojo hover:text-crema sm:ml-auto sm:w-auto"
                      >
                        Eliminar pedido
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {(meta.last_page ?? 1) > 1 && (
        <nav className="mt-6 flex flex-wrap justify-center gap-2">
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
    </>
  )
}

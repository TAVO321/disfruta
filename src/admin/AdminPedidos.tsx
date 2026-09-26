import { useState } from 'react'
import { ESTADOS, TarjetaAdmin } from '@/admin/AdminLayout'
import { IconoWhatsapp } from '@/components/Iconos'
import { fecha, precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'
import type { EstadoPedido } from '@/types'
import { useTienda } from '@/store/tienda'

export function AdminPedidos() {
  const { datos, actualizarEstadoPedido } = useTienda()
  const [filtro, setFiltro] = useState<EstadoPedido | 'todos'>('todos')

  const lista = datos.pedidos
    .filter((p) => (filtro === 'todos' ? true : p.estado === filtro))
    .sort((a, b) => b.creado.localeCompare(a.creado))

  const facturado = datos.pedidos
    .filter((p) => p.estado === 'entregado')
    .reduce((s, p) => s + p.total, 0)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-verde">Pedidos</h1>
          <p className="mt-1.5 text-sm text-tinta-suave">
            {datos.pedidos.length} pedidos · {precio(facturado)} facturados en entregados
          </p>
        </div>
        <a
          href={linkWhatsApp(mensajeConsultaSimple('el estado de un pedido'))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-crema-profundo bg-white px-5 py-3 text-sm font-semibold text-verde transition-colors hover:border-verde"
        >
          <IconoWhatsapp width={16} height={16} />
          Pedir por WhatsApp
        </a>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'todos', t: `Todos (${datos.pedidos.length})` },
            ...ESTADOS.filter((e) => e.id !== 'cancelado').map((e) => ({
              id: e.id,
              t: `${e.nombre} (${datos.pedidos.filter((p) => p.estado === e.id).length})`,
            })),
          ] as { id: EstadoPedido | 'todos'; t: string }[]
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filtro === f.id
                ? 'border-verde bg-verde text-crema'
                : 'border-crema-profundo bg-white text-tinta hover:border-verde'
            }`}
          >
            {f.t}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <TarjetaAdmin titulo="Listado">
          <p className="py-10 text-center text-sm text-tinta-suave">
            No hay pedidos con ese estado.
          </p>
        </TarjetaAdmin>
      ) : (
        <ul className="space-y-4">
          {lista.map((p) => {
            const estado = ESTADOS.find((e) => e.id === p.estado)!
            const tieneReservas = p.items.some((i) => i.reserva)
            return (
              <li
                key={p.id}
                className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-lg font-bold text-verde">{p.id}</h2>
                      <span
                        className={`eyebrow rounded-full px-2.5 py-1 ${estado.color}`}
                      >
                        {estado.nombre}
                      </span>
                      {tieneReservas && (
                        <span className="eyebrow rounded-full bg-rojo-suave px-2.5 py-1 text-rojo">
                          Incluye reservas
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-tinta">
                      <strong className="font-semibold">{p.cliente}</strong>
                      {p.telefono && ` · ${p.telefono}`}
                    </p>
                    <p className="text-xs text-tinta-suave">
                      {p.zona} · {fecha(p.creado.slice(0, 10))}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-2xl font-bold text-verde">
                      {precio(p.total)}
                    </p>
                    <p className="text-xs text-tinta-suave">
                      {p.items.reduce((n, i) => n + i.cantidad, 0)} unidades
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5 rounded-xl bg-crema p-4">
                  {p.items.map((i, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde text-[0.65rem] font-bold text-crema">
                        {i.cantidad}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-tinta">{i.nombre}</span>
                      {i.reserva && (
                        <span className="shrink-0 rounded-full bg-rojo-suave px-2 py-0.5 text-[0.65rem] font-semibold text-rojo">
                          reserva próximo lote
                        </span>
                      )}
                      <span className="shrink-0 font-medium text-verde">
                        {precio(i.precio * i.cantidad)}
                      </span>
                    </li>
                  ))}
                </ul>

                {p.notas && (
                  <p className="mt-3 rounded-xl border-l-2 border-dorado bg-dorado-suave/40 px-3.5 py-2.5 text-xs text-tinta">
                    <strong className="font-semibold">Nota:</strong> {p.notas}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="eyebrow mr-1 text-tinta-suave">Cambiar estado</span>
                  {ESTADOS.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => actualizarEstadoPedido(p.id, e.id)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        p.estado === e.id
                          ? 'border-verde bg-verde text-crema'
                          : 'border-crema-profundo text-tinta hover:border-verde'
                      }`}
                    >
                      {e.nombre}
                    </button>
                  ))}
                  {p.telefono && (
                    <a
                      href={linkWhatsApp(
                        `Hola ${p.cliente}, te escribimos desde ${'DISFRUTA'} por tu pedido ${p.id} (${precio(p.total)}).`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-verde-suave px-4 py-2 text-xs font-semibold text-verde transition-colors hover:bg-verde hover:text-crema"
                    >
                      <IconoWhatsapp width={14} height={14} />
                      Avisar al cliente
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

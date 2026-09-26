import { useState } from 'react'
import { TarjetaAdmin } from '@/admin/AdminLayout'
import { IconoBuscar, IconoWhatsapp } from '@/components/Iconos'
import { ImagenProducto } from '@/components/ProductoUI'
import { precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'
import { useTienda } from '@/store/tienda'

export function AdminClientes() {
  const { datos, productos } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState<string | null>(null)

  const lista = datos.clientes.filter((c) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.telefono.toLowerCase().includes(q) ||
      c.zona.toLowerCase().includes(q)
    )
  })

  const cliente = datos.clientes.find((c) => c.id === seleccionado)
  const susPedidos = cliente
    ? datos.pedidos.filter((p) => p.cliente === cliente.nombre)
    : []
  const susFavoritos = cliente
    ? cliente.favoritosIds
        .map((id) => productos.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : []
  const susReservas = cliente
    ? cliente.reservasIds
        .map((id) => productos.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : []

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-verde">Clientes</h1>
        <p className="mt-1.5 text-sm text-tinta-suave">
          {datos.clientes.length} clientes registrados · historial, favoritos y reservas
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <Metrica titulo="Clientes totales" valor={String(datos.clientes.length)} />
        <Metrica
          titulo="Clientes frecuentes"
          valor={String(datos.clientes.filter((c) => c.pedidos >= 3).length)}
        />
        <Metrica
          titulo="Con reservas abiertas"
          valor={String(datos.clientes.filter((c) => c.reservasIds.length > 0).length)}
        />
        <Metrica
          titulo="Facturación total"
          valor={precio(datos.clientes.reduce((s, c) => s + c.gastado, 0))}
        />
      </div>

      <div className="relative">
        <IconoBuscar className="absolute top-1/2 left-4 -translate-y-1/2 text-tinta-suave" />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, teléfono o zona..."
          className="w-full rounded-full border border-crema-profundo bg-white py-3 pr-4 pl-11 text-sm focus:border-verde-claro"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <TarjetaAdmin titulo="Listado de clientes" subtitulo={`${lista.length} resultados`}>
          {lista.length === 0 ? (
            <p className="py-8 text-center text-sm text-tinta-suave">
              No hay clientes con esa búsqueda.
            </p>
          ) : (
            <ul className="divide-y divide-crema-oscuro">
              {lista.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSeleccionado(c.id === seleccionado ? null : c.id)}
                    className={`flex w-full flex-wrap items-center gap-4 py-3.5 text-left transition-colors ${
                      seleccionado === c.id ? 'bg-crema-oscuro/60' : 'hover:bg-crema-oscuro/40'
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-verde text-sm font-bold text-crema">
                      {c.nombre.charAt(0)}
                    </span>
                    <span className="min-w-40 flex-1">
                      <span className="block text-sm font-semibold text-verde">{c.nombre}</span>
                      <span className="block text-xs text-tinta-suave">
                        {c.telefono} · {c.zona}
                      </span>
                    </span>
                    <span className="shrink-0 text-center">
                      <span className="block font-serif text-base font-bold text-verde">
                        {c.pedidos}
                      </span>
                      <span className="block text-[0.65rem] text-tinta-suave">pedidos</span>
                    </span>
                    <span className="shrink-0 text-center">
                      <span className="block font-serif text-base font-bold text-dorado">
                        {precio(c.gastado)}
                      </span>
                      <span className="block text-[0.65rem] text-tinta-suave">total</span>
                    </span>
                    {c.reservasIds.length > 0 && (
                      <span className="eyebrow shrink-0 rounded-full bg-rojo px-2 py-0.5 text-crema">
                        {c.reservasIds.length} reserva
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </TarjetaAdmin>

        <TarjetaAdmin titulo="Detalle del cliente" subtitulo="Historial, favoritos y reservas">
          {!cliente ? (
            <p className="py-8 text-center text-sm text-tinta-suave">
              Elegí un cliente de la lista para ver su detalle.
            </p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="font-serif text-xl font-bold text-verde">{cliente.nombre}</p>
                <p className="mt-0.5 text-sm text-tinta-suave">
                  {cliente.telefono} · {cliente.zona}
                </p>
                <p className="text-xs text-tinta-suave">
                  Último contacto: {cliente.ultimoContacto}
                </p>
                <a
                  href={linkWhatsApp(mensajeConsultaSimple(`un pedido, ${cliente.nombre}`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-verde px-4 py-2 text-xs font-semibold text-crema transition-colors hover:bg-verde-medio"
                >
                  <IconoWhatsapp width={14} height={14} />
                  Escribirle
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-crema-oscuro/60 p-3.5 text-center">
                  <p className="font-serif text-2xl font-bold text-verde">{cliente.pedidos}</p>
                  <p className="text-[0.65rem] tracking-wide text-tinta-suave uppercase">
                    pedidos
                  </p>
                </div>
                <div className="rounded-xl bg-crema-oscuro/60 p-3.5 text-center">
                  <p className="font-serif text-2xl font-bold text-dorado">
                    {precio(cliente.gastado)}
                  </p>
                  <p className="text-[0.65rem] tracking-wide text-tinta-suave uppercase">total</p>
                </div>
              </div>

              <div>
                <p className="eyebrow mb-2 text-tinta-suave">
                  Historial de pedidos ({susPedidos.length})
                </p>
                {susPedidos.length === 0 ? (
                  <p className="text-xs text-tinta-suave">Sin pedidos registrados.</p>
                ) : (
                  <ul className="space-y-2">
                    {susPedidos.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-crema-oscuro/50 px-3 py-2 text-xs"
                      >
                        <span>
                          <strong className="text-verde">{p.id}</strong>
                          <span className="text-tinta-suave"> · {p.creado.slice(0, 10)}</span>
                        </span>
                        <span className="font-semibold text-verde">{precio(p.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="eyebrow mb-2 text-tinta-suave">
                  Favoritos ({susFavoritos.length})
                </p>
                {susFavoritos.length === 0 ? (
                  <p className="text-xs text-tinta-suave">Sin favoritos.</p>
                ) : (
                  <ul className="space-y-2">
                    {susFavoritos.map((p) => (
                      <li key={p.id} className="flex items-center gap-2.5">
                        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
                          <ImagenProducto producto={p} />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-medium text-verde">
                          {p.nombre}
                        </span>
                        <span className="shrink-0 text-xs text-tinta-suave">
                          {p.stock > 0 ? `${p.stock} u.` : 'sin stock'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="eyebrow mb-2 text-tinta-suave">
                  Reservas ({susReservas.length})
                </p>
                {susReservas.length === 0 ? (
                  <p className="text-xs text-tinta-suave">Sin reservas.</p>
                ) : (
                  <ul className="space-y-2">
                    {susReservas.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-rojo-suave px-3 py-2 text-xs"
                      >
                        <span className="min-w-0 flex-1 truncate font-medium text-rojo">
                          {p.nombre}
                        </span>
                        <span className="shrink-0 text-rojo/70">
                          {p.lotes[0]?.codigo ?? 'próximo lote'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </TarjetaAdmin>
      </div>
    </div>
  )
}

function Metrica({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave">
      <p className="eyebrow text-tinta-suave">{titulo}</p>
      <p className="mt-2 font-serif text-2xl font-bold text-verde">{valor}</p>
    </div>
  )
}

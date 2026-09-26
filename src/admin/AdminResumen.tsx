import { Link } from 'react-router-dom'
import { TarjetaAdmin } from '@/admin/AdminLayout'
import { IconoFlecha } from '@/components/Iconos'
import { ImagenProducto } from '@/components/ProductoUI'
import { precio } from '@/lib/config'
import type { Pedido, Producto } from '@/types'
import { useTienda } from '@/store/tienda'

export function AdminResumen() {
  const { datos, productos } = useTienda()

  const activos = productos.filter((p) => p.activo)
  const agotados = productos.filter((p) => p.stock === 0)
  const bajoStock = productos.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo)
  const unidades = productos.reduce((s, p) => s + p.stock, 0)
  const valorInventario = productos.reduce((s, p) => s + p.stock * p.precio, 0)

  const entregado = datos.pedidos.filter((p) => p.estado === 'entregado')
  const ventasMes = entregado.reduce((s, p) => s + p.total, 0)
  const pedidosMes = datos.pedidos.filter((p) => p.creado.startsWith('2026-09'))
  const ticket = pedidosMes.length ? pedidosMes.reduce((s, p) => s + p.total, 0) / pedidosMes.length : 0

  const masVendidos = masPorUnidades(datos.pedidos, productos)
  const masReservados = masPorUnidades(
    datos.pedidos.flatMap((p) =>
      p.items.filter((i) => i.reserva).map((i) => ({ ...p, items: [i] })),
    ),
    productos,
  )

  const clientesFrecuentes = [...datos.clientes].sort((a, b) => b.gastado - a.gastado).slice(0, 5)
  const porEstado = ['nuevo', 'confirmado', 'preparando', 'entregado'] as const

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-verde">Resumen del negocio</h1>
        <p className="mt-1.5 text-sm text-tinta-suave">
          Vista rápida de stock, ventas y actividad de {new Date().toLocaleDateString('es-AR', {
            month: 'long',
            year: 'numeric',
          })}
          .
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          titulo="Ventas del mes"
          valor={precio(ventasMes)}
          pie={`${entregado.length} pedidos entregados`}
          tono="verde"
        />
        <Metrica
          titulo="Ticket promedio"
          valor={precio(Math.round(ticket))}
          pie={`${pedidosMes.length} pedidos en el mes`}
          tono="dorado"
        />
        <Metrica
          titulo="Unidades en stock"
          valor={String(unidades)}
          pie={`${activos.length} productos activos`}
          tono="verde"
        />
        <Metrica
          titulo="Valor del inventario"
          valor={precio(valorInventario)}
          pie="A precio de venta"
          tono="dorado"
        />
      </div>

      {(agotados.length > 0 || bajoStock.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {agotados.length > 0 && (
            <AlertaCard
              tono="rojo"
              titulo={`${agotados.length} producto${agotados.length === 1 ? '' : 's'} sin stock`}
              texto="Estos quedan visibles en la web y se pueden reservar para el próximo lote."
              productos={agotados}
              enlace="/admin/lotes"
              textoEnlace="Registrar lotes"
            />
          )}
          {bajoStock.length > 0 && (
            <AlertaCard
              tono="dorado"
              titulo={`${bajoStock.length} producto${bajoStock.length === 1 ? '' : 's'} con poco stock`}
              texto="Stock por debajo del mínimo configurado. Programá la próxima producción."
              productos={bajoStock}
              enlace="/admin/stock"
              textoEnlace="Ajustar stock"
            />
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <TarjetaAdmin titulo="Productos más vendidos" subtitulo="Por unidades entregadas">
          <Ranking productos={masVendidos} vacio="Todavía no hay ventas registradas." />
        </TarjetaAdmin>

        <TarjetaAdmin titulo="Productos más reservados" subtitulo="Por unidades reservadas">
          <Ranking productos={masReservados} vacio="Todavía no hay reservas registradas." />
        </TarjetaAdmin>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TarjetaAdmin titulo="Estado de los pedidos">
          <div className="space-y-3">
            {porEstado.map((estado) => {
              const n = datos.pedidos.filter((p) => p.estado === estado).length
              const etiquetas = {
                nuevo: 'Nuevos',
                confirmado: 'Confirmados',
                preparando: 'Preparando',
                entregado: 'Entregados',
              }
              return (
                <div key={estado}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-tinta">{etiquetas[estado]}</span>
                    <span className="font-semibold text-verde">{n}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-crema-profundo">
                    <div
                      className="h-full rounded-full bg-verde transition-all"
                      style={{
                        width: `${Math.max(
                          (n / Math.max(datos.pedidos.length, 1)) * 100,
                          n > 0 ? 6 : 0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <Link
            to="/admin/pedidos"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-verde hover:text-rojo"
          >
            Ver todos los pedidos
            <IconoFlecha width={14} height={14} />
          </Link>
        </TarjetaAdmin>

        <TarjetaAdmin titulo="Clientes frecuentes" subtitulo="Ordenados por consumo histórico">
          {clientesFrecuentes.length === 0 ? (
            <p className="text-sm text-tinta-suave">Todavía no hay clientes registrados.</p>
          ) : (
            <ul className="divide-y divide-crema-oscuro">
              {clientesFrecuentes.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-verde-suave text-xs font-bold text-verde">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-verde">
                      {c.nombre}
                    </span>
                    <span className="block text-xs text-tinta-suave">
                      {c.pedidos} {c.pedidos === 1 ? 'pedido' : 'pedidos'} · {c.zona}
                    </span>
                  </span>
                  <span className="shrink-0 font-serif text-sm font-semibold text-verde">
                    {precio(c.gastado)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/admin/clientes"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-verde hover:text-rojo"
          >
            Ver todos los clientes
            <IconoFlecha width={14} height={14} />
          </Link>
        </TarjetaAdmin>
      </div>

      <TarjetaAdmin titulo="Últimos pedidos">
        {datos.pedidos.length === 0 ? (
          <p className="text-sm text-tinta-suave">Todavía no se hicieron pedidos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-125 text-sm">
              <thead>
                <tr className="border-b border-crema-oscuro text-left text-xs tracking-wide text-tinta-suave uppercase">
                  <th className="pb-2.5 font-semibold">Pedido</th>
                  <th className="pb-2.5 font-semibold">Cliente</th>
                  <th className="pb-2.5 font-semibold">Items</th>
                  <th className="pb-2.5 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {datos.pedidos.slice(0, 5).map((p) => (
                  <tr key={p.id} className="border-b border-crema-oscuro last:border-0">
                    <td className="py-2.5 font-semibold text-verde">{p.id}</td>
                    <td className="py-2.5 text-tinta">{p.cliente}</td>
                    <td className="py-2.5 text-tinta-suave">
                      {p.items.reduce((n, i) => n + i.cantidad, 0)}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-verde">
                      {precio(p.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TarjetaAdmin>
    </div>
  )
}

function masPorUnidades(
  pedidos: Pedido[],
  productos: Producto[],
): { producto: Producto; unidades: number }[] {
  const mapa = new Map<string, number>()
  for (const pedido of pedidos) {
    for (const item of pedido.items) {
      mapa.set(item.productoId, (mapa.get(item.productoId) ?? 0) + item.cantidad)
    }
  }
  return [...mapa.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, n]) => ({ producto: productos.find((p) => p.id === id), unidades: n }))
    .filter((x): x is { producto: Producto; unidades: number } => Boolean(x.producto))
}

function Metrica({
  titulo,
  valor,
  pie,
  tono,
}: {
  titulo: string
  valor: string
  pie: string
  tono: 'verde' | 'dorado'
}) {
  return (
    <div className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave">
      <p className="eyebrow text-tinta-suave">{titulo}</p>
      <p
        className={`mt-2 font-serif text-3xl font-bold ${tono === 'verde' ? 'text-verde' : 'text-dorado'}`}
      >
        {valor}
      </p>
      <p className="mt-1 text-xs text-tinta-suave">{pie}</p>
    </div>
  )
}

function AlertaCard({
  tono,
  titulo,
  texto,
  productos,
  enlace,
  textoEnlace,
}: {
  tono: 'rojo' | 'dorado'
  titulo: string
  texto: string
  productos: Producto[]
  enlace: string
  textoEnlace: string
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tono === 'rojo' ? 'border-rojo/30 bg-rojo-suave' : 'border-dorado/30 bg-dorado-suave/50'
      }`}
    >
      <p
        className={`font-serif text-lg font-semibold ${tono === 'rojo' ? 'text-rojo' : 'text-verde'}`}
      >
        {titulo}
      </p>
      <p className="mt-1 text-sm text-tinta-suave">{texto}</p>
      <ul className="mt-3 space-y-1.5">
        {productos.slice(0, 4).map((p) => (
          <li key={p.id} className="flex items-center gap-2 text-sm text-tinta">
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
            <span className="min-w-0 flex-1 truncate">{p.nombre}</span>
            <span className="shrink-0 text-xs font-semibold">
              {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
            </span>
          </li>
        ))}
      </ul>
      <Link
        to={enlace}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-verde hover:text-rojo"
      >
        {textoEnlace}
        <IconoFlecha width={14} height={14} />
      </Link>
    </div>
  )
}

function Ranking({
  productos,
  vacio,
}: {
  productos: { producto: Producto; unidades: number }[]
  vacio: string
}) {
  if (productos.length === 0) return <p className="text-sm text-tinta-suave">{vacio}</p>
  const max = Math.max(...productos.map((p) => p.unidades))
  return (
    <ol className="space-y-3">
      {productos.map((p, i) => (
        <li key={p.producto.id} className="flex items-center gap-3">
          <span className="w-4 shrink-0 text-sm font-bold text-dorado">{i + 1}</span>
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
            <ImagenProducto producto={p.producto} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-verde">
              {p.producto.nombre}
            </span>
            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-crema-profundo">
              <span
                className="block h-full rounded-full bg-dorado"
                style={{ width: `${(p.unidades / max) * 100}%` }}
              />
            </span>
          </span>
          <span className="shrink-0 text-sm font-semibold text-verde">
            {p.unidades} <span className="text-xs font-normal text-tinta-suave">u.</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

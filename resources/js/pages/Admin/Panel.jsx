import { Head, Link } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { ImagenProducto } from '@/components/ProductoUI'
import { claseTono, fecha, precio } from '@/lib/config'

export default function Panel({ resumen, ultimos_pedidos, stock_critico, top_productos, estadosPedido }) {
  const nombreEstado = Object.fromEntries((estadosPedido ?? []).map((e) => [e.id, e.nombre]))
  const tonoEstado = Object.fromEntries((estadosPedido ?? []).map((e) => [e.id, e.tono]))

  // Resources no paginados llegan como array plano; los paginados como {data, meta}.
  const pedidos = ultimos_pedidos ?? []

  const tarjetas = [
    { etiqueta: 'Pedidos nuevos', valor: resumen.pedidos_nuevos, tono: 'text-dorado' },
    { etiqueta: 'Pedidos activos', valor: resumen.pedidos_activos, tono: 'text-verde' },
    { etiqueta: 'Entregados', valor: resumen.entregados, tono: 'text-verde-medio' },
    { etiqueta: 'Facturado', valor: precio(resumen.facturado), tono: 'text-verde' },
    { etiqueta: 'Productos activos', valor: resumen.productos, tono: 'text-tinta' },
    { etiqueta: 'Clientes', valor: resumen.clientes, tono: 'text-tinta' },
    { etiqueta: 'Promociones vigentes', valor: resumen.promociones, tono: 'text-dorado' },
  ]

  return (
    <>
      <Head title="Panel" />

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Resumen</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          Estado actual de la tienda: pedidos, stock y clientes.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map((t) => (
          <div
            key={t.etiqueta}
            className="rounded-2xl border border-crema-profundo bg-white p-4 shadow-suave"
          >
            <p className={`font-serif text-2xl font-bold ${t.tono}`}>{t.valor}</p>
            <p className="mt-0.5 text-[0.7rem] tracking-wide text-tinta-suave uppercase">
              {t.etiqueta}
            </p>
          </div>
        ))}
      </div>

      {/* La columna implicita `auto` tomaba el min-content de las tarjetas (mas
          ancho que el viewport) y desbordaba la pagina en 320px. */}
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
        <TarjetaAdmin
          titulo="Últimos pedidos"
          subtitulo="Los 6 pedidos más recientes"
          accion={
            <Link
              href="/admin/pedidos"
              className="text-xs font-semibold text-verde underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          }
        >
          {pedidos.length === 0 ? (
            <p className="text-sm text-tinta-suave">Todavía no hay pedidos.</p>
          ) : (
            <ul className="space-y-2.5">
              {pedidos.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-crema-oscuro px-3.5 py-2.5"
                >
                  {/* Movil: filas apiladas. En una sola linea el nombre quedaba
                      aplastado entre el id, el estado y el total. */}
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center justify-between gap-2 sm:contents">
                      <span className="font-serif text-sm font-bold text-verde sm:order-1">
                        #{p.id}
                      </span>
                      <span
                        className={`eyebrow shrink-0 rounded-full px-2.5 py-0.5 sm:order-3 ${
                          claseTono(tonoEstado[p.estado])
                        }`}
                      >
                        {nombreEstado[p.estado] ?? p.estado}
                      </span>
                    </div>
                    <span className="min-w-0 text-sm text-tinta sm:order-2 sm:flex-1 sm:truncate">
                      {p.cliente}
                    </span>
                    <span className="font-serif text-sm font-semibold text-verde sm:order-4">
                      {precio(p.total)}
                    </span>
                    <span className="text-[0.7rem] text-tinta-suave sm:order-5 sm:w-auto">
                      {fecha(p.creado)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TarjetaAdmin>

        <TarjetaAdmin
          titulo="Stock crítico"
          subtitulo="Productos en o por debajo del mínimo"
          accion={
            <Link
              href="/admin/productos"
              className="text-xs font-semibold text-verde underline-offset-4 hover:underline"
            >
              Gestionar stock
            </Link>
          }
        >
          {stock_critico.length === 0 ? (
            <p className="text-sm text-tinta-suave">
              Ningún producto está por debajo del mínimo. Bien ahí.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {stock_critico.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5 sm:gap-3">
                  <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro sm:h-11 sm:w-11">
                    <ImagenProducto producto={p} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-verde">{p.nombre}</span>
                    <span className="text-[0.7rem] text-tinta-suave sm:text-xs">
                      Mínimo: {p.stockMinimo} unidades
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.stock === 0 ? 'bg-rojo text-crema' : 'bg-dorado text-verde'
                    }`}
                  >
                    {p.stock === 0 ? 'Agotado' : `Quedan ${p.stock}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </TarjetaAdmin>
      </div>

      {top_productos.length > 0 && (
        <div className="mt-6">
          <TarjetaAdmin titulo="Productos más vendidos" subtitulo="Por unidades, sin contar cancelados">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-crema-oscuro text-left text-[0.7rem] tracking-wide text-tinta-suave uppercase">
                    <th className="pb-2 font-semibold">Producto</th>
                    <th className="pb-2 text-right font-semibold">Unidades</th>
                    <th className="pb-2 text-right font-semibold">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {top_productos.map((t) => (
                    <tr key={t.nombre} className="border-b border-crema-oscuro last:border-0">
                      <td className="py-2.5 text-tinta">{t.nombre}</td>
                      <td className="py-2.5 text-right font-semibold text-verde">{t.unidades}</td>
                      <td className="py-2.5 text-right font-serif font-semibold text-verde">
                        {precio(t.ingresos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TarjetaAdmin>
        </div>
      )}
    </>
  )
}

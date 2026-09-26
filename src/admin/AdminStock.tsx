import { useState } from 'react'
import { TarjetaAdmin } from '@/admin/AdminLayout'
import { IconoMas, IconoMenos } from '@/components/Iconos'
import { ImagenProducto } from '@/components/ProductoUI'
import { precio } from '@/lib/config'
import { useTienda } from '@/store/tienda'

export function AdminStock() {
  const { productos, ajustarStock, guardarProducto } = useTienda()
  const [filtro, setFiltro] = useState<'todos' | 'agotados' | 'bajo'>('todos')

  const lista = productos
    .filter((p) => {
      if (filtro === 'agotados') return p.stock === 0
      if (filtro === 'bajo') return p.stock > 0 && p.stock <= p.stockMinimo
      return true
    })
    .sort((a, b) => a.stock - b.stock)

  const unidades = productos.reduce((s, p) => s + p.stock, 0)
  const valor = productos.reduce((s, p) => s + p.stock * p.precio, 0)
  const agotados = productos.filter((p) => p.stock === 0).length
  const bajos = productos.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo).length

  const rellenarTodos = (cantidad: number) => {
    for (const p of productos) {
      if (p.stock < p.stockMinimo) guardarProducto({ ...p, stock: cantidad })
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-verde">Stock</h1>
        <p className="mt-1.5 text-sm text-tinta-suave">
          Ajustá las unidades disponibles. Los cambios se reflejan al instante en la web.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica titulo="Unidades en stock" valor={String(unidades)} tono="verde" />
        <Metrica titulo="Valor del inventario" valor={precio(valor)} tono="dorado" />
        <Metrica titulo="Productos agotados" valor={String(agotados)} tono={agotados ? 'rojo' : 'verde'} />
        <Metrica titulo="Alertas de poco stock" valor={String(bajos)} tono={bajos ? 'dorado' : 'verde'} />
      </div>

      {bajos > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dorado/30 bg-dorado-suave/50 p-4">
          <p className="min-w-0 flex-1 text-sm text-tinta">
            <strong className="font-semibold text-verde">{bajos}</strong> producto
            {bajos === 1 ? '' : 's'} está por debajo del mínimo. Podés reponerlos rápido:
          </p>
          {[12, 20, 24].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => rellenarTodos(n)}
              className="rounded-full bg-verde px-4 py-2 text-xs font-semibold text-crema transition-colors hover:bg-verde-medio"
            >
              Dejar en {n} u.
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { id: 'todos', t: 'Todos' },
            { id: 'bajo', t: `Poco stock (${bajos})` },
            { id: 'agotados', t: `Agotados (${agotados})` },
          ] as const
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

      <TarjetaAdmin titulo="Control de existencias" subtitulo={`${lista.length} productos`}>
        {lista.length === 0 ? (
          <p className="py-8 text-center text-sm text-tinta-suave">
            No hay productos con ese filtro.
          </p>
        ) : (
          <ul className="divide-y divide-crema-oscuro">
            {lista.map((p) => {
              const critico = p.stock === 0
              const bajo = p.stock > 0 && p.stock <= p.stockMinimo
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-4 py-3.5">
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
                    <ImagenProducto producto={p} />
                  </span>

                  <div className="min-w-40 flex-1">
                    <p className="text-sm font-semibold text-verde">{p.nombre}</p>
                    <p className="text-xs text-tinta-suave">
                      Mínimo configurado: {p.stockMinimo} · {p.presentacion}
                    </p>
                  </div>

                  <span
                    className={`w-24 shrink-0 rounded-full px-3 py-1.5 text-center text-xs font-semibold ${
                      critico
                        ? 'bg-rojo text-crema'
                        : bajo
                          ? 'bg-dorado text-verde'
                          : 'bg-verde-suave text-verde'
                    }`}
                  >
                    {critico ? 'Agotado' : bajo ? 'Poco stock' : `${p.stock} disponibles`}
                  </span>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => ajustarStock(p.id, -1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-crema-profundo text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
                      aria-label={`Restar una unidad de ${p.nombre}`}
                    >
                      <IconoMenos width={15} height={15} />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={p.stock}
                      onChange={(e) =>
                        guardarProducto({ ...p, stock: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-16 rounded-lg border border-crema-profundo bg-white px-2 py-2 text-center text-sm font-semibold text-verde"
                      aria-label={`Stock de ${p.nombre}`}
                    />
                    <button
                      type="button"
                      onClick={() => ajustarStock(p.id, 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-verde text-crema transition-colors hover:bg-verde-medio"
                      aria-label={`Sumar una unidad de ${p.nombre}`}
                    >
                      <IconoMas width={15} height={15} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </TarjetaAdmin>
    </div>
  )
}

function Metrica({
  titulo,
  valor,
  tono,
}: {
  titulo: string
  valor: string
  tono: 'verde' | 'dorado' | 'rojo'
}) {
  const color = { verde: 'text-verde', dorado: 'text-dorado', rojo: 'text-rojo' }[tono]
  return (
    <div className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave">
      <p className="eyebrow text-tinta-suave">{titulo}</p>
      <p className={`mt-2 font-serif text-2xl font-bold ${color}`}>{valor}</p>
    </div>
  )
}

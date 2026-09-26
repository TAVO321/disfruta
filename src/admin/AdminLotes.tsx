import { useState } from 'react'
import { TarjetaAdmin } from '@/admin/AdminLayout'
import { IconoCalendario, IconoLote } from '@/components/Iconos'
import { fechaCorta } from '@/lib/config'
import type { Lote } from '@/types'
import { useTienda } from '@/store/tienda'

export function AdminLotes() {
  const { productos, registrarLote, guardarProducto } = useTienda()
  const [form, setForm] = useState({
    productoId: productos[0]?.id ?? '',
    codigo: '',
    fechaElaboracion: new Date().toISOString().slice(0, 10),
    fechaConsumoRecomendado: '',
    cantidad: 12,
  })
  const [registrados, setRegistrados] = useState(0)

  const hoy = new Date().toISOString().slice(0, 10)
  const todosLosLotes = productos
    .flatMap((p) => p.lotes.map((l) => ({ ...l, producto: p })))
    .sort((a, b) => b.fechaElaboracion.localeCompare(a.fechaElaboracion))

  const vencenPronto = todosLosLotes.filter(
    (l) => l.restante > 0 && diasRestantes(l.fechaConsumoRecomendado) <= 21,
  )
  const agotados = todosLosLotes.filter((l) => l.restante === 0)

  const registrar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.productoId || !form.codigo.trim() || !form.fechaConsumoRecomendado) return
    const lote: Lote = {
      id: `l-${Date.now()}`,
      codigo: form.codigo.trim(),
      fechaElaboracion: form.fechaElaboracion,
      fechaConsumoRecomendado: form.fechaConsumoRecomendado,
      cantidad: form.cantidad,
      restante: form.cantidad,
    }
    registrarLote(form.productoId, lote)
    setRegistrados((n) => n + form.cantidad)
    setForm({ ...form, codigo: '', cantidad: 12 })
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-verde">Lotes de producción</h1>
        <p className="mt-1.5 text-sm text-tinta-suave">
          Cada lote se muestra en la ficha del producto con su fecha de elaboración y la fecha
          recomendada de consumo.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metrica titulo="Lotes registrados" valor={String(todosLosLotes.length)} />
        <Metrica
          titulo="Vencen en menos de 21 días"
          valor={String(vencenPronto.length)}
          alerta={vencenPronto.length > 0}
        />
        <Metrica titulo="Lotes agotados" valor={String(agotados.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <TarjetaAdmin titulo="Registrar lote nuevo">
          <form onSubmit={registrar} className="space-y-3.5">
            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Producto</span>
              <select
                value={form.productoId}
                onChange={(e) => setForm({ ...form, productoId: e.target.value })}
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Código de lote</span>
              <input
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                placeholder="CM-2609-C"
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Fecha de elaboración</span>
              <input
                type="date"
                max={hoy}
                value={form.fechaElaboracion}
                onChange={(e) => setForm({ ...form, fechaElaboracion: e.target.value })}
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">
                Fecha recomendada de consumo
              </span>
              <input
                type="date"
                value={form.fechaConsumoRecomendado}
                onChange={(e) => setForm({ ...form, fechaConsumoRecomendado: e.target.value })}
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Unidades del lote</span>
              <input
                type="number"
                min={1}
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <button
              type="submit"
              disabled={!form.productoId || !form.codigo.trim() || !form.fechaConsumoRecomendado}
              className="w-full rounded-full bg-verde py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-40"
            >
              Registrar lote y sumar al stock
            </button>
            <p className="text-center text-xs text-tinta-suave">
              Las unidades del lote se suman automáticamente al stock del producto.
            </p>
          </form>
        </TarjetaAdmin>

        <TarjetaAdmin
          titulo="Historial de lotes"
          subtitulo={`${todosLosLotes.length} lotes · ${registrados > 0 ? `+${registrados} en esta sesión` : 'sin ingresos hoy'}`}
        >
          {todosLosLotes.length === 0 ? (
            <p className="py-8 text-center text-sm text-tinta-suave">
              Todavía no hay lotes registrados.
            </p>
          ) : (
            <ul className="divide-y divide-crema-oscuro">
              {todosLosLotes.map((l) => {
                const dias = diasRestantes(l.fechaConsumoRecomendado)
                return (
                  <li key={l.id} className="flex flex-wrap items-center gap-4 py-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-verde-suave text-verde">
                      <IconoLote width={18} height={18} />
                    </span>

                    <div className="min-w-40 flex-1">
                      <p className="text-sm font-semibold text-verde">
                        {l.producto.nombre}
                      </p>
                      <p className="mt-0.5 text-xs text-tinta-suave">
                        Lote <strong className="text-verde">{l.codigo}</strong> · elaborado{' '}
                        {fechaCorta(l.fechaElaboracion)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-tinta-suave">
                      <IconoCalendario width={14} height={14} />
                      Consume antes del {fechaCorta(l.fechaConsumoRecomendado)}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        l.restante === 0
                          ? 'bg-crema-profundo text-tinta-suave'
                          : dias <= 21
                            ? 'bg-dorado text-verde'
                            : 'bg-verde text-crema'
                      }`}
                    >
                      {l.restante} / {l.cantidad}
                      {l.restante > 0 && dias <= 21 && ' · vence pronto'}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        guardarProducto({
                          ...l.producto,
                          lotes: l.producto.lotes.filter((x) => x.id !== l.id),
                        })
                      }
                      className="shrink-0 text-xs text-tinta-suave transition-colors hover:text-rojo"
                    >
                      Quitar
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </TarjetaAdmin>
      </div>
    </div>
  )
}

function Metrica({
  titulo,
  valor,
  alerta,
}: {
  titulo: string
  valor: string
  alerta?: boolean
}) {
  return (
    <div className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave">
      <p className="eyebrow text-tinta-suave">{titulo}</p>
      <p
        className={`mt-2 font-serif text-2xl font-bold ${alerta ? 'text-rojo' : 'text-verde'}`}
      >
        {valor}
      </p>
    </div>
  )
}

function diasRestantes(iso: string) {
  const objetivo = new Date(`${iso}T12:00:00`).getTime()
  const hoy = new Date().setHours(12, 0, 0, 0)
  return Math.round((objetivo - hoy) / 86_400_000)
}

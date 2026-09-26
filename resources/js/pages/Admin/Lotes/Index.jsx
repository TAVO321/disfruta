import { useState } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { fecha } from '@/lib/config'

const VACIO = {
  producto_id: '',
  codigo: '',
  fecha_elaboracion: '',
  fecha_consumo_recomendado: '',
  cantidad: '',
  restante: '',
}

export default function LotesIndex({ lotes, productos, filtros }) {
  const { data, setData, post, processing, errors, reset } = useForm({ ...VACIO })
  const [editando, setEditando] = useState(null)

  const ir = (params) =>
    router.get('/admin/lotes', { ...params }, { preserveScroll: true, preserveState: true, replace: true })

  const abrirNuevo = () => {
    reset()
    setEditando(null)
  }

  const editar = (lote) => {
    setEditando(lote.id)
    setData({
      producto_id: String(lote.producto.id),
      codigo: lote.codigo,
      fecha_elaboracion: lote.fechaElaboracion,
      fecha_consumo_recomendado: lote.fechaConsumoRecomendado,
      cantidad: String(lote.cantidad),
      restante: String(lote.restante),
    })
  }

  const enviar = (e) => {
    e.preventDefault()
    // Inertia manda POST y la ruta update es PUT: va spoofeada en el body.
    if (editando) {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''))
      fd.set('_method', 'PUT')
      post(`/admin/lotes/${editando}`, fd, { onSuccess: abrirNuevo })
      return
    }
    post('/admin/lotes', { ...data, onSuccess: abrirNuevo })
  }

  const eliminar = (lote) => {
    if (!confirm(`¿Eliminar el lote ${lote.codigo}? El stock del producto se recalcula.`)) return
    router.delete(`/admin/lotes/${lote.id}`, { preserveScroll: true })
  }

  const items = lotes.data ?? []
  const meta = lotes.meta ?? {}

  return (
    <>
      <Head title="Lotes" />

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Lotes</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          El stock vendible se recalcula solo: cada cambio re-suma el{' '}
          <span className="font-semibold">restante</span> de los lotes del producto.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <TarjetaAdmin
          titulo={editando ? `Editar lote` : 'Registrar lote'}
          subtitulo={editando ? 'No se puede cambiar el producto' : 'Sumá stock nuevo al catálogo'}
          accion={
            editando ? (
              <button
                type="button"
                onClick={abrirNuevo}
                className="text-xs font-semibold text-tinta-suave hover:text-verde"
              >
                Cancelar
              </button>
            ) : null
          }
        >
          <form onSubmit={enviar} className="space-y-3.5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Producto
              </span>
              <select
                value={data.producto_id}
                onChange={(e) => setData('producto_id', e.target.value)}
                disabled={Boolean(editando)}
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm disabled:opacity-60"
              >
                <option value="">Elegí un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
              {errors.producto_id && <p className="mt-1 text-xs text-rojo">{errors.producto_id}</p>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Código
              </span>
              <input
                value={data.codigo}
                onChange={(e) => setData('codigo', e.target.value)}
                placeholder="LOTE-2026-01"
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm"
              />
              {errors.codigo && <p className="mt-1 text-xs text-rojo">{errors.codigo}</p>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                  Elaboración
                </span>
                <input
                  type="date"
                  value={data.fecha_elaboracion}
                  onChange={(e) => setData('fecha_elaboracion', e.target.value)}
                  className="w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2.5 text-sm"
                />
                {errors.fecha_elaboracion && (
                  <p className="mt-1 text-xs text-rojo">{errors.fecha_elaboracion}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                  Consumir antes
                </span>
                <input
                  type="date"
                  value={data.fecha_consumo_recomendado}
                  onChange={(e) => setData('fecha_consumo_recomendado', e.target.value)}
                  className="w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2.5 text-sm"
                />
                {errors.fecha_consumo_recomendado && (
                  <p className="mt-1 text-xs text-rojo">{errors.fecha_consumo_recomendado}</p>
                )}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                  Cantidad
                </span>
                <input
                  type="number"
                  min="1"
                  value={data.cantidad}
                  onChange={(e) => setData('cantidad', e.target.value)}
                  disabled={Boolean(editando)}
                  className="w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2.5 text-sm disabled:opacity-60"
                />
                {errors.cantidad && <p className="mt-1 text-xs text-rojo">{errors.cantidad}</p>}
              </label>

              {editando && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                    Restante
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={data.restante}
                    onChange={(e) => setData('restante', e.target.value)}
                    className="w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2.5 text-sm"
                  />
                  {errors.restante && <p className="mt-1 text-xs text-rojo">{errors.restante}</p>}
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-full bg-verde py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-50"
            >
              {processing ? 'Guardando...' : editando ? 'Guardar cambios' : 'Registrar lote'}
            </button>
          </form>
        </TarjetaAdmin>

        <TarjetaAdmin
          titulo="Lotes registrados"
          subtitulo={`${meta.total ?? items.length} en total · ordenados por consumo`}
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <select
              value={filtros.producto ?? ''}
              onChange={(e) => ir({ producto: e.target.value || undefined, agotados: filtros.agotados })}
              className="rounded-full border border-crema-profundo bg-crema px-4 py-2.5 text-sm"
            >
              <option value="">Todos los productos</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>

            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-crema-profundo bg-white px-4 py-2 text-xs font-semibold text-tinta">
              <input
                type="checkbox"
                checked={Boolean(filtros.agotados)}
                onChange={(e) =>
                  ir({ producto: filtros.producto || undefined, agotados: e.target.checked || undefined })
                }
                className="h-3.5 w-3.5 accent-verde"
              />
              Solo agotados
            </label>
          </div>

          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-tinta-suave">
              No hay lotes con ese filtro.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-sm">
                <thead>
                  <tr className="border-b border-crema-oscuro text-left text-[0.7rem] tracking-wide text-tinta-suave uppercase">
                    <th className="pb-2.5 font-semibold">Lote</th>
                    <th className="pb-2.5 font-semibold">Producto</th>
                    <th className="pb-2.5 font-semibold">Consumo</th>
                    <th className="pb-2.5 text-right font-semibold">Restante</th>
                    <th className="pb-2.5 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((l) => (
                    <tr key={l.id} className="border-b border-crema-oscuro last:border-0">
                      <td className="py-3">
                        <span className="block font-mono text-xs font-semibold text-verde">
                          {l.codigo}
                        </span>
                        <span className="block text-[0.7rem] text-tinta-suave">
                          Eligible {fecha(l.fechaElaboracion)}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/catalogo/${l.producto.slug}`}
                          className="text-tinta underline-offset-4 hover:text-verde hover:underline"
                        >
                          {l.producto.nombre}
                        </Link>
                      </td>
                      <td className="py-3 text-tinta-suave">{fecha(l.fechaConsumoRecomendado)}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`font-semibold ${l.restante > 0 ? 'text-verde' : 'text-rojo'}`}
                        >
                          {l.restante}
                        </span>
                        <span className="text-xs text-tinta-suave"> / {l.cantidad}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => editar(l)}
                            className="rounded-lg bg-verde px-2.5 py-1.5 text-xs font-semibold text-crema hover:bg-verde-medio"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => eliminar(l)}
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
      </div>
    </>
  )
}

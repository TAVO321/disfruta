import { Head, Link, useForm } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { precio } from '@/lib/config'

const VACIA = {
  titulo: '',
  descripcion: '',
  tipo: '',
  descuento: 15,
  activa: true,
  vigente_desde: new Date().toISOString().slice(0, 10),
  vigente_hasta: '',
  productos: [],
}

export default function PromocionesForm({ promocion, tipos, productos }) {
  const editando = Boolean(promocion)
  const { data, setData, post, processing, errors } = useForm(
    // Sin edicion arranca con el primer tipo disponible, que hoy viene de la
    // base y no de una lista escrita en el componente.
    editando ? { ...promocion } : { ...VACIA, tipo: tipos[0]?.id ?? '' },
  )

  const alternarProducto = (id) =>
    setData(
      'productos',
      data.productos.includes(id)
        ? data.productos.filter((x) => x !== id)
        : [...data.productos, id],
    )

  const guardar = (e) => {
    e.preventDefault()
    // useForm manda dataRef.current como payload: un FormData armado aparte se
    // pierde, y con el se perdia tambien el spoof de _method al editar.
    if (editando) {
      setData({ ...data, _method: 'PUT' })
      post(`/admin/promociones/${data.id}`)
      return
    }

    post('/admin/promociones')
  }

  const seleccionados = productos.filter((p) => data.productos.includes(p.id))

  return (
    <>
      <Head title={editando ? `Editar ${data.titulo}` : 'Nueva promoción'} />

      <header className="mb-6">
        <Link
          href="/admin/promociones"
          className="text-xs font-semibold text-tinta-suave underline-offset-4 hover:text-verde hover:underline"
        >
          ← Volver a promociones
        </Link>
        <h1 className="mt-1.5 font-serif text-2xl font-bold text-verde sm:text-3xl">
          {editando ? `Editar: ${data.titulo}` : 'Nueva promoción'}
        </h1>
      </header>

      <form onSubmit={guardar} className="grid gap-6 lg:grid-cols-2">
        <TarjetaAdmin titulo="Datos de la promoción">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Título
              </span>
              <input
                value={data.titulo}
                onChange={(e) => setData('titulo', e.target.value)}
                required
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm"
              />
              {errors.titulo && <p className="mt-1 text-xs text-rojo">{errors.titulo}</p>}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Descripción
              </span>
              <textarea
                value={data.descripcion}
                onChange={(e) => setData('descripcion', e.target.value)}
                rows={3}
                required
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm"
              />
              {errors.descripcion && <p className="mt-1 text-xs text-rojo">{errors.descripcion}</p>}
            </label>

            <div>
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Tipo
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {tipos.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setData('tipo', t.id)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      data.tipo === t.id
                        ? 'border-verde bg-verde text-crema'
                        : 'border-crema-profundo bg-white text-tinta hover:border-verde'
                    }`}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
              {errors.tipo && <p className="mt-1 text-xs text-rojo">{errors.tipo}</p>}
              <p className="mt-1.5 text-[0.7rem] text-tinta-suave">
                {tipos.find((t) => t.id === data.tipo)?.descripcion}
              </p>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Descuento (%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                value={data.descuento}
                onChange={(e) => setData('descuento', e.target.value)}
                required
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm"
              />
              {errors.descuento && <p className="mt-1 text-xs text-rojo">{errors.descuento}</p>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                  Vigente desde
                </span>
                <input
                  type="date"
                  value={data.vigente_desde}
                  onChange={(e) => setData('vigente_desde', e.target.value)}
                  className="w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2.5 text-sm"
                />
                {errors.vigente_desde && (
                  <p className="mt-1 text-xs text-rojo">{errors.vigente_desde}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                  Vigente hasta
                </span>
                <input
                  type="date"
                  value={data.vigente_hasta ?? ''}
                  onChange={(e) => setData('vigente_hasta', e.target.value)}
                  className="w-full rounded-lg border border-crema-profundo bg-crema px-3 py-2.5 text-sm"
                />
                {errors.vigente_hasta && (
                  <p className="mt-1 text-xs text-rojo">{errors.vigente_hasta}</p>
                )}
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-crema px-3.5 py-3">
              <input
                type="checkbox"
                checked={data.activa}
                onChange={(e) => setData('activa', e.target.checked)}
                className="h-4 w-4 accent-verde"
              />
              <span className="text-sm font-medium text-tinta">
                Activar ahora
                <span className="block text-xs font-normal text-tinta-suave">
                  Si está apagada, no se muestra en la web aunque las fechas coincidan.
                </span>
              </span>
            </label>
          </div>
        </TarjetaAdmin>

        <TarjetaAdmin
          titulo="Productos en la promoción"
          subtitulo={`${seleccionados.length} seleccionados`}
        >
          <div className="max-h-[22rem] overflow-y-auto pr-1">
            {productos.map((p) => {
              const marcado = data.productos.includes(p.id)
              const descuento = Number(data.descuento) || 0
              const final = Math.max(0, Number(p.precio) * (1 - descuento / 100))
              return (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-b border-crema-oscuro px-2 py-2.5 last:border-0 ${
                    marcado ? 'bg-verde-suave' : 'hover:bg-crema'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => alternarProducto(p.id)}
                    className="h-4 w-4 shrink-0 accent-verde"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-tinta">{p.nombre}</span>
                    <span className="block text-xs text-tinta-suave">
                      {precio(p.precio)}
                      {marcado && (
                        <span className="ml-1.5 font-semibold text-verde">
                          → {precio(final)}
                        </span>
                      )}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
          {errors.productos && <p className="mt-1.5 text-xs text-rojo">{errors.productos}</p>}

          <div className="mt-5 flex gap-2 border-t border-crema-oscuro pt-5">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 rounded-full bg-verde py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-50"
            >
              {processing
                ? 'Guardando...'
                : editando
                  ? 'Guardar cambios'
                  : 'Crear promoción'}
            </button>
            <Link
              href="/admin/promociones"
              className="rounded-full border border-crema-profundo px-5 py-3 text-sm font-semibold text-tinta-suave hover:border-rojo hover:text-rojo"
            >
              Cancelar
            </Link>
          </div>
        </TarjetaAdmin>
      </form>
    </>
  )
}

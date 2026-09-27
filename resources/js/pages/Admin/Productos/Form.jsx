import { useEffect, useState } from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { ImagenProducto } from '@/components/ProductoUI'

const CAMPOS_VACIOS = {
  nombre: '',
  categoria_id: '',
  descripcion_corta: '',
  descripcion: '',
  precio: '',
  precio_antes: '',
  presentacion: '',
  nivel_picante: 'suave',
  stock: 0,
  stock_minimo: 0,
  peso: 0,
  ingredientes: [],
  platos_recomendados: [],
  recomendacion_consumo: '',
  conservacion: '',
  insignia: '',
  limitado: false,
  temporada: false,
  combo: false,
  destacado: false,
  activo: true,
}

export default function ProductosForm({ producto, categorias }) {
  const { niveles, platos } = usePage().props
  const editando = Boolean(producto)
  const [vistasPrevias, setVistasPrevias] = useState([])

  const { data, setData, post, patch, processing, errors } = useForm({
    ...CAMPOS_VACIOS,
    ...(producto
      ? {
          nombre: producto.nombre,
          categoria_id: producto.categoria?.id ?? '',
          descripcion_corta: producto.descripcionCorta ?? '',
          descripcion: producto.descripcion ?? '',
          precio: producto.precio,
          precio_antes: producto.precioAntes ?? '',
          presentacion: producto.presentacion ?? '',
          nivel_picante: producto.nivelPicante,
          stock: producto.stock,
          stock_minimo: producto.stockMinimo,
          peso: producto.peso,
          ingredientes: producto.ingredientes ?? [],
          platos_recomendados: producto.platosRecomendados ?? [],
          recomendacion_consumo: producto.recomendacionConsumo ?? '',
          conservacion: producto.conservacion ?? '',
          insignia: producto.insignia ?? '',
          limitado: producto.limitado,
          temporada: producto.temporada,
          combo: producto.combo,
          destacado: producto.destacado,
          activo: producto.activo,
        }
      : {}),
    imagenes: [],
    imagenes_eliminadas: [],
  })

  const [nuevoIngrediente, setNuevoIngrediente] = useState('')

  useEffect(() => {
    const archivos = data.imagenes ?? []
    const urls = archivos.map((f) => URL.createObjectURL(f))
    setVistasPrevias(urls)

    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [data.imagenes])

  const toggle = (campo, valor) =>
    setData(
      campo,
      data[campo].includes(valor)
        ? data[campo].filter((x) => x !== valor)
        : [...data[campo], valor],
    )

  const guardar = (e) => {
    e.preventDefault()

    // Los archivos van dentro de data y es Inertia quien arma el cuerpo
    // multipart. Armar el FormData a mano y pasarlo a post/patch lo mandaba
    // como JSON: la ruta update respondia 405 y los archivos se perdian en el
    // camino, por mas que el formulario los mostrara.
    if (editando) patch(`/admin/productos/${producto.id}`)
    else post('/admin/productos')
  }

  return (
    <>
      <Head title={editando ? `Editar ${producto.nombre}` : 'Nuevo producto'} />

      <header className="mb-6">
        <Link
          href="/admin/productos"
          className="text-xs font-semibold text-tinta-suave underline-offset-4 hover:text-verde hover:underline"
        >
          ← Volver a productos
        </Link>
        <h1 className="mt-1.5 font-serif text-2xl font-bold text-verde sm:text-3xl">
          {editando ? `Editar: ${producto.nombre}` : 'Nuevo producto'}
        </h1>
        {editando && (
          <p className="mt-1 text-sm text-tinta-suave">
            El stock se ajusta solo con cada pedido. Para corregir inventario usá la sección Lotes.
          </p>
        )}
      </header>

      <form onSubmit={guardar} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <TarjetaAdmin titulo="Datos básicos">
            <div className="space-y-4">
              <Campo label="Nombre" error={errors.nombre}>
                <input
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  required
                  className={inputCls}
                />
              </Campo>

              <div className="grid gap-4 sm:grid-cols-2">
                <Campo
                  label="Categoría"
                  error={errors.categoria_id}
                  hint="El frasco toma el color de la familia. Para cambiarlo, editá la familia en /admin/categorias."
                >
                  <select
                    value={data.categoria_id}
                    onChange={(e) => setData('categoria_id', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Elegí una categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Presentación" error={errors.presentacion}>
                  <input
                    value={data.presentacion}
                    onChange={(e) => setData('presentacion', e.target.value)}
                    placeholder="Frasco 350 g"
                    required
                    className={inputCls}
                  />
                </Campo>
              </div>

              <Campo label="Descripción corta" error={errors.descripcion_corta} hint="Va en la tarjeta del catálogo">
                <input
                  value={data.descripcion_corta}
                  onChange={(e) => setData('descripcion_corta', e.target.value)}
                  maxLength={300}
                  required
                  className={inputCls}
                />
              </Campo>

              <Campo label="Descripción completa" error={errors.descripcion}>
                <textarea
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  rows={4}
                  required
                  className={inputCls}
                />
              </Campo>
            </div>
          </TarjetaAdmin>

          <TarjetaAdmin titulo="Precio y stock">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Campo label="Precio (Bs)" error={errors.precio}>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={data.precio}
                  onChange={(e) => setData('precio', e.target.value)}
                  required
                  className={inputCls}
                />
              </Campo>
              <Campo label="Precio tachado" error={errors.precio_antes} hint="Opcional">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={data.precio_antes}
                  onChange={(e) => setData('precio_antes', e.target.value)}
                  className={inputCls}
                />
              </Campo>
              <Campo label="Stock" error={errors.stock} hint="Se descuenta al vender">
                <input
                  type="number"
                  min="0"
                  value={data.stock}
                  onChange={(e) => setData('stock', e.target.value)}
                  required
                  className={inputCls}
                />
              </Campo>
              <Campo label="Stock mínimo" error={errors.stock_minimo} hint="Aviso de stock bajo">
                <input
                  type="number"
                  min="0"
                  value={data.stock_minimo}
                  onChange={(e) => setData('stock_minimo', e.target.value)}
                  required
                  className={inputCls}
                />
              </Campo>
            </div>
          </TarjetaAdmin>

          <TarjetaAdmin titulo="Ficha técnica">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo label="Nivel de picante" error={errors.nivel_picante}>
                  <select
                    value={data.nivel_picante}
                    onChange={(e) => setData('nivel_picante', e.target.value)}
                    className={inputCls}
                  >
                    {niveles.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nombre}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo label="Peso neto (g)" error={errors.peso}>
                  <input
                    type="number"
                    min="0"
                    value={data.peso}
                    onChange={(e) => setData('peso', e.target.value)}
                    className={inputCls}
                  />
                </Campo>
              </div>

              <Campo label="Insignia" error={errors.insignia} hint="Texto corto opcional, ej. 'Nuevo'">
                <input
                  value={data.insignia}
                  onChange={(e) => setData('insignia', e.target.value)}
                  className={inputCls}
                />
              </Campo>

              <Campo label="Ingredientes" error={errors.ingredientes}>
                <ul className="mb-2 flex flex-wrap gap-1.5">
                  {data.ingredientes.map((i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => toggle('ingredientes', i)}
                        className="rounded-full border border-crema-profundo bg-crema px-2.5 py-1 text-xs text-tinta hover:border-rojo hover:text-rojo"
                      >
                        {i} ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    value={nuevoIngrediente}
                    onChange={(e) => setNuevoIngrediente(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const v = nuevoIngrediente.trim()
                        if (v && !data.ingredientes.includes(v)) {
                          toggle('ingredientes', v)
                          setNuevoIngrediente('')
                        }
                      }
                    }}
                    placeholder="Agregar ingrediente y press Enter"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = nuevoIngrediente.trim()
                      if (v && !data.ingredientes.includes(v)) {
                        toggle('ingredientes', v)
                        setNuevoIngrediente('')
                      }
                    }}
                    className="shrink-0 rounded-lg border border-crema-profundo px-3.5 text-sm font-semibold text-tinta-suave hover:border-verde hover:text-verde"
                  >
                    Agregar
                  </button>
                </div>
              </Campo>

              <Campo label="Platos recomendados" error={errors.platos_recomendados}>
                <div className="flex flex-wrap gap-1.5">
                  {platos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle('platos_recomendados', p.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        data.platos_recomendados.includes(p.id)
                          ? 'border-verde bg-verde text-crema'
                          : 'border-crema-profundo bg-white text-tinta hover:border-verde'
                      }`}
                    >
                      {p.emoji} {p.nombre}
                    </button>
                  ))}
                </div>
              </Campo>

              <Campo label="Cómo lo consumimos" error={errors.recomendacion_consumo}>
                <textarea
                  value={data.recomendacion_consumo}
                  onChange={(e) => setData('recomendacion_consumo', e.target.value)}
                  rows={2}
                  className={inputCls}
                />
              </Campo>

              <Campo label="Conservación" error={errors.conservacion}>
                <textarea
                  value={data.conservacion}
                  onChange={(e) => setData('conservacion', e.target.value)}
                  rows={2}
                  className={inputCls}
                />
              </Campo>
            </div>
          </TarjetaAdmin>
        </div>

        <div className="space-y-6">
          <TarjetaAdmin titulo="Visibilidad">
            <div className="space-y-2.5">
              {[
                ['activo', 'Activo', 'Visible en el catálogo'],
                ['destacado', 'Destacado', 'Aparece en la home'],
                ['limitado', 'Edición limitada', 'Muestra la etiqueta roja'],
                ['temporada', 'Temporada', 'Muestra la etiqueta dorada'],
                ['combo', 'Es combo', 'Se ofrece como pack'],
              ].map(([campo, titulo, ayuda]) => (
                <label
                  key={campo}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-crema"
                >
                  <input
                    type="checkbox"
                    checked={data[campo]}
                    onChange={(e) => setData(campo, e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-verde"
                  />
                  <span>
                    <span className="block text-sm font-medium text-tinta">{titulo}</span>
                    <span className="block text-xs text-tinta-suave">{ayuda}</span>
                  </span>
                </label>
              ))}
            </div>
          </TarjetaAdmin>

          <TarjetaAdmin titulo="Fotos" subtitulo="Hasta 6 · JPG, PNG o WebP · máx 3 MB">
            {editando && (producto.imagenesAdmin ?? []).length > 0 && (
              <ul className="mb-4 grid grid-cols-3 gap-2">
                {producto.imagenesAdmin.map((img) => {
                  const eliminada = data.imagenes_eliminadas.includes(img.id)
                  return (
                    <li key={img.id} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={`aspect-square w-full rounded-lg object-cover ${eliminada ? 'opacity-30' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setData(
                            'imagenes_eliminadas',
                            eliminada
                              ? data.imagenes_eliminadas.filter((x) => x !== img.id)
                              : [...data.imagenes_eliminadas, img.id],
                          )
                        }
                        className={`absolute inset-x-1 bottom-1 rounded px-1.5 py-0.5 text-[0.65rem] font-semibold ${
                          eliminada ? 'bg-verde text-crema' : 'bg-white/90 text-rojo'
                        }`}
                      >
                        {eliminada ? 'Deshacer' : 'Eliminar'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {editando && producto && (
              <div className="mb-4 flex items-center gap-3 rounded-lg bg-crema p-2.5">
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
                  <ImagenProducto producto={producto} />
                </span>
                <span className="text-xs text-tinta-suave">
                  Vista previa con la ilustración fallback cuando no hay fotos.
                </span>
              </div>
            )}

            <input
              type="file"
              name="imagenes[]"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => setData('imagenes', Array.from(e.target.files ?? []))}
              className="block w-full text-xs text-tinta-suave file:mr-3 file:rounded-full file:border-0 file:bg-verde file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-crema hover:file:bg-verde-medio"
            />
            {vistasPrevias.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {vistasPrevias.map((url) => (
                  <li key={url} className="h-16 w-16 overflow-hidden rounded-lg border border-crema-profundo">
                    <img
                      src={url}
                      alt="Vista previa"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
            {errors.imagenes && <p className="mt-1.5 text-xs text-rojo">{errors.imagenes}</p>}
          </TarjetaAdmin>

          <div className="sticky bottom-4 flex gap-2 rounded-2xl border border-crema-profundo bg-white p-3 shadow-media">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 rounded-full bg-verde py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-50"
            >
              {processing ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <Link
              href="/admin/productos"
              className="rounded-full border border-crema-profundo px-5 py-3 text-sm font-semibold text-tinta-suave hover:border-rojo hover:text-rojo"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}

const inputCls =
  'w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm text-tinta placeholder:text-tinta-suave/60 focus:border-verde-claro'

function Campo({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[0.7rem] text-tinta-suave">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rojo">{error}</p>}
    </div>
  )
}

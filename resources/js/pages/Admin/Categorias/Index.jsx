import { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { IlustracionFrasco } from '@/components/FrascoIlustrado'
import { BotonAdmin } from '@/components/BotonAdmin'

const CAMPOS_VACIOS = {
  nombre: '',
  descripcion: '',
  tono: { fondo: '#EFE3CC', contenido: '#D9A441', acento: '#A8762B', tapa: '#1F3D2B' },
  activo: true,
}

const COLORES = [
  ['fondo', 'Fondo'],
  ['contenido', 'Contenido'],
  ['acento', 'Acento'],
  ['tapa', 'Tapa'],
]

export default function CategoriasIndex({ categorias }) {
  const { data, setData, post, put, processing, errors, reset } = useForm(CAMPOS_VACIOS)
  const [editando, setEditando] = useState(null)

  const guardar = (e) => {
    e.preventDefault()

    const opciones = {
      preserveScroll: true,
      onSuccess: () => {
        reset(CAMPOS_VACIOS)
        setEditando(null)
      },
    }

    if (editando) {
      put(`/admin/categorias/${editando}`, opciones)
    } else {
      post('/admin/categorias', opciones)
    }
  }

  const editar = (categoria) => {
    setEditando(categoria.id)
    reset({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? '',
      tono: categoria.tono,
      activo: categoria.activo,
    })
  }

  const cancelar = () => {
    setEditando(null)
    reset(CAMPOS_VACIOS)
  }

  const alternarActivo = (categoria) =>
    router.put(
      `/admin/categorias/${categoria.id}`,
      { nombre: categoria.nombre, descripcion: categoria.descripcion, tono: categoria.tono, activo: !categoria.activo },
      { preserveScroll: true },
    )

  const aplicarTono = (categoria) => {
    if (
      !confirm(
        `Se repintarán ${categoria.productos_count} producto(s) de "${categoria.nombre}" con su color actual. ¿Seguir?`,
      )
    ) {
      return
    }

    router.patch(`/admin/categorias/${categoria.id}/aplicar-tono`, {}, { preserveScroll: true })
  }

  const eliminar = (categoria) => {
    if (!confirm(`¿Eliminar la familia "${categoria.nombre}"?`)) return
    router.delete(`/admin/categorias/${categoria.id}`, { preserveScroll: true })
  }

  return (
    <>
      <Head title="Familias · Panel" />

      <TarjetaAdmin
        titulo="Familias"
        subtitulo="Cada familia define el color con el que se dibuja el frasco de sus productos."
      >
        <p className="text-sm text-tinta-suave">
          Un producto nuevo toma el color de su familia, así que no hace falta elegirlo cada vez. Para cambiar el
          color de los productos que ya existen usá el botón <strong>Aplicar a todos</strong> de la familia.
        </p>
      </TarjetaAdmin>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <TarjetaAdmin titulo="Familias del catálogo">
          <ul className="divide-y divide-crema-profundo">
            {categorias.map((categoria) => (
              <li key={categoria.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="h-20 w-20 shrink-0">
                  <IlustracionFrasco tono={categoria.tono} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-tinta">
                    {categoria.nombre}{' '}
                    {!categoria.activo && <span className="text-xs text-tinta-suave">(inactiva)</span>}
                  </p>
                  <p className="text-xs text-tinta-suave">
                    /{categoria.slug} · {categoria.productos_count} producto(s)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <BotonAdmin variante="contorno" onClick={() => editar(categoria)}>
                    Editar
                  </BotonAdmin>
                  <BotonAdmin
                    variante="contorno"
                   
                    onClick={() => alternarActivo(categoria)}
                  >
                    {categoria.activo ? 'Desactivar' : 'Activar'}
                  </BotonAdmin>
                  <button
                    type="button"
                    onClick={() => aplicarTono(categoria)}
                    disabled={categoria.productos_count === 0}
                    className="rounded-full border border-dorado bg-dorado-suave px-3 py-1.5 text-xs font-medium text-verde transition-colors hover:bg-dorado disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Aplicar a todos
                  </button>
                  <BotonAdmin variante="peligro" onClick={() => eliminar(categoria)}>
                    Eliminar
                  </BotonAdmin>
                </div>
              </li>
            ))}
          </ul>
        </TarjetaAdmin>

        <TarjetaAdmin titulo={editando ? 'Editar familia' : 'Nueva familia'}>
          <form onSubmit={guardar} className="space-y-4">
            <Campo label="Nombre" error={errors.nombre}>
              <input
                value={data.nombre}
                onChange={(e) => setData('nombre', e.target.value)}
                className={inputCls}
                placeholder="Encurtidos"
              />
            </Campo>

            <Campo label="Descripción" error={errors.descripcion} hint="Opcional">
              <textarea
                value={data.descripcion}
                onChange={(e) => setData('descripcion', e.target.value)}
                rows={2}
                className={inputCls}
              />
            </Campo>

            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-wide text-tinta-suave uppercase">
                Color del frasco
              </p>

              <div className="flex justify-center rounded-xl bg-crema p-3">
                <div className="h-40 w-40">
                  <IlustracionFrasco tono={data.tono} />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {COLORES.map(([clave, etiqueta]) => (
                  <label key={clave} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.tono[clave]}
                      onChange={(e) => setData('tono', { ...data.tono, [clave]: e.target.value })}
                      className="h-8 w-8 cursor-pointer rounded border border-crema-profundo bg-white"
                    />
                    <span className="text-xs text-tinta-suave">{etiqueta}</span>
                  </label>
                ))}
              </div>
              {(errors.tono?.fondo || errors.tono?.contenido) && (
                <p className="mt-1 text-xs text-rojo">Revisá los colores.</p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-tinta">
              <input
                type="checkbox"
                checked={data.activo}
                onChange={(e) => setData('activo', e.target.checked)}
                className="h-4 w-4 accent-verde"
              />
              Visible en la tienda
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={processing}
                className="flex-1 rounded-full bg-verde py-2.5 text-sm font-semibold text-crema transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {editando ? 'Guardar cambios' : 'Crear familia'}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={cancelar}
                  className="rounded-full border border-crema-profundo px-4 py-2.5 text-sm font-medium text-tinta"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </TarjetaAdmin>
      </div>
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

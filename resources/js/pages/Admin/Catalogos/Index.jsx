import { useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { claseTono } from '@/lib/config'
import { BotonAdmin } from '@/components/BotonAdmin'

/**
 * Los cuatro catalogos comparten la misma forma, asi que se dibujan con el
 * mismo bloque y solo cambia que campos tiene cada fila. Los campos vienen del
 * backend en CATALOGOS: agregar un campo a un catalogo es tocar el controller,
 * no esta pagina.
 */
const CAMPOS = {
  platos: [
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'emoji', etiqueta: 'Emoji', ancho: 'w-20' },
  ],
  niveles: [
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'chilis', etiqueta: 'Chilis', tipo: 'number', ancho: 'w-24' },
    { clave: 'descripcion', etiqueta: 'Descripción' },
  ],
  estados: [
    { clave: 'nombre', etiqueta: 'Nombre' },
    {
      clave: 'tono',
      etiqueta: 'Tono',
      tipo: 'select',
      opciones: [
        ['dorado', 'Dorado'],
        ['dorado-claro', 'Dorado claro'],
        ['dorado-suave', 'Dorado suave'],
        ['verde', 'Verde'],
        ['verde-medio', 'Verde medio'],
        ['verde-claro', 'Verde claro'],
        ['verde-suave', 'Verde suave'],
        ['crema', 'Crema'],
        ['rojo', 'Rojo'],
        ['rojo-suave', 'Rojo suave'],
      ],
    },
  ],
  tipos: [
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'descripcion', etiqueta: 'Descripción' },
  ],
}

export default function CatalogosIndex({
  catalogos,
  productosPorPlato,
  productosPorNivel,
  pedidosPorEstado,
  promocionesPorTipo,
}) {
  const [activo, setActivo] = useState(catalogos[0]?.clave)

  return (
    <>
      <Head title="Catálogos · Panel" />

      <TarjetaAdmin
        titulo="Catálogos"
        subtitulo="Listas que usa toda la tienda: platos, niveles de picante, estados de pedido y tipos de promoción."
      >
        <p className="text-sm text-tinta-suave">
          Cada lista se edita acá. No hace falta tocar código ni esperar un deploy para agregar un plato o cambiar un
          nombre. Si un valor ya está en uso, al eliminarlo se desactiva en vez de borrarse.
        </p>
      </TarjetaAdmin>

      <div className="mt-6 flex flex-wrap gap-2">
        {catalogos.map((catalogo) => (
          <button
            key={catalogo.clave}
            type="button"
            onClick={() => setActivo(catalogo.clave)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activo === catalogo.clave
                ? 'bg-verde text-crema'
                : 'border border-crema-profundo bg-white text-tinta hover:border-verde'
            }`}
          >
            {catalogo.etiqueta}
            <span className="ml-1.5 opacity-70">{catalogo.filas.length}</span>
          </button>
        ))}
      </div>

      {catalogos
        .filter((catalogo) => catalogo.clave === activo)
        .map((catalogo) => (
          <Catalogo
            key={catalogo.clave}
            catalogo={catalogo}
            usos={usosDe(catalogo.clave, {
              productosPorPlato,
              productosPorNivel,
              pedidosPorEstado,
              promocionesPorTipo,
            })}
          />
        ))}
    </>
  )
}

function usosDe(clave, mapas) {
  return {
    platos: mapas.productosPorPlato,
    niveles: mapas.productosPorNivel,
    estados: mapas.pedidosPorEstado,
    tipos: mapas.promocionesPorTipo,
  }[clave] ?? {}
}

/** Los cuatro catalogos arrancan vacios; se usa para limpiar tras guardar. */
const CAMPOS_VACIOS = { nombre: '', emoji: '', chilis: 0, descripcion: '', tono: 'dorado' }

function Catalogo({ catalogo, usos }) {
  const { data, setData, post, put, processing, errors, clearErrors, reset } = useForm(CAMPOS_VACIOS)
  const [editando, setEditando] = useState(null)

  const campos = CAMPOS[catalogo.clave] ?? []

  const guardar = (e) => {
    e.preventDefault()

    // useForm manda dataRef.current como payload y usa el segundo argumento
    // solo para opciones de la visita: post(url, cuerpo, opciones) descarta
    // las opciones en silencio y onSuccess nunca llega a correr.
    setData(Object.fromEntries(campos.map((c) => [c.clave, data[c.clave]])))

    // Los errores de una fila repetida se limpian en cada intento: si no,
    // el mensaje queda pegado y hace pensar que el guardado no sirvio.
    clearErrors()

    const opciones = {
      preserveScroll: true,
      onSuccess: () => {
        reset()
        setEditando(null)
      },
    }

    if (editando) {
      put(`/admin/catalogos/${catalogo.clave}/${editando}`, opciones)
    } else {
      post(`/admin/catalogos/${catalogo.clave}`, opciones)
    }
  }

  const editar = (fila) => {
    setEditando(fila.id)
    reset(
      Object.fromEntries(
        campos.map((c) => [c.clave, fila[c.clave] ?? (c.clave === 'tono' ? 'dorado' : c.clave === 'chilis' ? 0 : '')]),
      ),
    )
  }

  const alternarActivo = (fila) => {
    router.put(
      `/admin/catalogos/${catalogo.clave}/${fila.id}`,
      { ...Object.fromEntries(campos.map((c) => [c.clave, fila[c.clave]])), activo: !fila.activo },
      { preserveScroll: true },
    )
  }

  const eliminar = (fila) => {
    if (!confirm(`¿Eliminar "${fila.nombre}" de ${catalogo.etiqueta}?`)) return
    router.delete(`/admin/catalogos/${catalogo.clave}/${fila.id}`, { preserveScroll: true })
  }

  return (
    <div className="mt-6">
      <TarjetaAdmin titulo={catalogo.etiqueta} subtitulo={`${catalogo.filas.length} filas`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-crema-profundo text-xs tracking-wide text-tinta-suave uppercase">
              <th className="py-2 pr-3 font-semibold">Identificador</th>
              {campos.map((c) => (
                <th key={c.clave} className="py-2 pr-3 font-semibold">
                  {c.etiqueta}
                </th>
              ))}
              <th className="py-2 pr-3 font-semibold">En uso</th>
              <th className="py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-crema-profundo">
            {catalogo.filas.map((fila) => (
              <tr key={fila.id} className={fila.activo ? '' : 'opacity-50'}>
                <td className="py-2.5 pr-3 font-mono text-xs text-tinta-suave">{fila.id}</td>

                {campos.map((c) => (
                  <td key={c.clave} className="py-2.5 pr-3 text-tinta">
                    {c.clave === 'tono' ? (
                      <span className={`rounded-full px-2 py-0.5 text-xs ${claseTono(fila.tono)}`}>
                        {fila.tono}
                      </span>
                    ) : c.clave === 'emoji' ? (
                      <span className="text-lg">{fila.emoji}</span>
                    ) : c.clave === 'chilis' ? (
                      <span>{'🌶️'.repeat(fila.chilis) || '—'}</span>
                    ) : (
                      (fila[c.clave] ?? '—')
                    )}
                  </td>
                ))}

                <td className="py-2.5 pr-3 text-tinta-suave">{usos[fila.id] ?? 0}</td>

                <td className="py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <BotonAdmin variante="contorno" onClick={() => editar(fila)}>
                      Editar
                    </BotonAdmin>
                    <BotonAdmin variante="contorno" onClick={() => alternarActivo(fila)}>
                      {fila.activo ? 'Desactivar' : 'Activar'}
                    </BotonAdmin>
                    <BotonAdmin variante="peligro" onClick={() => eliminar(fila)}>
                      Eliminar
                    </BotonAdmin>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={guardar} className="mt-6 flex flex-wrap items-end gap-3 border-t border-crema-profundo pt-5">
        {campos.map((c) => (
          <div key={c.clave} className={c.ancho ?? 'min-w-48 flex-1'}>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
              {c.etiqueta}
            </label>

            {c.tipo === 'select' ? (
              <select
                value={data[c.clave]}
                onChange={(e) => setData(c.clave, e.target.value)}
                className={inputCls}
              >
                {c.opciones.map(([valor, texto]) => (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={c.tipo ?? 'text'}
                value={data[c.clave]}
                onChange={(e) => setData(c.clave, c.tipo === 'number' ? Number(e.target.value) : e.target.value)}
                className={inputCls}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={processing}
          className="rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {editando ? 'Guardar' : 'Agregar'}
        </button>

        {editando && (
          <button
            type="button"
            onClick={() => {
              setEditando(null)
              reset()
            }}
            className="rounded-full border border-crema-profundo px-4 py-2.5 text-sm font-medium text-tinta"
          >
            Cancelar
          </button>
        )}
      </form>

      {errors.nombre && <p className="mt-2 text-xs text-rojo">{errors.nombre}</p>}
      </TarjetaAdmin>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm text-tinta placeholder:text-tinta-suave/60 focus:border-verde-claro'

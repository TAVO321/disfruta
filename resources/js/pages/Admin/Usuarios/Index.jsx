import { useEffect, useState } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { IconoCerrar, IconoMas, IconoUsuarioGrupo } from '@/components/Iconos'
import { BotonAdmin } from '@/components/BotonAdmin'
import { useConfirmacion } from '@/context/Confirmacion'

const VACIO = { name: '', email: '', password: '', is_admin: true }

export default function UsuariosIndex({ usuarios, actual }) {
  const { confirmar } = useConfirmacion()
  const [editando, setEditando] = useState(null)
  const [creando, setCreando] = useState(false)

  return (
    <>
      <Head title="Administradores" />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Administradores</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Cuentas con acceso al panel. Siempre queda al menos una con permiso.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditando(null)
            setCreando(true)
          }}
          className="flex items-center gap-2 rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
        >
          <IconoMas width={16} height={16} />
          Nueva cuenta
        </button>
      </header>

      <TarjetaAdmin titulo="Cuentas" subtitulo={`${usuarios.length} cuenta(s) registradas`}>
        <ul className="divide-y divide-crema-oscuro">
          {usuarios.map((u) => (
            <li
              key={u.id}
              className="flex flex-wrap items-center gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-suave text-verde">
                <IconoUsuarioGrupo width={18} height={18} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-verde">
                  {u.name}
                  {u.id === actual && (
                    <span className="ml-2 text-xs font-normal text-tinta-suave">(vos)</span>
                  )}
                </p>
                <p className="truncate text-xs text-tinta-suave">{u.email}</p>
              </div>

              {!u.is_admin && (
                <span className="rounded-full bg-crema px-2.5 py-1 text-xs text-tinta-suave">
                  Sin acceso
                </span>
              )}

              <div className="flex shrink-0 gap-2">
                <BotonAdmin
                  variante="contornoVerde"
                  onClick={() => {
                    setCreando(false)
                    setEditando(u)
                  }}
                >
                  Editar
                </BotonAdmin>
                {u.id !== actual && (
                  <BotonAdmin
                    variante="peligro"
                    onClick={async () => {
                      if (
                        !(await confirmar({
                          titulo: '¿Eliminar cuenta?',
                          mensaje: `Se eliminará la cuenta de "${u.name}".`,
                          confirmarTexto: 'Eliminar',
                          cancelarTexto: 'Cancelar',
                          variante: 'peligro',
                        }))
                      ) {
                        return
                      }
                      router.delete(`/admin/usuarios/${u.id}`, { preserveScroll: true })
                    }}
                  >
                    Eliminar
                  </BotonAdmin>
                )}
              </div>
            </li>
          ))}
        </ul>
      </TarjetaAdmin>

      {(creando || editando) && (
        <Modal
          titulo={creando ? 'Nueva cuenta' : `Editar ${editando.name}`}
          onCerrar={() => {
            setCreando(false)
            setEditando(null)
          }}
        >
          <FormularioUsuario
            usuario={editando}
            alGuardar={() => {
              setCreando(false)
              setEditando(null)
            }}
          />
        </Modal>
      )}
    </>
  )
}

function FormularioUsuario({ usuario, alGuardar }) {
  const esEdicion = Boolean(usuario)
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    name: usuario?.name ?? '',
    email: usuario?.email ?? '',
    password: '',
    is_admin: usuario?.is_admin ?? true,
  })

  useEffect(() => () => reset(), [reset])

  const enviar = (e) => {
    e.preventDefault()
    const opciones = {
      onSuccess: () => {
        reset()
        alGuardar()
      },
      preserveScroll: true,
    }
    if (esEdicion) put(`/admin/usuarios/${usuario.id}`, opciones)
    else post('/admin/usuarios', opciones)
  }

  return (
    <form onSubmit={enviar} onFocus={() => clearErrors()} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-verde">Nombre</label>
        <input
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-crema-oscuro bg-crema px-4 py-2.5 text-verde focus:border-verde focus:ring-2 focus:ring-verde/20 focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-xs text-rojo">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-verde">Correo</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          autoComplete="off"
          className="w-full rounded-xl border border-crema-oscuro bg-crema px-4 py-2.5 text-verde focus:border-verde focus:ring-2 focus:ring-verde/20 focus:outline-none"
        />
        {errors.email && <p className="mt-1 text-xs text-rojo">{errors.email}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-verde">
          Contraseña {esEdicion && <span className="font-normal text-tinta-suave">(dejala vacía para no cambiarla)</span>}
        </label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          autoComplete="new-password"
          placeholder={esEdicion ? 'Sin cambios' : 'Mínimo 8 caracteres'}
          className="w-full rounded-xl border border-crema-oscuro bg-crema px-4 py-2.5 text-verde focus:border-verde focus:ring-2 focus:ring-verde/20 focus:outline-none"
        />
        {errors.password && <p className="mt-1 text-xs text-rojo">{errors.password}</p>}
      </div>

      <label className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={data.is_admin}
          onChange={(e) => setData('is_admin', e.target.checked)}
          className="h-4 w-4 accent-verde"
        />
        <span className="text-sm text-verde">Puede entrar al panel</span>
      </label>
      {errors.is_admin && <p className="text-xs text-rojo">{errors.is_admin}</p>}

      <div className="flex gap-3 border-t border-crema-oscuro pt-4">
        <button
          type="submit"
          disabled={processing}
          className="rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-50"
        >
          {processing ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear cuenta'}
        </button>
      </div>
    </form>
  )
}

function Modal({ titulo, onCerrar, children }) {
  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="animar-aparece absolute inset-0 bg-tinta/50"
      />
      <div className="animar-aparece relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-suave sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-verde">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full p-2 text-tinta-suave hover:bg-crema"
          >
            <IconoCerrar />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

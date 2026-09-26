import { useState } from 'react'
import { IconoCerrar } from '@/components/Iconos'
import { CONTRASENA_POR_DEFECTO, iniciarSesionAdmin } from '@/lib/seguridad'

export function AccesoAdmin({ alEntrar }: { alEntrar: () => void }) {
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contrasena.trim() || enviando) return
    setEnviando(true)
    setError('')
    const ok = await iniciarSesionAdmin(contrasena)
    setEnviando(false)
    if (ok) {
      setContrasena('')
      alEntrar()
    } else {
      setError('Contrasena incorrecta. Volve a intentarlo.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-crema px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <img
            src="/img/logo-disfruta.png"
            alt=""
            className="h-16 w-16 rounded-full bg-white object-contain p-1.5 shadow-suave"
          />
          <h1 className="mt-5 font-serif text-2xl font-bold text-verde">Panel del administrador</h1>
          <p className="mt-2 text-sm text-tinta-suave">
            Esta seccion es privada. Ingresa con la contrasena del local.
          </p>
        </div>

        <form
          onSubmit={entrar}
          className="mt-7 rounded-2xl border border-crema-profundo bg-white p-6 shadow-suave"
        >
          <label
            htmlFor="admin-contrasena"
            className="eyebrow mb-1.5 block text-tinta-suave"
          >
            Contrasena
          </label>
          <input
            id="admin-contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value)
              setError('')
            }}
            autoComplete="current-password"
            autoFocus
            placeholder="Escribi tu contrasena"
            className="w-full rounded-xl border border-crema-profundo bg-crema px-3.5 py-3 text-sm focus:border-verde-claro"
          />

          {error && (
            <p className="mt-3 flex items-start gap-1.5 text-xs text-rojo">
              <IconoCerrar width={13} height={13} className="mt-px shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!contrasena.trim() || enviando}
            className="mt-5 w-full rounded-full bg-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio disabled:opacity-40"
          >
            {enviando ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        {CONTRASENA_POR_DEFECTO && (
          <p className="mt-5 rounded-xl border border-dorado/40 bg-dorado-suave/50 px-4 py-3 text-center text-xs leading-relaxed text-tinta-suave">
            Contrasena de ejemplo: <strong className="text-verde">disfruta2026</strong>.
            Antes de publicar, defini <code className="text-verde">VITE_ADMIN_PASSWORD</code> en
            un archivo <code className="text-verde">.env</code>.
          </p>
        )}

        <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-tinta-suave/80">
          La sesion se cierra al cerrar la pestana del navegador.
        </p>
      </div>
    </div>
  )
}

import { Head, useForm } from '@inertiajs/react'
import { IconoWhatsapp } from '@/components/Iconos'
import { MARCA } from '@/lib/config'

export default function Acceso() {
  const { post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post('/admin/acceso')
  }

  return (
    <>
      <Head title="Acceso al panel" />

      <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <span className="inline-flex rounded-2xl bg-verde p-3 font-serif text-xl font-bold text-dorado">
              {MARCA.nombre}
            </span>
            <h1 className="mt-5 font-serif text-2xl font-bold text-verde">Panel de administración</h1>
            <p className="mt-2 text-sm text-tinta-suave">
              Ingresá con tu cuenta de administrador para gestionar el catálogo.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-crema-profundo bg-white p-6 shadow-suave">
            <Campo label="Email">
              <input
                type="email"
                value={post('email')}
                onChange={(e) => post('email', e.target.value)}
                autoComplete="username"
                autoFocus
                required
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm text-tinta focus:border-verde-claro"
              />
              {errors.email && <p className="mt-1 text-xs text-rojo">{errors.email}</p>}
            </Campo>

            <Campo label="Contraseña">
              <input
                type="password"
                value={post('password')}
                onChange={(e) => post('password', e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-crema-profundo bg-crema px-3.5 py-2.5 text-sm text-tinta focus:border-verde-claro"
              />
              {errors.password && <p className="mt-1 text-xs text-rojo">{errors.password}</p>}
            </Campo>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-tinta-suave">
              <input
                type="checkbox"
                checked={post('remember')}
                onChange={(e) => post('remember', e.target.checked)}
                className="h-4 w-4 accent-verde"
              />
              Recordarme en este equipo
            </label>

            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-full bg-verde py-3 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio disabled:opacity-50"
            >
              {processing ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 flex items-center justify-center gap-2 text-xs text-tinta-suave hover:text-verde"
          >
            <IconoWhatsapp width={13} height={13} />
            Volver al sitio
          </a>
        </div>
      </div>
    </>
  )
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wide text-tinta-suave uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

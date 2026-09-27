import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { Flash } from '@/components/Flash'
import {
  IconoCerrar,
  IconoEtiqueta,
  IconoGrafico,
  IconoLote,
  IconoMenu,
  IconoPanel,
  IconoUsuarioGrupo,
} from '@/components/Iconos'

const SECCIONES = [
  { ruta: '/admin', texto: 'Resumen', icono: IconoGrafico, exacto: true },
  { ruta: '/admin/productos', texto: 'Productos', icono: IconoEtiqueta },
  { ruta: '/admin/lotes', texto: 'Lotes', icono: IconoLote },
  { ruta: '/admin/pedidos', texto: 'Pedidos', icono: IconoPanel },
  { ruta: '/admin/promociones', texto: 'Promociones', icono: IconoEtiqueta },
  { ruta: '/admin/clientes', texto: 'Clientes', icono: IconoPanel },
]

const SECCIONES_SISTEMA = [
  { ruta: '/admin/categorias', texto: 'Familias', icono: IconoEtiqueta },
  { ruta: '/admin/catalogos', texto: 'CatÃ¡logos', icono: IconoEtiqueta },
  { ruta: '/admin/usuarios', texto: 'Administradores', icono: IconoUsuarioGrupo },
  { ruta: '/admin/ajustes', texto: 'Ajustes', icono: IconoEtiqueta },
]

export function TarjetaAdmin({ titulo, subtitulo, accion, children }) {
  return (
    <section className="rounded-2xl border border-crema-profundo bg-white shadow-suave">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-crema-oscuro px-5 py-4">
        <div>
          {titulo && <h2 className="font-serif text-xl font-semibold text-verde">{titulo}</h2>}
          {subtitulo && <p className="mt-0.5 text-xs text-tinta-suave">{subtitulo}</p>}
        </div>
        {accion}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default function LayoutAdmin({ children }) {
  const [abierto, setAbierto] = useState(false)
  // En Inertia 3 la url vive en la pagina, no dentro de props.
  const { url, props } = usePage()
  const { auth } = props
  // la url trae query string: el menu lateral compara solo el path
  const actualUrl = (url ?? '/').split('?')[0]

  const activo = (ruta, exacto) =>
    exacto ? actualUrl === ruta : actualUrl === ruta || actualUrl.startsWith(`${ruta}/`)

  const salir = () => router.post('/admin/salir')

  // El menu de escritorio y el drawer de movil comparten el mismo marcado: lo
  // unico que cambia es el padding y si el enlace cierra el drawer.
  const enlacesDe = (secciones, movil) =>
    secciones.map((s) => {
      const esActivo = activo(s.ruta, s.exacto)
      const clases = movil
        ? `flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm ${
            esActivo ? 'bg-crema font-semibold text-verde' : 'text-crema/75'
          }`
        : `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
            esActivo
              ? 'bg-crema font-semibold text-verde'
              : 'text-crema/70 hover:bg-crema/10 hover:text-crema'
          }`

      return (
        <Link
          key={s.ruta}
          href={s.ruta}
          onClick={movil ? () => setAbierto(false) : undefined}
          className={clases}
        >
          <s.icono width={17} height={17} />
          {s.texto}
        </Link>
      )
    })

  return (
    <div className="min-h-screen bg-crema-oscuro/50">
      {auth?.user && (
        <div className="bg-verde px-4 py-1.5 text-center text-[0.7rem] text-crema/80">
          SesiÃ³n de {auth.user.email}
        </div>
      )}

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-crema-profundo bg-verde text-crema lg:flex">
          <div className="border-b border-crema/12 px-5 py-5">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/images/logo.png"
                alt="DISFRUTA"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg bg-crema object-contain p-0.5"
              />
              <span>
                <span className="block font-serif text-base font-bold tracking-[0.14em]">DISFRUTA</span>
                <span className="block text-[0.6rem] tracking-[0.15em] text-dorado-claro uppercase">
                  Panel admin
                </span>
              </span>
            </Link>
          </div>

          <nav className="scrollbar-slim flex-1 space-y-0.5 overflow-y-auto p-3">
            {enlacesDe(SECCIONES, false)}
            <p className="mt-5 px-3.5 pb-1.5 text-[0.6rem] tracking-[0.15em] text-crema/40 uppercase">
              Sistema
            </p>
            {enlacesDe(SECCIONES_SISTEMA, false)}
          </nav>

          <div className="border-t border-crema/12 p-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-crema/25 py-2.5 text-xs font-semibold tracking-wide text-crema/80 uppercase transition-colors hover:border-dorado hover:text-dorado-claro"
            >
              Ver la web
            </Link>
            <button
              type="button"
              onClick={salir}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold tracking-wide text-crema/55 uppercase transition-colors hover:bg-crema/10 hover:text-dorado-claro"
            >
              Cerrar sesiÃ³n
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-crema-profundo bg-crema/95 px-4 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setAbierto(true)}
              className="rounded-full p-2 text-verde"
              aria-label="Abrir menÃº del panel"
            >
              <IconoMenu />
            </button>
            <span className="font-serif text-lg font-bold tracking-[0.12em] text-verde">DISFRUTA</span>
            <span className="text-xs text-tinta-suave">Panel admin</span>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            <Flash />
            {children}
          </div>
        </div>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menÃº"
            onClick={() => setAbierto(false)}
            className="animar-aparece absolute inset-0 bg-tinta/50"
          />
          <nav className="animar-desliza-lateral absolute inset-y-0 left-0 flex w-64 flex-col bg-verde text-crema">
            <div className="mb-1 flex items-center justify-between px-2 py-2">
              <span className="font-serif font-bold tracking-[0.14em]">DISFRUTA</span>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="rounded-full p-2 text-crema/70"
                aria-label="Cerrar"
              >
                <IconoCerrar />
              </button>
            </div>

            <div className="scrollbar-slim min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3 pt-1">
              {enlacesDe(SECCIONES, true)}
              <p className="mt-5 px-3.5 pb-1.5 text-[0.6rem] tracking-[0.15em] text-crema/40 uppercase">
                Sistema
              </p>
              {enlacesDe(SECCIONES_SISTEMA, true)}
            </div>

            {/* El drawer movil no heredaba estas acciones del aside de escritorio:
                en el celular no habia forma de volver a la web ni de salir. */}
            <div className="border-t border-crema/12 p-3">
              <Link
                href="/"
                onClick={() => setAbierto(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-crema/25 py-2.5 text-xs font-semibold tracking-wide text-crema/80 uppercase transition-colors hover:border-dorado hover:text-dorado-claro"
              >
                Ver la web
              </Link>
              <button
                type="button"
                onClick={salir}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold tracking-wide text-crema/55 uppercase transition-colors hover:bg-crema/10 hover:text-dorado-claro"
              >
                Cerrar sesiÃ³n
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

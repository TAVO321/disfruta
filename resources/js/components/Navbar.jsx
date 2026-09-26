import { useEffect, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { IconoCarrito, IconoCerrar, IconoMenu, IconoPanel } from '@/components/Iconos'
import { MARCA, whatsappLegible } from '@/lib/config'
import { useCarrito } from '@/context/Carrito'

const ENLACES = [
  { a: '/', texto: 'Inicio' },
  { a: '/catalogo', texto: 'Catálogo' },
  { a: '/promociones', texto: 'Promociones' },
  { a: '/nosotros', texto: 'Nosotros' },
]

export function Navbar({ onAbrirCarrito }) {
  const { cantidad } = useCarrito()
  // En Inertia 3 la url vive en la pagina, no dentro de props.
  const { url, props } = usePage()
  const { ajustes, auth } = props
  const whatsapp = ajustes?.whatsapp ?? ''
  // la url trae query string (?q=ajo): el menu compara solo el path
  const actualUrl = (url ?? '/').split('?')[0]

  const [abierto, setAbierto] = useState(false)
  const [scrolleado, setScrolleado] = useState(false)
  const cerrado = () => setAbierto(false)

  const actual = (ruta) =>
    ruta === '/' ? actualUrl === '/' : actualUrl === ruta || actualUrl.startsWith(`${ruta}/`)

  useEffect(() => {
    const alScroll = () => setScrolleado(window.scrollY > 12)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-crema/92 backdrop-blur transition-shadow ${
        scrolleado ? 'border-crema-profundo shadow-suave' : 'border-transparent'
      }`}
    >
      <div className="container-disfruta flex items-center justify-between py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="DISFRUTA, inicio" onClick={cerrado}>
          <img
            src="/images/logo.png"
            alt="DISFRUTA"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl object-contain"
          />
          <span className="font-serif text-xl font-bold tracking-[0.16em] text-verde">
            DISFRUTA
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {ENLACES.map((e) => (
            <Link
              key={e.a}
              href={e.a}
              className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                actual(e.a) ? 'text-verde' : 'text-tinta-suave hover:text-verde'
              }`}
              aria-current={actual(e.a) ? 'page' : undefined}
            >
              {e.texto}
              {actual(e.a) && <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-dorado" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <Link
            href={auth?.user ? '/admin' : '/admin/acceso'}
            title={auth?.user ? 'Panel de administración' : 'Ingresar al panel'}
            className="hidden rounded-full p-2.5 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde sm:block"
          >
            <IconoPanel />
          </Link>
          <button
            type="button"
            onClick={onAbrirCarrito}
            className="relative rounded-full p-2.5 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde"
            aria-label={`Abrir carrito, ${cantidad} productos`}
          >
            <IconoCarrito />
            {cantidad > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rojo px-1 text-[0.6rem] font-bold text-crema">
                {cantidad}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="rounded-full p-2.5 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde lg:hidden"
            aria-label="Menú"
            aria-expanded={abierto}
          >
            {abierto ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </div>
      </div>

      {abierto && (
        <div className="animar-desliza border-t border-crema-profundo bg-crema lg:hidden">
          <nav className="container-disfruta flex flex-col py-3">
            {ENLACES.map((e) => (
              <Link
                key={e.a}
                href={e.a}
                onClick={cerrado}
                className={`flex items-center justify-between border-b border-crema-oscuro py-3.5 font-serif text-lg ${
                  actual(e.a) ? 'text-rojo' : 'text-verde'
                }`}
              >
                {e.texto}
              </Link>
            ))}
            <Link
              href={auth?.user ? '/admin' : '/admin/acceso'}
              onClick={cerrado}
              className="flex items-center gap-2 py-3.5 text-sm font-semibold tracking-wide text-tinta-suave uppercase"
            >
              <IconoPanel width={16} height={16} /> Panel de administración
            </Link>
            {whatsapp && (
              <p className="py-3 text-xs text-tinta-suave">{whatsappLegible(whatsapp)}</p>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

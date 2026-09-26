import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IconoCarrito, IconoCerrar, IconoMenu, IconoPanel, IconoUsuario } from '@/components/Iconos'
import { MARCA } from '@/lib/config'
import { useTienda } from '@/store/tienda'

const ENLACES = [
  { a: '/', texto: 'Inicio' },
  { a: '/catalogo', texto: 'Catálogo' },
  { a: '/promociones', texto: 'Promociones' },
  { a: '/nosotros', texto: 'Nosotros' },
  { a: '/contacto', texto: 'Contacto' },
]

export function Navbar({ onAbrirCarrito }: { onAbrirCarrito: () => void }) {
  const { cantidadCarrito } = useTienda()
  const [abierto, setAbierto] = useState(false)
  const [scrolleado, setScrolleado] = useState(false)
  const cerrado = () => setAbierto(false)

  useEffect(() => {
    const alScroll = () => setScrolleado(window.scrollY > 12)
    alScroll()
    window.addEventListener('scroll', alScroll, { passive: true })
    return () => window.removeEventListener('scroll', alScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolleado
          ? 'border-b border-crema-profundo bg-crema/92 backdrop-blur-md'
          : 'border-b border-transparent bg-crema'
      }`}
    >
      <div className="container-disfruta flex h-18 items-center justify-between gap-4 py-3.5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="DISFRUTA, inicio" onClick={cerrado}>
          <img src="/img/logo-disfruta.png" alt="" className="h-11 w-11 object-contain" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-[0.16em] text-verde">
              DISFRUTA
            </span>
            <span className="mt-1 text-[0.58rem] font-medium tracking-[0.2em] text-dorado uppercase">
              Acompañamientos artesanales
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {ENLACES.map((e) => (
            <NavLink
              key={e.a}
              to={e.a}
              end={e.a === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-verde' : 'text-tinta-suave hover:text-verde'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {e.texto}
                  {isActive && (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-dorado" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <Link
            to="/admin"
            title="Panel de administración"
            className="hidden rounded-full p-2.5 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde sm:block"
          >
            <IconoPanel />
          </Link>
          <Link
            to="/favoritos"
            title="Mi cuenta y favoritos"
            className="rounded-full p-2.5 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde"
          >
            <IconoUsuario />
          </Link>
          <button
            type="button"
            onClick={onAbrirCarrito}
            className="relative rounded-full p-2.5 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde"
            aria-label={`Abrir carrito, ${cantidadCarrito} productos`}
          >
            <IconoCarrito />
            {cantidadCarrito > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rojo px-1 text-[0.6rem] font-bold text-crema">
                {cantidadCarrito}
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
              <NavLink
                key={e.a}
                to={e.a}
                end={e.a === '/'}
                onClick={cerrado}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-crema-oscuro py-3.5 font-serif text-lg ${
                    isActive ? 'text-rojo' : 'text-verde'
                  }`
                }
              >
                {e.texto}
              </NavLink>
            ))}
            <Link
              to="/admin"
              onClick={cerrado}
              className="flex items-center gap-2 py-3.5 text-sm font-semibold tracking-wide text-tinta-suave uppercase"
            >
              <IconoPanel width={16} height={16} /> Panel de administración
            </Link>
            <p className="py-3 text-xs text-tinta-suave">{MARCA.whatsappLegible}</p>
          </nav>
        </div>
      )}
    </header>
  )
}

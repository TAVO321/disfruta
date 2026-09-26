import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  IconoCerrar,
  IconoEtiqueta,
  IconoGrafico,
  IconoLote,
  IconoMenu,
  IconoPanel,
} from '@/components/Iconos'
import { MARCA } from '@/lib/config'
import { cerrarSesionAdmin } from '@/lib/seguridad'
import type { EstadoPedido } from '@/types'
import { useTienda } from '@/store/tienda'

type Seccion = 'resumen' | 'productos' | 'stock' | 'lotes' | 'pedidos' | 'promociones' | 'clientes'

const SECCIONES: { id: Seccion; texto: string; icono: typeof IconoPanel }[] = [
  { id: 'resumen', texto: 'Resumen', icono: IconoGrafico },
  { id: 'productos', texto: 'Productos', icono: IconoEtiqueta },
  { id: 'stock', texto: 'Stock', icono: IconoLote },
  { id: 'lotes', texto: 'Lotes', icono: IconoLote },
  { id: 'pedidos', texto: 'Pedidos', icono: IconoPanel },
  { id: 'promociones', texto: 'Promociones', icono: IconoEtiqueta },
  { id: 'clientes', texto: 'Clientes', icono: IconoPanel },
]

export const ESTADOS: { id: EstadoPedido; nombre: string; color: string }[] = [
  { id: 'nuevo', nombre: 'Nuevo', color: 'bg-dorado text-verde' },
  { id: 'confirmado', nombre: 'Confirmado', color: 'bg-verde-claro text-crema' },
  { id: 'preparando', nombre: 'Preparando', color: 'bg-rojo-claro text-crema' },
  { id: 'entregado', nombre: 'Entregado', color: 'bg-verde text-crema' },
  { id: 'cancelado', nombre: 'Cancelado', color: 'bg-tinta-suave text-crema' },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  const { productos, datos } = useTienda()

  const alertas = productos.filter((p) => p.activo && p.stock <= p.stockMinimo).length
  const nuevosPedidos = datos.pedidos.filter((p) => p.estado === 'nuevo').length

  const insignia = (id: Seccion) =>
    id === 'stock' && alertas ? alertas : id === 'pedidos' && nuevosPedidos ? nuevosPedidos : 0

  return (
    <div className="min-h-screen bg-crema-oscuro/50">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-crema-profundo bg-verde text-crema lg:flex">
          <div className="border-b border-crema/12 px-5 py-5">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/img/logo-disfruta.png" alt="" className="h-9 w-9 rounded-full bg-crema object-contain p-0.5" />
              <span>
                <span className="block font-serif text-base font-bold tracking-[0.14em]">DISFRUTA</span>
                <span className="block text-[0.6rem] tracking-[0.15em] text-dorado-claro uppercase">
                  Panel admin
                </span>
              </span>
            </Link>
          </div>

          <nav className="scrollbar-slim flex-1 space-y-0.5 overflow-y-auto p-3">
            {SECCIONES.map((s) => {
              const n = insignia(s.id)
              return (
                <NavLink
                  key={s.id}
                  to={s.id === 'resumen' ? '/admin' : `/admin/${s.id}`}
                  end={s.id === 'resumen'}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-crema text-verde font-semibold'
                        : 'text-crema/70 hover:bg-crema/10 hover:text-crema'
                    }`
                  }
                >
                  <s.icono width={17} height={17} />
                  {s.texto}
                  {n > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rojo px-1.5 text-[0.65rem] font-bold text-crema">
                      {n}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="border-t border-crema/12 p-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-crema/25 py-2.5 text-xs font-semibold tracking-wide text-crema/80 uppercase transition-colors hover:border-dorado hover:text-dorado-claro"
            >
              Ver la web
            </Link>
            <button
              type="button"
              onClick={() => {
                cerrarSesionAdmin()
                window.location.href = '/admin'
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold tracking-wide text-crema/55 uppercase transition-colors hover:bg-crema/10 hover:text-dorado-claro"
            >
              Cerrar sesion
            </button>
            <p className="mt-3 px-1 text-[0.65rem] leading-relaxed text-crema/45">
              {MARCA.whatsappLegible}
              <br />
              {MARCA.horarios}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-crema-profundo bg-crema/95 px-4 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setAbierto(true)}
              className="rounded-full p-2 text-verde"
              aria-label="Abrir menú del panel"
            >
              <IconoMenu />
            </button>
            <span className="font-serif text-lg font-bold tracking-[0.12em] text-verde">DISFRUTA</span>
            <span className="text-xs text-tinta-suave">Panel admin</span>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="animar-aparece absolute inset-0 bg-tinta/50"
          />
          <nav className="animar-desliza absolute inset-y-0 left-0 w-64 bg-verde p-3 text-crema">
            <div className="mb-3 flex items-center justify-between px-2 py-2">
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
            {SECCIONES.map((s) => (
              <NavLink
                key={s.id}
                to={s.id === 'resumen' ? '/admin' : `/admin/${s.id}`}
                end={s.id === 'resumen'}
                onClick={() => setAbierto(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm ${
                    isActive ? 'bg-crema font-semibold text-verde' : 'text-crema/75'
                  }`
                }
              >
                <s.icono width={17} height={17} />
                {s.texto}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

export function TarjetaAdmin({
  titulo,
  subtitulo,
  accion,
  children,
}: {
  titulo: string
  subtitulo?: string
  accion?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-crema-profundo bg-white shadow-suave">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-crema-oscuro px-5 py-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-verde">{titulo}</h2>
          {subtitulo && <p className="mt-0.5 text-xs text-tinta-suave">{subtitulo}</p>}
        </div>
        {accion}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

import { Link, usePage } from '@inertiajs/react'
import {
  IconoPanel,
  IconoReloj,
  IconoUbicacion,
  IconoWhatsapp,
} from '@/components/Iconos'
import { MARCA, whatsappLegible } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

const NAVEGACION = [
  { a: '/', t: 'Inicio' },
  { a: '/catalogo', t: 'Catálogo' },
  { a: '/promociones', t: 'Promociones' },
  { a: '/nosotros', t: 'Nosotros' },
]

export function Footer() {
  const { ajustes, categorias } = usePage().props
  const whatsapp = ajustes?.whatsapp ?? ''

  return (
    <footer className="mt-24 bg-verde text-crema">
      <div className="container-disfruta py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-2xl font-bold tracking-[0.16em]">DISFRUTA</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-crema/75">
              {MARCA.lema}. Acompañamientos artesanales elaborados con cuidado, pruebas
              previas y control de calidad.
            </p>
            {whatsapp && (
              <div className="mt-5 flex items-center gap-2">
                <a
                  href={linkWhatsApp(mensajeConsultaSimple('los productos'), whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-crema/12 text-crema transition-colors hover:bg-dorado hover:text-verde"
                  aria-label="WhatsApp"
                >
                  <IconoWhatsapp width={16} height={16} />
                </a>
              </div>
            )}
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-dorado-claro">Navegar</h3>
            <ul className="space-y-2.5 text-sm">
              {NAVEGACION.map((e) => (
                <li key={e.a}>
                  <Link href={e.a} className="text-crema/75 transition-colors hover:text-dorado-claro">
                    {e.t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-dorado-claro">Categorías</h3>
            <ul className="space-y-2.5 text-sm">
              {(categorias ?? []).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/catalogo?categoria=${c.slug}`}
                    className="text-crema/75 transition-colors hover:text-dorado-claro"
                  >
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-dorado-claro">Contacto</h3>
            <ul className="space-y-3.5 text-sm text-crema/75">
              {whatsapp && (
                <li className="flex gap-2.5">
                  <IconoWhatsapp width={16} height={16} className="mt-0.5 shrink-0 text-dorado-claro" />
                  <a
                    href={linkWhatsApp(mensajeConsultaSimple('un pedido'), whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-dorado-claro"
                  >
                    {whatsappLegible(whatsapp)}
                  </a>
                </li>
              )}
              {ajustes?.horarios && (
                <li className="flex gap-2.5">
                  <IconoReloj width={16} height={16} className="mt-0.5 shrink-0 text-dorado-claro" />
                  {ajustes.horarios}
                </li>
              )}
              <li className="flex gap-2.5">
                <IconoUbicacion width={16} height={16} className="mt-0.5 shrink-0 text-dorado-claro" />
                <span>
                  {(ajustes?.zonasEntrega ?? []).slice(0, 2).join(' · ') || 'La Paz'}
                  <br />
                  Entregas a coordinar
                </span>
              </li>
            </ul>
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-crema/25 px-4 py-2 text-xs font-semibold tracking-wide text-crema/80 uppercase transition-colors hover:border-dorado hover:text-dorado-claro"
            >
              <IconoPanel width={14} height={14} />
              Panel admin
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-crema/12 pt-7 text-center text-xs text-crema/55 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {MARCA.nombre}. Todos los derechos reservados.
          </p>
          <p>Elaborado artesanalmente, lote por lote.</p>
        </div>
      </div>
    </footer>
  )
}

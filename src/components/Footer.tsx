import { Link } from 'react-router-dom'
import {
  IconoPanel,
  IconoReloj,
  IconoUbicacion,
  IconoWhatsapp,
} from '@/components/Iconos'
import { CATEGORIAS, MARCA } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

export function Footer() {
  return (
    <footer className="mt-24 bg-verde text-crema">
      <div className="container-disfruta py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/img/logo-disfruta.png"
                alt=""
                className="h-12 w-12 rounded-full bg-crema object-contain p-1"
              />
              <span className="font-serif text-2xl font-bold tracking-[0.16em]">DISFRUTA</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-crema/75">
              {MARCA.lema}. Acompañamientos artesanales elaborados con cuidado, pruebas
              previas y control de calidad.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={linkWhatsApp(mensajeConsultaSimple('los productos'))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-crema/12 text-crema transition-colors hover:bg-dorado hover:text-verde"
                aria-label="WhatsApp"
              >
                <IconoWhatsapp width={16} height={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-dorado-claro">Navegar</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { a: '/', t: 'Inicio' },
                { a: '/catalogo', t: 'Catálogo' },
                { a: '/promociones', t: 'Promociones' },
                { a: '/nosotros', t: 'Nosotros' },
                { a: '/contacto', t: 'Contacto' },
                { a: '/favoritos', t: 'Mis favoritos' },
              ].map((e) => (
                <li key={e.a}>
                  <Link
                    to={e.a}
                    className="text-crema/75 transition-colors hover:text-dorado-claro"
                  >
                    {e.t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-dorado-claro">Categorías</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIAS.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/catalogo?categoria=${c.id}`}
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
              <li className="flex gap-2.5">
                <IconoWhatsapp width={16} height={16} className="mt-0.5 shrink-0 text-dorado-claro" />
                <a
                  href={linkWhatsApp(mensajeConsultaSimple('un pedido'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-dorado-claro"
                >
                  {MARCA.whatsappLegible}
                </a>
              </li>
              <li className="flex gap-2.5">
                <IconoReloj width={16} height={16} className="mt-0.5 shrink-0 text-dorado-claro" />
                {MARCA.horarios}
              </li>
              <li className="flex gap-2.5">
                <IconoUbicacion width={16} height={16} className="mt-0.5 shrink-0 text-dorado-claro" />
                <span>
                  {MARCA.zonasEntrega[0]}
                  <br />
                  Entregas a coordinar
                </span>
              </li>
            </ul>
            <Link
              to="/admin"
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

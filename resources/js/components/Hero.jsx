import { Link, usePage } from '@inertiajs/react'
import {
  IconoChef,
  IconoCorazonManos,
  IconoFuego,
  IconoHoja,
  IconoWhatsapp,
} from '@/components/Iconos'
import { ImagenProducto } from '@/components/ProductoUI'
import { IlustracionFrasco } from '@/components/FrascoIlustrado'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

const BENEFICIOS = [
  {
    icono: IconoHoja,
    titulo: 'Ingredientes seleccionados',
    texto: 'Comprados en el día, de huerta y proveedores de confianza.',
  },
  {
    icono: IconoChef,
    titulo: 'Recetas artesanales',
    texto: 'Cada lote se prueba y se ajusta antes de salir a la mesa.',
  },
  {
    icono: IconoCorazonManos,
    titulo: 'Ideales para compartir',
    texto: 'Pensados para que la comida se convierta en un momento especial.',
  },
  {
    icono: IconoFuego,
    titulo: 'Más sabor en cada ocasión',
    texto: 'Del primer bocado al último, la comida se disfruta más.',
  },
]

export function Hero({ destacados }) {
  const { ajustes } = usePage().props
  const whatsapp = ajustes?.whatsapp ?? ''
  const principales = destacados.slice(0, 3)
  const acompanante = destacados.find((p) => !principales.includes(p))

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* El desenfoque se repinta en cada frame de la flotacion. Un radio de
            520px con blur-3xl es mas caro que el viewport de un celular, asi que
            arranca chico y crece en pantallas grandes. */}
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-dorado-suave/60 blur-2xl sm:-top-32 sm:-right-24 sm:h-105 sm:w-105 sm:blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-verde-suave/70 blur-2xl sm:-bottom-40 sm:-left-32 sm:h-130 sm:w-130 sm:blur-3xl" />
      </div>

      <div className="container-disfruta grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-10 lg:py-24">
        <div className="animar-desliza">
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-dorado/30 bg-dorado-suave/60 px-3.5 py-1.5 text-dorado">
            <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
            Acompañamientos artesanales
          </span>

          <h1 className="mt-5 font-serif text-4xl leading-[1.08] font-bold text-balance text-verde sm:text-5xl lg:text-[3.6rem]">
            El sabor que acompaña
            <span className="relative ml-3 inline-block text-rojo">
              tus mejores
              <svg
                viewBox="0 0 220 12"
                className="absolute -bottom-1.5 left-0 w-full text-dorado/70"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8.5C48 3.5 130 2 218 6.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            momentos
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-tinta-suave sm:text-lg">
            Productos artesanales de alta calidad, ideales para{' '}
            <strong className="font-semibold text-verde">parrilladas, reuniones, familia</strong> y{' '}
            <strong className="font-semibold text-verde">celebraciones</strong>. Hechos a mano,
            lote por lote, para que cada comida se convierta en un momento para recordar.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2.5 rounded-full bg-verde px-7 py-4 text-sm font-semibold tracking-wide text-crema uppercase shadow-suave transition-all hover:bg-verde-medio hover:shadow-media"
            >
              Ver catálogo
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            {whatsapp && (
              <a
                href={linkWhatsApp(
                  mensajeConsultaSimple('los productos y stock disponible'),
                  whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-verde px-7 py-4 text-sm font-semibold tracking-wide text-verde uppercase transition-colors hover:bg-verde hover:text-crema"
              >
                <IconoWhatsapp width={18} height={18} />
                Pedir por WhatsApp
              </a>
            )}
          </div>

          <ul className="mt-11 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {BENEFICIOS.map(({ icono: Icono, titulo, texto }) => (
              <li key={titulo} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-verde-suave text-verde">
                  <Icono width={17} height={17} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-verde">{titulo}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-tinta-suave">{texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <EscenaProductos principales={principales} acompanante={acompanante} />

          <div className="animar-brillo absolute -bottom-4 left-2 rounded-2xl border border-crema-profundo bg-white/92 px-4 py-3 shadow-media backdrop-blur sm:left-6">
            <p className="eyebrow text-tinta-suave">Stock real</p>
            <p className="mt-0.5 font-serif text-2xl font-semibold text-verde">
              {destacados.reduce((n, p) => n + p.stock, 0)}{' '}
              <span className="text-sm font-normal text-tinta-suave">frascos</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function EscenaProductos({ principales, acompanante }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      <div className="absolute inset-x-6 bottom-4 top-10 rounded-[2rem] bg-gradient-to-br from-dorado-suave via-crema-oscuro to-verde-suave" />

      <svg
        viewBox="0 0 400 120"
        className="absolute inset-x-0 top-0 h-24 w-full text-verde/12"
        aria-hidden
      >
        <path
          d="M0 20h400M0 45h400M0 70h400M0 95h400M20 0v120M55 0v120M90 0v120M125 0v120M160 0v120M195 0v120M230 0v120M265 0v120M300 0v120M335 0v120M370 0v120"
          stroke="currentColor"
          strokeWidth="0.6"
        />
      </svg>

      {principales.map((p, i) => (
        <FrascoHero key={p.id} producto={p} posicion={i} />
      ))}

      {acompanante && (
        <div className="animar-brillo absolute top-[2%] right-[2%] aspect-square w-[16%] overflow-hidden rounded-2xl border-2 border-white bg-white shadow-media [animation-delay:-1.4s]">
          <IlustracionFrasco producto={acompanante} className="h-full w-full" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 h-14 w-14 rounded-full bg-rojo/25 blur-xl" />
      <div className="absolute top-1/3 -right-2 h-20 w-20 rounded-full bg-dorado/30 blur-2xl" />
    </div>
  )
}

function FrascoHero({ producto, posicion }) {
  // Todo se posiciona en porcentajes sobre el cuadrado del escenario, no en
  // pixeles. Asi la composicion se mantiene proporcional en cualquier ancho: con
  // anchos fijos los tres frascos sumaban 480px sobre los ~335px de un celular
  // y se pisaban entre si.
  const estilos = [
    'left-[4%] top-[11%] w-[33%]',
    'left-1/2 top-[6%] w-[36%] -translate-x-1/2',
    'right-[4%] top-[17%] w-[31%]',
  ]
  const inclinaciones = ['-rotate-6', 'rotate-0', 'rotate-7']
  const flotacion = ['animar-brillo', '', 'animar-brillo [animation-delay:-2.2s]']

  return (
    // La entrada (animar-desliza) y la flotacion (animar-brillo) animan las dos
    // `transform`, y en CSS gana la ultima regla aplicada: en el mismo elemento
    // una anula a la otra. Por eso van en envoltorios separados.
    <div
      className={`animar-desliza absolute origin-bottom ${estilos[posicion]} ${inclinaciones[posicion]}`}
    >
      <div className={flotacion[posicion]}>
        <div className="overflow-hidden rounded-[1.5rem] border-2 border-white bg-white shadow-flotante">
          <div className="aspect-3/4">
            <ImagenProducto producto={producto} />
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-center font-serif text-[0.7rem] leading-tight font-semibold text-balance text-verde min-[380px]:text-xs">
          {producto.nombre}
        </p>
      </div>
    </div>
  )
}

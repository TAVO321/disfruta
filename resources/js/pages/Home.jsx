import { useMemo } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { Hero } from '@/components/Hero'
import { IconoCheck, IconoChef, IconoFlecha, IconoWhatsapp } from '@/components/Iconos'
import { TarjetaProducto } from '@/components/TarjetaProducto'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

export default function Home({ productos, promociones }) {
  const { ajustes, platos } = usePage().props
  const whatsapp = ajustes?.whatsapp ?? ''

  const destacados = useMemo(
    () => productos.filter((p) => p.destacado).slice(0, 6),
    [productos],
  )

  const porPlato = useMemo(
    () =>
      (platos ?? []).map((plato) => ({
        plato,
        items: productos.filter((p) => p.platosRecomendados.includes(plato.id)).slice(0, 4),
      })),
    [productos, platos],
  )

  return (
    <>
      <Head title="Acompañamientos artesanales" />

      <Hero destacados={destacados} />

      <FranjaConfianza />

      <section className="container-disfruta py-20">
        <EncabezadoSeccion
          eyebrow="Los más pedidos"
          titulo="Productos destacados"
          texto="Los frascos que más salen: los que nuestros clientes vuelven a comprar para la parrilla, el asado y las reuniones de todos los fines de semana."
          enlace={{ a: '/catalogo', texto: 'Ver catálogo completo' }}
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((p, i) => (
            <TarjetaProducto key={p.id} producto={p} indice={i} />
          ))}
        </div>
      </section>

      <section className="bg-verde py-20 text-crema">
        <div className="container-disfruta">
          <div className="max-w-2xl">
            <p className="eyebrow text-dorado-claro">Combina tu comida</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-bold text-balance sm:text-4xl">
              Cada frasco tiene su plato. Te decimos cuál.
            </h2>
            <p className="mt-4 leading-relaxed text-crema/70">
              Elegí un plato y te mostramos los acompañamientos que lo hacen subir de nivel. De
              la parrilla al pique macho, pasando por el choripán y la hamburguesa casera.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {porPlato.map(({ plato }) => (
              <Link
                key={plato.id}
                href={`/catalogo?plato=${plato.id}`}
                className="rounded-full border border-crema/25 px-4 py-2 text-sm text-crema/85 transition-colors hover:border-dorado hover:bg-dorado hover:text-verde"
              >
                {plato.emoji} {plato.nombre}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {porPlato.slice(0, 3).map(({ plato, items }) => (
              <div
                key={plato.id}
                className="rounded-2xl border border-crema/15 bg-crema/5 p-6 backdrop-blur"
              >
                <h3 className="font-serif text-xl font-semibold">
                  {plato.emoji} {plato.nombre}
                </h3>
                <ul className="mt-3.5 space-y-2.5">
                  {items.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 flex-1 truncate text-crema/80">{p.nombre}</span>
                      <span className="shrink-0 text-xs text-dorado-claro">
                        {p.stock > 0 ? `${p.stock} disp.` : 'sin stock'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {promociones.length > 0 && (
        <section className="container-disfruta py-20">
          <EncabezadoSeccion
            eyebrow="Ofertas y ediciones"
            titulo="Promociones vigentes"
            texto="Combos para la parrilla, productos de temporada y ediciones limitadas con cantidades limitadas."
            enlace={{ a: '/promociones', texto: 'Ver todas las promociones' }}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {promociones.map((promo) => (
              <article
                key={promo.id}
                className="relative overflow-hidden rounded-2xl border border-dorado/30 bg-dorado-suave/40 p-6"
              >
                <span className="eyebrow rounded-full bg-verde px-2.5 py-1 text-crema">
                  {promo.tipo}
                </span>
                <h3 className="mt-3.5 font-serif text-xl leading-snug font-semibold text-verde">
                  {promo.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{promo.descripcion}</p>
                {promo.productos[0] && (
                  <button
                    type="button"
                    onClick={() => router.visit(`/catalogo/${promo.productos[0].slug}`)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-verde underline-offset-4 hover:underline"
                  >
                    Ver {promo.productos[0].nombre}
                    <IconoFlecha width={15} height={15} />
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="bg-crema-oscuro py-20">
        <div className="container-disfruta grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-dorado">Nuestra diferencia</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
              No vendemos encurtidos. Hacemos que cada comida se convierta en un momento.
            </h2>
            <p className="mt-5 leading-relaxed text-tinta-suave">
              En DISFRUTA elegimos los ingredientes, damos el tiempo justo a cada encurtido y
              probamos lote por lote antes de que salga de la cocina. Nada de atajos, nada de
              conservantes de más.
            </p>
            <ul className="mt-7 space-y-3.5">
              {[
                'Recetas propias, ajustadas después de cada temporada.',
                'Lotes rotulados con fecha de elaboración y consumo recomendado.',
                'Pruebas de acidez, textura y color antes de liberar cada frasco.',
                'Producción artesanal en cantidades pequeñas, sin cámara industrial.',
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-tinta">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde text-crema">
                    <IconoCheck width={12} height={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/nosotros"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-verde uppercase transition-colors hover:bg-verde hover:text-crema"
            >
              Conocé nuestra historia
              <IconoFlecha width={15} height={15} />
            </Link>
          </div>

          <ProcesoVisual />
        </div>
      </section>

      <section className="container-disfruta py-20">
        <div className="relative overflow-hidden rounded-3xl bg-verde px-8 py-14 text-center text-crema sm:px-16">
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-dorado/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-rojo/20 blur-3xl" />
          <span className="relative inline-flex rounded-full bg-crema/12 p-3">
            <IconoChef width={26} height={26} className="text-dorado-claro" />
          </span>
          <h2 className="relative mt-6 font-serif text-3xl leading-tight font-bold text-balance sm:text-4xl">
            ¿Armamos tu pedido para el finde?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-crema/75">
            Decinos qué vas a cocinar y te sugerimos los acompañamientos. Consultá stock real,
            lotes disponibles y fechas de consumo por WhatsApp.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {whatsapp && (
              <a
                href={linkWhatsApp(
                  mensajeConsultaSimple('armar un pedido para el fin de semana'),
                  whatsapp,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-dorado px-7 py-4 text-sm font-semibold tracking-wide text-verde uppercase transition-colors hover:bg-dorado-claro"
              >
                <IconoWhatsapp width={18} height={18} />
                Hablar por WhatsApp
              </a>
            )}
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-crema/40 px-7 py-4 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:border-crema hover:bg-crema/10"
            >
              Ver zonas de entrega
            </Link>
          </div>
          <p className="relative mt-6 text-xs text-crema/55">
            {[ajustes?.horarios, (ajustes?.zonasEntrega ?? [])[0]].filter(Boolean).join(' · ')}
          </p>
        </div>
      </section>
    </>
  )
}

function FranjaConfianza() {
  const datos = [
    { valor: `${new Date().getFullYear() - 2024}+`, texto: 'Años elaborando artesanalmente' },
    { valor: '100%', texto: 'Recetas propias' },
    { valor: 'Lote', texto: 'Rastreable en cada frasco' },
    { valor: '0', texto: 'Conservantes de más' },
  ]

  return (
    <div className="border-y border-crema-profundo bg-white">
      <div className="container-disfruta grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {datos.map((d) => (
          <div key={d.texto} className="text-center">
            <p className="font-serif text-2xl font-bold text-verde sm:text-3xl">{d.valor}</p>
            <p className="mt-1 text-xs tracking-wide text-tinta-suave uppercase">{d.texto}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProcesoVisual() {
  const pasos = [
    { n: '01', t: 'Selección', d: 'Elegimos la verdura del día en la huerta y el mercado.' },
    { n: '02', t: 'Receta', d: 'Vinagre, sal y especias en las proporciones correctas.' },
    { n: '03', t: 'Elaboración', d: 'Escalado, encurtido y reposo controlado lote por lote.' },
    { n: '04', t: 'Control', d: 'Pruebas de textura, acidez y color. Si no pasa, no sale.' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pasos.map((p) => (
        <div
          key={p.n}
          className="rounded-2xl border border-crema-profundo bg-white p-6 shadow-suave"
        >
          <span className="font-serif text-3xl font-bold text-dorado/45">{p.n}</span>
          <h3 className="mt-1.5 font-serif text-lg font-semibold text-verde">{p.t}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{p.d}</p>
        </div>
      ))}
    </div>
  )
}

function EncabezadoSeccion({ eyebrow, titulo, texto, enlace }) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow text-dorado">{eyebrow}</p>
        <h2 className="mt-2.5 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
          {titulo}
        </h2>
        <p className="mt-3.5 leading-relaxed text-tinta-suave">{texto}</p>
      </div>
      <Link
        href={enlace.a}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-crema-profundo bg-white px-5 py-3 text-sm font-semibold text-verde transition-colors hover:border-verde hover:bg-verde hover:text-crema md:self-auto"
      >
        {enlace.texto}
        <IconoFlecha width={15} height={15} />
      </Link>
    </div>
  )
}

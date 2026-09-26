import { Link } from 'react-router-dom'
import { IconoCheck, IconoFlecha, IconoWhatsapp } from '@/components/Iconos'
import { MARCA } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'

const PROCESO = [
  {
    paso: '01',
    titulo: 'Elegimos el ingrediente',
    texto:
      'Vamos a la huerta y al mercado cada semana. Si la cebolla no está firme y brillante, no entra en nuestra cocina. Preferimos producto de temporada y de origen conocido antes que un proveedor que no conocemos.',
    punto: 'Selección en origen',
  },
  {
    paso: '02',
    titulo: 'Ajustamos la receta',
    texto:
      'Cada producto tiene su receta propia, probada y reajustada. La acidez, el punto de sal y el tiempo de reposo se prueban hasta que el equilibrio es el correcto. No copiamos recetas: las escribimos y las discutimos.',
    punto: 'Receta propia',
  },
  {
    paso: '03',
    titulo: 'Elaboramos en lotes chicos',
    texto:
      'Producimos cantidades pequeñas, como en cualquier cocina de verdad. Eso nos permite revisar cada frasco, detectar desvíos y mantener el mismo sabor de un lote al siguiente.',
    punto: 'Sin línea industrial',
  },
  {
    paso: '04',
    titulo: 'Probamos antes de salir',
    texto:
      'Antes de que un lote salga de la cocina se leen su textura, su acidez y su color. Se prueba con los platos que realmente van a acompañar: la parrilla, el choripán, la hamburguesa.',
    punto: 'Control de calidad',
  },
]

const VALORES = [
  {
    titulo: 'Cuidado en cada detalle',
    texto: 'Nada de atajos. Si un lote no pasa las pruebas, no se entrega.',
  },
  {
    titulo: 'Transparencia total',
    texto: 'Cada frasco lleva su número de lote, fecha de elaboración y de consumo recomendado.',
  },
  {
    titulo: 'Comida para compartir',
    texto: 'Diseñamos el producto pensando en la mesa llena, no en el frasco individual.',
  },
  {
    titulo: 'Cantidades limitadas',
    texto: 'Cuando se acaba un lote, se acaba. No rellenamos con producto viejo.',
  },
]

const GALERIA = [
  { t: 'Selección en la huerta', d: 'Cada día elegimos a mano lo que se va a encurtir.' },
  { t: 'Preparación y escalado', d: 'Limpieza, corte y el primer aporte de calor.' },
  { t: 'El escabeche', d: 'Vinagre, sal y especias en las proporciones correctas.' },
  { t: 'Reposo y curado', d: 'El tiempo justo para que el sabor se asiente.' },
  { t: 'Pruebas de control', d: 'Textura, acidez y color antes de envasar.' },
  { t: 'Etiquetado del lote', d: 'Número, fechas y cantidad. Todo anotado.' },
  { t: 'La mesa compartida', d: 'El destino real de todo lo que elaboramos.' },
  { t: 'Envíos y entregas', d: 'Preparados para llegar frescos a tu zona.' },
]

export function Nosotros() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-crema-profundo bg-verde text-crema">
        <div className="pointer-events-none absolute -top-32 right-0 h-105 w-105 rounded-full bg-dorado/15 blur-3xl" />
        <div className="container-disfruta relative py-20">
          <p className="eyebrow text-dorado-claro">Nuestra historia</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.1] font-bold text-balance sm:text-5xl lg:text-6xl">
            Empezamos en una cocina de casa, con frascos que no daban la talla.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-crema/75">
            DISFRUTA nació con una idea simple: el encurtido de la abuela, hecho con técnica
            seria. Nos cansó comprar frascos que sabían a vinagre y nada más. Queríamos algo
            distinto: ingredientes de verdad, recetas que de verdad funcionan y, sobre todo,
            cuidado.
          </p>
        </div>
      </section>

      <section className="container-disfruta py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-dorado">Quiénes somos</p>
            <h2 className="mt-2.5 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
              Una marca hecha por alguien que se formó en alimentos y come de esto
            </h2>            <div className="mt-5 space-y-4 leading-relaxed text-tinta-suave">
              <p>
                DISFRUTA está a cargo de una{' '}
                <strong className="font-semibold text-verde">ingeniera en alimentos</strong>. Eso
                no es un detalle de marketing: es la forma en que trabajamos. Elegimos
                ingredientes mirando de dónde vienen y cómo se conservan, calculamos acidez y
                sal con criterio, y probamos cada lote antes de que llegue a tu mesa.
              </p>
              <p>
                Pero la ingeniería no está reñida con lo casero. Combinamos el rigor del
                laboratorio con la paciencia de una cocina de barrio: el frasco que sale de acá
                tiene que saberte a algo que guardarías en un frasco de tu casa, no a un
                producto de línea.
              </p>
              <p>
                Producimos cantidades pequeñas y las vendemos mientras duran. Si ves un producto
                sin stock, es que el lote se agotó de verdad. La próxima producción la hacemos
                al detalle.
              </p>
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {VALORES.map((v) => (
                <li key={v.titulo} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-verde text-crema">
                    <IconoCheck width={12} height={12} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-verde">{v.titulo}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-tinta-suave">
                      {v.texto}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={linkWhatsApp(mensajeConsultaSimple('conocer más sobre DISFRUTA'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio"
              >
                <IconoWhatsapp width={18} height={18} />
                Escribinos
              </a>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-verde uppercase transition-colors hover:bg-verde hover:text-crema"
              >
                Ver productos
                <IconoFlecha width={15} height={15} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: 'Ing.', t: 'en alimentos', c: 'bg-verde text-crema' },
                { n: '100%', t: 'recetas propias', c: 'bg-dorado text-verde' },
                { n: 'Lote', t: 'rastreable', c: 'bg-verde-medio text-crema' },
                { n: '0', t: 'conservantes de más', c: 'bg-rojo text-crema' },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-crema-profundo bg-white p-6 text-center shadow-suave"
                >
                  <p className={`font-serif text-3xl font-bold ${x.c.split(' ')[1]}`}>{x.n}</p>
                  <p className="mt-1 text-xs tracking-wide text-tinta-suave uppercase">{x.t}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-dorado/30 bg-dorado-suave/50 p-6">
              <p className="eyebrow text-dorado">Control de calidad</p>
              <p className="mt-2.5 text-sm leading-relaxed text-tinta">
                Cada lote registra <strong>fecha de elaboración</strong>,{' '}
                <strong>número de lote</strong> y{' '}
                <strong>fecha recomendada de consumo</strong>. Si algo no pasó las pruebas, el
                lote no sale de la cocina. Simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-crema-oscuro py-20">
        <div className="container-disfruta">
          <div className="max-w-2xl">
            <p className="eyebrow text-dorado">El proceso</p>
            <h2 className="mt-2.5 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
              De la huerta al frasco, paso por paso
            </h2>
            <p className="mt-3.5 leading-relaxed text-tinta-suave">
              Te mostramos cómo trabajamos, porque nos parece que conocer cómo se hace una cosa es
              parte de confiar en ella.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {PROCESO.map((p) => (
              <article
                key={p.paso}
                className="rounded-2xl border border-crema-profundo bg-white p-7 shadow-suave"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-serif text-4xl font-bold text-dorado/40">{p.paso}</span>
                  <span className="eyebrow rounded-full bg-verde-suave px-2.5 py-1 text-verde">
                    {p.punto}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold text-verde">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{p.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-disfruta py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-dorado">Galería del proceso</p>
          <h2 className="mt-2.5 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
            Imágenes de nuestro taller
          </h2>
          <p className="mt-3.5 leading-relaxed text-tinta-suave">
            Estas imágenes son el espacio para las fotos reales de la producción. reemplazalas
            desde el panel de administración cuando tengas tus fotografías.
          </p>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALERIA.map((f, i) => (
            <figure
              key={f.t}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-crema-profundo bg-white shadow-suave"
            >
              <div
                className="flex aspect-4/3 items-end bg-gradient-to-br from-dorado-suave via-crema to-verde-suave p-4"
                style={{ filter: `saturate(${1 - i * 0.04})` }}
              >
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-verde uppercase backdrop-blur">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <figcaption className="p-4">
                <p className="text-sm font-semibold text-verde">{f.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-tinta-suave">{f.d}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-tinta-suave">
          {MARCA.nombre} · {MARCA.lema}
        </p>
      </section>

      <CtaFinal />
    </div>
  )
}

export function CtaFinal() {
  return (
    <section className="container-disfruta pb-8">
      <div className="relative overflow-hidden rounded-3xl bg-verde px-8 py-14 text-center text-crema sm:px-16">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-dorado/20 blur-3xl" />
        <h2 className="relative font-serif text-3xl leading-tight font-bold text-balance sm:text-4xl">
          ¿Probamos juntos? Contame qué vas a cocinar
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-crema/75">
          Te armamos una selección de frascos según tu plan: asado, pollo, choripán,
          hamburguesa o simplemente la merienda de la tarde.
        </p>
        <a
          href={linkWhatsApp(mensajeConsultaSimple('una selección para mi próxima comida'))}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-8 inline-flex items-center gap-2.5 rounded-full bg-dorado px-7 py-4 text-sm font-semibold tracking-wide text-verde uppercase transition-colors hover:bg-dorado-claro"
        >
          <IconoWhatsapp width={18} height={18} />
          Armar mi selección
        </a>
      </div>
    </section>
  )
}

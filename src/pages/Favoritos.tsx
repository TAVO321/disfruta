import { Link } from 'react-router-dom'
import { IconoCorazon, IconoFlecha, IconoWhatsapp } from '@/components/Iconos'
import { TarjetaProducto } from '@/components/TarjetaProducto'
import { precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'
import type { Producto } from '@/types'
import { useTienda } from '@/store/tienda'

export function Favoritos({ onVer }: { onVer: (p: Producto) => void }) {
  const { datos, productos, alternarFavorito, alternarReserva } = useTienda()

  const favoritos = datos.favoritos
    .map((id) => productos.find((p) => p.id === id))
    .filter((p): p is Producto => Boolean(p))

  const reservas = datos.reservas
    .map((id) => productos.find((p) => p.id === id))
    .filter((p): p is Producto => Boolean(p))

  return (
    <div className="container-disfruta py-12">
      <header className="max-w-3xl">
        <p className="eyebrow text-dorado">Tu cuenta</p>
        <h1 className="mt-2.5 font-serif text-4xl leading-tight font-bold text-balance text-verde sm:text-5xl">
          Favoritos y reservas
        </h1>
        <p className="mt-4 leading-relaxed text-tinta-suave">
          Lo que guardaste te queda esperando en este navegador. Guardá tus frascos favoritos y
          reservá los que están sin stock para que te avisemos apenas salga el próximo lote.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold text-verde">
          <IconoCorazon lleno className="text-rojo" width={22} height={22} />
          Mis favoritos
          <span className="rounded-full bg-verde-suave px-2.5 py-0.5 text-sm font-sans font-semibold text-verde">
            {favoritos.length}
          </span>
        </h2>

        {favoritos.length === 0 ? (
          <Vacio
            titulo="Todavía no guardaste favoritos"
            texto="Tocá el corazón en cualquier producto para guardarlo acá y tenerlo a mano la próxima vez."
            cta={{ a: '/catalogo', texto: 'Explorar el catálogo' }}
          />
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoritos.map((p, i) => (
              <TarjetaProducto key={p.id} producto={p} onVer={onVer} indice={i} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-bold text-verde">Mis reservas de próximo lote</h2>
        <p className="mt-2 text-sm text-tinta-suave">
          Productos sin stock que pediste reservar. Te avisamos por WhatsApp cuando estén listos.
        </p>

        {reservas.length === 0 ? (
          <Vacio
            titulo="No tenés reservas activas"
            texto="Cuando un producto esté agotado, reservá el próximo lote desde su ficha."
            cta={{ a: '/catalogo', texto: 'Ver productos agotados' }}
          />
        ) : (
          <ul className="mt-6 divide-y divide-crema-oscuro overflow-hidden rounded-2xl border border-crema-profundo bg-white">
            {reservas.map((p) => {
              const lote = p.lotes[0]
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onVer(p)}
                      className="text-left font-serif text-lg font-semibold text-verde hover:text-rojo"
                    >
                      {p.nombre}
                    </button>
                    <p className="mt-0.5 text-xs text-tinta-suave">
                      {p.presentacion} · {precio(p.precio)}
                    </p>
                    {lote && (
                      <p className="mt-1 text-xs text-tinta-suave">
                        Último lote: <strong className="text-verde">{lote.codigo}</strong> ·
                        consumo recomendado{' '}
                        {new Date(`${lote.fechaConsumoRecomendado}T12:00:00`).toLocaleDateString(
                          'es-AR',
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={linkWhatsApp(
                        mensajeConsultaSimple(`mi reserva de "${p.nombre}"`),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-verde px-4 py-2 text-xs font-semibold text-crema transition-colors hover:bg-verde-medio"
                    >
                      <IconoWhatsapp width={14} height={14} />
                      Consultar fecha
                    </a>
                    <button
                      type="button"
                      onClick={() => alternarReserva(p.id)}
                      className="rounded-full border border-crema-profundo px-4 py-2 text-xs font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
                    >
                      Cancelar reserva
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="mt-16 rounded-2xl border border-dorado/30 bg-dorado-suave/40 p-6">
        <h2 className="font-serif text-xl font-semibold text-verde">
          ¿Querés guardar tu lista para siempre?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-tinta-suave">
          Esta versión guarda todo en tu navegador, así que tus favoritos viven en este
          dispositivo. Cuando conectemos la base de datos, la misma lista se va a sincronizar con
          tu cuenta y la vas a poder ver desde el celu o la compu.
        </p>
        <button
          type="button"
          onClick={() =>
            alternarFavorito(productos[0]?.id ?? '')
          }
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
        >
          Probar guardando el primero
          <IconoFlecha width={15} height={15} />
        </button>
      </section>
    </div>
  )
}

function Vacio({
  titulo,
  texto,
  cta,
}: {
  titulo: string
  texto: string
  cta: { a: string; texto: string }
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-crema-profundo bg-white px-8 py-14 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verde-suave text-verde">
        <IconoCorazon width={24} height={24} />
      </span>
      <p className="mt-4 font-serif text-xl text-verde">{titulo}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-tinta-suave">{texto}</p>
      <Link
        to={cta.a}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
      >
        {cta.texto}
        <IconoFlecha width={15} height={15} />
      </Link>
    </div>
  )
}

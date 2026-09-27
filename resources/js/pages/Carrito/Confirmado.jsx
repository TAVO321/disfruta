import { useEffect } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { IconoCheck, IconoFlecha, IconoWhatsapp } from '@/components/Iconos'
import { useCarritoAcciones } from '@/context/Carrito'
import { fecha, precio } from '@/lib/config'
import { linkWhatsApp } from '@/lib/whatsapp'

export default function Confirmado({ pedido }) {
  const { vaciar } = useCarritoAcciones()
  const { ajustes } = usePage().props

  // El pedido ya quedo registrado en la base: el carrito local se descarta.
  useEffect(() => {
    vaciar()
  }, [vaciar])

  const lineas = pedido.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.nombre} x ${item.cantidad}` +
        `${item.reserva ? ' [RESERVA próximo lote]' : ''} - ${precio(item.subtotal)}`,
    )
    .join('\n')

  const mensaje = encodeURIComponent(
    [
      `Hola DISFRUTA, recién hice el pedido #${pedido.id} desde la web.`,
      '',
      `*Pedido:* #${pedido.id}`,
      `*Cliente:* ${pedido.cliente}`,
      pedido.telefono ? `*Teléfono:* ${pedido.telefono}` : null,
      '',
      '*Productos:*',
      lineas,
      '',
      `*Total:* ${precio(pedido.total)}`,
      pedido.zona ? `*Zona de entrega:* ${pedido.zona}` : null,
      pedido.notas ? `*Notas:* ${pedido.notas}` : null,
      '',
      '_Pedido registrado en la web, falta confirmar entrega y forma de pago._',
    ]
      .filter(Boolean)
      .join('\n'),
  )

  const enlace = linkWhatsApp(mensaje, ajustes?.whatsapp)

  return (
    <>
      <Head title={`Pedido #${pedido.id} confirmado`} />

      <div className="container-disfruta py-14">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-verde p-4 text-crema">
              <IconoCheck width={28} height={28} />
            </span>
            <h1 className="mt-6 font-serif text-3xl leading-tight font-bold text-balance text-verde sm:text-4xl">
              ¡Pedido #<span className="text-dorado">{pedido.id}</span> registrado!
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-tinta-suave">
              Gracias {pedido.cliente.split(' ')[0]}, ya tenemos tu pedido. Te escribimos por
              WhatsApp para confirmar la entrega. No trabajamos con pasarela de pagos: el pago se
              coordina directamente con el pedido.
            </p>
            <p className="mt-3 text-xs text-tinta-suave">
              Registrado el {fecha(pedido.creado)}
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-crema-profundo bg-white shadow-suave">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-crema-profundo bg-crema-oscuro/50 px-6 py-4">
              <h2 className="font-serif text-lg font-semibold text-verde">Detalle del pedido</h2>
              <span className="eyebrow rounded-full bg-dorado px-2.5 py-1 text-verde">
                Nuevo
              </span>
            </div>

            <ul className="divide-y divide-crema-profundo">
              {pedido.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-verde">{item.nombre}</p>
                    <p className="text-xs text-tinta-suave">
                      {item.cantidad} × {precio(item.precio)}
                      {item.reserva && (
                        <span className="ml-2 rounded-full bg-dorado-suave px-2 py-0.5 text-[0.65rem] font-semibold text-verde">
                          Reserva próximo lote
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="shrink-0 font-serif text-sm font-semibold text-verde">
                    {precio(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-crema-profundo bg-crema-oscuro/30 px-6 py-5 text-sm">
              {pedido.zona && (
                <div className="flex justify-between gap-3">
                  <span className="text-tinta-suave">Zona de entrega</span>
                  <span className="text-right font-medium text-verde">{pedido.zona}</span>
                </div>
              )}
              {pedido.notas && (
                <div className="flex justify-between gap-3">
                  <span className="text-tinta-suave">Notas</span>
                  <span className="text-right font-medium text-verde">{pedido.notas}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-3 pt-2">
                <span className="font-semibold text-verde">Total</span>
                <span className="font-serif text-2xl font-bold text-verde">
                  {precio(pedido.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dorado/30 bg-dorado-suave/50 p-6 text-center">
            <p className="eyebrow text-dorado">Último paso</p>
            <p className="mt-2 text-sm leading-relaxed text-tinta">
              Mandanos este pedido por WhatsApp para que te confirmemos disponibilidad y forma de
              pago. Si ya te escribimos, no hace falta que lo hagas.
            </p>
            {enlace ? (
              <a
                href={enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-verde px-7 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio"
              >
                <IconoWhatsapp width={18} height={18} />
                Enviar pedido por WhatsApp
              </a>
            ) : (
              <p className="mt-4 text-sm text-tinta-suave">
                Guardá este número de pedido: te contactamos para confirmar la entrega.
              </p>
            )}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full border-2 border-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-verde uppercase transition-colors hover:bg-verde hover:text-crema"
            >
              Seguir comprando
              <IconoFlecha width={15} height={15} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-crema-profundo px-6 py-3.5 text-sm font-semibold tracking-wide text-tinta-suave uppercase transition-colors hover:border-verde hover:text-verde"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

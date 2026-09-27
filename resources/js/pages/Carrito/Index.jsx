import { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { IlustracionFrasco } from '@/components/FrascoIlustrado'
import { PrecioProducto } from '@/components/ProductoUI'
import { Campo } from '@/components/Campo'
import { IconoCarrito, IconoCerrar, IconoMenos, IconoMas, IconoWhatsapp } from '@/components/Iconos'
import { precio } from '@/lib/config'
import { linkWhatsApp, mensajeWhatsApp } from '@/lib/whatsapp'
import { useCarrito } from '@/context/Carrito'

const CAMPOS_VACIOS = { nombre: '', telefono: '', zona: '', notas: '' }

export default function CarritoIndex() {
  const { items, total, cambiarCantidad, eliminar, vaciar } = useCarrito()
  const { ajustes } = usePage().props
  const whatsapp = ajustes?.whatsapp ?? ''
  const zonas = ajustes?.zonasEntrega ?? []

  const [form, setForm] = useState(CAMPOS_VACIOS)
  const [enviando, setEnviando] = useState(false)

  const vacio = items.length === 0

  const confirmar = () => {
    setEnviando(true)

    router.post(
      '/carrito/confirmar',
      {
        cliente: form.nombre.trim(),
        telefono: form.telefono.trim(),
        zona: form.zona,
        notas: form.notas.trim() || null,
        items: items.map((i) => ({
          producto_id: i.productoId,
          cantidad: i.cantidad,
          reserva: i.reserva,
        })),
      },
      {
        onSuccess: () => vaciar(),
        onError: () => setEnviando(false),
        onFinish: () => setEnviando(false),
      },
    )

    if (whatsapp) {
      const texto = mensajeWhatsApp(
        items.map((i) => ({ producto: i, cantidad: i.cantidad, reserva: i.reserva })),
        total,
        form,
        whatsapp,
      )
      window.open(linkWhatsApp(texto, whatsapp), '_blank', 'noopener')
    }
  }

  return (
    <>
      <Head title="Tu pedido" />

      <div className="container-disfruta py-10 lg:py-14">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-verde sm:text-4xl">
              <IconoCarrito className="text-dorado" />
              Tu pedido
            </h1>
            <p className="mt-1.5 text-sm text-tinta-suave">
              {vacio
                ? 'Todavía no agregaste productos.'
                : `${items.length} ${items.length === 1 ? 'producto' : 'productos'} en el carrito.`}
            </p>
          </div>

          {!vacio && (
            <button
              type="button"
              onClick={() => confirm('Vaciar el carrito?') && vaciar()}
              className="text-xs text-tinta-suave underline-offset-4 hover:text-rojo hover:underline"
            >
              Vaciar carrito
            </button>
          )}
        </header>

        {vacio ? (
          <div className="rounded-3xl border border-crema-profundo bg-white px-6 py-16 text-center shadow-suave">
            <span className="mx-auto mb-4 inline-flex rounded-full bg-verde-suave p-4 text-verde">
              <IconoCarrito width={28} height={28} />
            </span>
            <p className="font-serif text-xl text-verde">Tu carrito está vacío</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-tinta-suave">
              Elegí un acompañamiento y empieza a armar tu pedido.
            </p>
            <Link
              href="/catalogo"
              className="mt-6 inline-flex rounded-full bg-verde px-6 py-3 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
            <ul className="divide-y divide-crema-oscuro rounded-3xl border border-crema-profundo bg-white px-5 shadow-suave">
              {items.map((item) => (
                <li key={`${item.productoId}-${item.reserva}`} className="flex gap-4 py-5">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-crema-profundo bg-crema-oscuro">
                    {item.imagen ? (
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <IlustracionFrasco
                        producto={{
                          id: item.productoId,
                          nombre: item.nombre,
                          tono: item.tono,
                          ingredientes: [],
                        }}
                        className="h-full w-full"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/catalogo/${item.slug}`}
                      className="font-serif text-lg text-verde hover:underline"
                    >
                      {item.nombre}
                    </Link>
                    <p className="text-xs text-tinta-suave">
                      {item.presentacion}
                      {item.reserva && (
                        <span className="ml-1.5 font-semibold text-rojo">· reserva próximo lote</span>
                      )}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-crema-profundo bg-crema">
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1, item.reserva)}
                          className="p-2 text-tinta-suave hover:text-verde"
                          aria-label="Restar uno"
                        >
                          <IconoMenos width={14} height={14} />
                        </button>
                        <span className="min-w-7 text-center text-sm font-semibold text-verde">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1, item.reserva)}
                          disabled={!item.reserva && item.cantidad >= item.tope}
                          className="p-2 text-tinta-suave hover:text-verde disabled:opacity-30"
                          aria-label="Sumar uno"
                        >
                          <IconoMas width={14} height={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => eliminar(item.productoId, item.reserva)}
                        className="inline-flex items-center gap-1 text-xs text-tinta-suave/70 hover:text-rojo"
                      >
                        <IconoCerrar width={14} height={14} /> Quitar
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <PrecioProducto producto={item} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-3xl border border-crema-profundo bg-white p-6 shadow-suave lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-semibold text-verde">Datos de entrega</h2>

              <div className="mt-4 space-y-3.5">
                <Campo
                  etiqueta="Nombre y apellido"
                  valor={form.nombre}
                  onChange={(v) => setForm({ ...form, nombre: v })}
                  placeholder="¿Cómo te llamás?"
                  requerido
                />
                <Campo
                  etiqueta="Teléfono / WhatsApp"
                  valor={form.telefono}
                  onChange={(v) => setForm({ ...form, telefono: v })}
                  placeholder="11 5555 0000"
                  requerido
                />
                <div>
                  <label className="eyebrow mb-1.5 block text-tinta-suave" htmlFor="zona">
                    Zona de entrega
                  </label>
                  <select
                    id="zona"
                    value={form.zona}
                    onChange={(e) => setForm({ ...form, zona: e.target.value })}
                    className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-3 text-sm text-tinta transition-colors focus:border-verde-claro"
                  >
                    <option value="">Elegí una zona</option>
                    {zonas.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                    <option>Otro / a coordinar</option>
                  </select>
                </div>
                <Campo
                  etiqueta="Notas para el pedido (opcional)"
                  valor={form.notas}
                  onChange={(v) => setForm({ ...form, notas: v })}
                  placeholder="Ej: entregar el sábado después de las 18 hs."
                  multilinea
                />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-crema-profundo pt-4">
                <span className="eyebrow text-tinta-suave">Total aproximado</span>
                <span className="font-serif text-2xl font-semibold text-verde">{precio(total)}</span>
              </div>

              <button
                type="button"
                onClick={confirmar}
                disabled={enviando || !form.nombre.trim() || !form.telefono.trim()}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-full bg-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconoWhatsapp width={18} height={18} />
                {enviando ? 'Guardando…' : 'Confirmar pedido'}
              </button>

              <p className="mt-2.5 text-center text-xs text-tinta-suave">
                Sin pago online. Confirmamos disponibilidad, envío y forma de pago por WhatsApp.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

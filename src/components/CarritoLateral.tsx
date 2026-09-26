import { useEffect, useState } from 'react'
import { ImagenProducto, PrecioProducto } from '@/components/ProductoUI'
import { IconoCarrito, IconoCerrar, IconoMenos, IconoMas, IconoWhatsapp } from '@/components/Iconos'
import { MARCA, precio } from '@/lib/config'
import { linkWhatsApp, mensajeWhatsApp } from '@/lib/whatsapp'
import { useTienda } from '@/store/tienda'

export function CarritoLateral({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const { productosEnCarrito, totalCarrito, cambiarCantidad, eliminar, guardarPedido } = useTienda()
  const [paso, setPaso] = useState<'carrito' | 'datos'>('carrito')
  const [form, setForm] = useState<{
    nombre: string
    telefono: string
    zona: string
    notas: string
  }>({ nombre: '', telefono: '', zona: MARCA.zonasEntrega[0], notas: '' })

  useEffect(() => {
    if (!abierto) return
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [abierto, onCerrar])

  if (!abierto) return null

  const cerrar = () => {
    onCerrar()
    setTimeout(() => setPaso('carrito'), 300)
  }

  const enviar = () => {
    const pedido = guardarPedido({
      cliente: form.nombre.trim() || 'Cliente sin nombre',
      telefono: form.telefono.trim(),
      zona: form.zona,
      items: productosEnCarrito.map((i) => ({
        productoId: i.productoId,
        nombre: i.producto.nombre,
        cantidad: i.cantidad,
        precio: i.producto.precio,
        reserva: i.reserva,
      })),
      total: totalCarrito,
      notas: form.notas.trim(),
    })
    const texto = mensajeWhatsApp(productosEnCarrito, totalCarrito, form)
    window.open(linkWhatsApp(texto), '_blank', 'noopener')
    cerrar()
    return pedido
  }

  const vacio = productosEnCarrito.length === 0

  return (
    <div className="fixed inset-0 z-70" role="dialog" aria-modal="true" aria-label="Carrito">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={cerrar}
        className="animar-aparece absolute inset-0 bg-tinta/45 backdrop-blur-[2px]"
      />

      <aside className="animar-sube-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-crema shadow-flotante">
        <header className="flex items-center justify-between border-b border-crema-profundo px-5 py-4">
          <div className="flex items-center gap-2.5">
            {paso === 'carrito' ? <IconoCarrito className="text-verde" /> : null}
            <h2 className="font-serif text-xl font-semibold text-verde">
              {paso === 'carrito' ? 'Tu pedido' : 'Datos de entrega'}
            </h2>
          </div>
          <button
            type="button"
            onClick={cerrar}
            className="rounded-full p-2 text-tinta-suave transition-colors hover:bg-verde-suave hover:text-verde"
            aria-label="Cerrar"
          >
            <IconoCerrar />
          </button>
        </header>

        {paso === 'carrito' ? (
          <>
            {vacio ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <span className="rounded-full bg-verde-suave p-4 text-verde">
                  <IconoCarrito width={28} height={28} />
                </span>
                <p className="font-serif text-lg text-verde">Tu carrito está vacío</p>
                <p className="text-sm text-tinta-suave">
                  Elegí un acompañamiento y empieza a armar tu pedido.
                </p>
              </div>
            ) : (
              <ul className="scrollbar-slim flex-1 divide-y divide-crema-oscuro overflow-y-auto px-5">
                {productosEnCarrito.map((item) => (
                  <li key={`${item.productoId}-${item.reserva}`} className="flex gap-3.5 py-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-crema-profundo bg-crema-oscuro">
                      <ImagenProducto producto={item.producto} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-verde">{item.producto.nombre}</p>
                      <p className="text-xs text-tinta-suave">
                        {item.producto.presentacion}
                        {item.reserva && (
                          <span className="ml-1.5 font-semibold text-rojo">
                            · reserva próximo lote
                          </span>
                        )}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-crema-profundo bg-crema">
                          <button
                            type="button"
                            onClick={() =>
                              cambiarCantidad(item.productoId, item.cantidad - 1, item.reserva)
                            }
                            className="p-1.5 text-tinta-suave hover:text-verde"
                            aria-label="Restar uno"
                          >
                            <IconoMenos width={14} height={14} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold text-verde">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (!item.reserva && item.cantidad >= item.producto.stock) return
                              cambiarCantidad(item.productoId, item.cantidad + 1, item.reserva)
                            }}
                            className="p-1.5 text-tinta-suave hover:text-verde disabled:opacity-30"
                            aria-label="Sumar uno"
                            disabled={!item.reserva && item.cantidad >= item.producto.stock}
                          >
                            <IconoMas width={14} height={14} />
                          </button>
                        </div>
                        <PrecioProducto
                          producto={item.producto}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminar(item.productoId, item.reserva)}
                      className="self-start p-1 text-tinta-suave/60 transition-colors hover:text-rojo"
                      aria-label={`Quitar ${item.producto.nombre}`}
                    >
                      <IconoCerrar width={16} height={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!vacio && (
              <footer className="border-t border-crema-profundo px-5 py-4">
                <div className="mb-1 flex items-center justify-between text-sm text-tinta-suave">
                  <span>Total aproximado</span>
                  <span className="font-serif text-2xl font-semibold text-verde">
                    {precio(totalCarrito)}
                  </span>
                </div>
                <p className="mb-3.5 text-xs text-tinta-suave">
                  Sin pago online. Confirmamos disponibilidad, envío y forma de pago por WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setPaso('datos')}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio"
                >
                  Continuar
                </button>
              </footer>
            )}
          </>
        ) : (
          <>
            <div className="scrollbar-slim flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
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
                    {MARCA.zonasEntrega.map((z) => (
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

                <div className="rounded-2xl border border-crema-profundo bg-crema-oscuro/60 p-4">
                  <p className="eyebrow mb-2.5 text-tinta-suave">Resumen</p>
                  <ul className="space-y-1.5 text-sm text-tinta">
                    {productosEnCarrito.map((i) => (
                      <li key={`${i.productoId}-${i.reserva}`} className="flex justify-between gap-3">
                        <span className="min-w-0 flex-1 truncate text-tinta-suave">
                          {i.cantidad} × {i.producto.nombre}
                          {i.reserva && <em className="text-rojo"> (reserva)</em>}
                        </span>
                        <span className="shrink-0 font-medium">
                          {precio(i.producto.precio * i.cantidad)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-crema-profundo pt-3">
                    <span className="eyebrow text-tinta-suave">Total</span>
                    <span className="font-serif text-xl font-semibold text-verde">
                      {precio(totalCarrito)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <footer className="border-t border-crema-profundo px-5 py-4">
              <button
                type="button"
                onClick={enviar}
                disabled={!form.nombre.trim()}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconoWhatsapp width={18} height={18} />
                Enviar pedido por WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setPaso('carrito')}
                className="mt-2 w-full py-2 text-xs text-tinta-suave underline-offset-4 hover:underline"
              >
                Volver al carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder,
  multilinea,
  requerido,
}: {
  etiqueta: string
  valor: string
  onChange: (v: string) => void
  placeholder?: string
  multilinea?: boolean
  requerido?: boolean
}) {
  const clases =
    'w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-3 text-sm text-tinta transition-colors placeholder:text-tinta-suave/50 focus:border-verde-claro'
  return (
    <div>
      <label className="eyebrow mb-1.5 block text-tinta-suave">
        {etiqueta}
        {requerido && <span className="ml-1 text-rojo">*</span>}
      </label>
      {multilinea ? (
        <textarea
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${clases} resize-none`}
        />
      ) : (
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={clases}
        />
      )}
    </div>
  )
}

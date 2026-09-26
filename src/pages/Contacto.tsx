import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconoCheck,
  IconoReloj,
  IconoUbicacion,
  IconoWhatsapp,
} from '@/components/Iconos'
import { MARCA, precio } from '@/lib/config'
import { linkWhatsApp, mensajeConsultaSimple } from '@/lib/whatsapp'
import { useTienda } from '@/store/tienda'

export function Contacto() {
  const { productos, enCarrito, agregar } = useTienda()
  const [form, setForm] = useState<{
    nombre: string
    telefono: string
    tipo: string
    mensaje: string
    zona: string
  }>({
    nombre: '',
    telefono: '',
    tipo: 'Consulta sobre un producto',
    mensaje: '',
    zona: MARCA.zonasEntrega[0],
  })

  const agotados = productos.filter((p) => p.activo && p.stock === 0)
  const proximosLotes = agotados.slice(0, 4)

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const texto = [
      `Hola ${MARCA.nombre}! 👋 Te escribo desde la web.`,
      '',
      `*Nombre:* ${form.nombre || '(a completar)'}`,
      form.telefono ? `*Teléfono:* ${form.telefono}` : null,
      `*Zona:* ${form.zona}`,
      `*Motivo:* ${form.tipo}`,
      '',
      form.mensaje || 'Quisiera recibir más información.',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(linkWhatsApp(encodeURIComponent(texto)), '_blank', 'noopener')
  }

  return (
    <div className="container-disfruta py-12">
      <header className="max-w-3xl">
        <p className="eyebrow text-dorado">Hablemos</p>
        <h1 className="mt-2.5 font-serif text-4xl leading-tight font-bold text-balance text-verde sm:text-5xl">
          Contacto y entregas
        </h1>
        <p className="mt-4 leading-relaxed text-tinta-suave">
          La forma más rápida de resolver un pedido es WhatsApp: escribinos y te respondemos en
          el momento. También podés pasar por el taller con un buen mate encima.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <a
            href={linkWhatsApp(mensajeConsultaSimple('un pedido'))}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-verde bg-verde p-6 text-crema transition-colors hover:bg-verde-medio"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-crema/15">
              <IconoWhatsapp width={24} height={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-lg font-semibold">WhatsApp</span>
              <span className="block text-sm text-crema/75">{MARCA.whatsappLegible}</span>
            </span>
            <span className="text-sm font-semibold text-dorado-claro">Escribir</span>
          </a>

          <div className="grid gap-4 sm:grid-cols-2">
            <Tarjeta
              icono={<IconoReloj width={20} height={20} />}
              titulo="Horarios"
              texto={MARCA.horarios}
            />
            <Tarjeta
              icono={<IconoUbicacion width={20} height={20} />}
              titulo="Entregas"
              texto={MARCA.zonasEntrega[0]}
            />
          </div>

          <div className="rounded-2xl border border-crema-profundo bg-white p-6">
            <h2 className="font-serif text-xl font-semibold text-verde">Zonas de entrega</h2>
            <ul className="mt-3.5 space-y-2.5">
              {MARCA.zonasEntrega.map((z, i) => (
                <li key={z} className="flex items-start gap-2.5 text-sm text-tinta-suave">
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-verde-suave text-verde">
                    <IconoCheck width={11} height={11} />
                  </span>
                  {z}
                  {i === 0 && (
                    <span className="ml-auto shrink-0 rounded-full bg-verde-suave px-2 py-0.5 text-[0.65rem] font-semibold text-verde">
                      Zona principal
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-crema-oscuro pt-3.5 text-xs leading-relaxed text-tinta-suave">
              El costo de envío se calcula según la zona y el volumen del pedido. Lo confirmamos
              por WhatsApp antes de preparar nada. Para pedidos grandes o eventos, escribinos
              antes y te armamos una propuesta.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-crema-profundo bg-white p-6 shadow-suave sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-verde">Escribinos un mensaje</h2>
          <p className="mt-2 text-sm text-tinta-suave">
            Completá el formulario y se abre WhatsApp con tu consulta ya escrita.
          </p>

          <form onSubmit={enviar} className="mt-6 space-y-4">
            <Campo
              id="nombre"
              etiqueta="Nombre y apellido"
              valor={form.nombre}
              onChange={(v) => setForm({ ...form, nombre: v })}
              placeholder="¿Cómo te llamás?"
              requerido
            />
            <Campo
              id="telefono"
              etiqueta="Teléfono"
              valor={form.telefono}
              onChange={(v) => setForm({ ...form, telefono: v })}
              placeholder="11 5555 0000"
            />
            <div>
              <label htmlFor="tipo" className="eyebrow mb-1.5 block text-tinta-suave">
                Motivo de la consulta
              </label>
              <select
                id="tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full rounded-xl border border-crema-profundo bg-crema px-3.5 py-3 text-sm text-tinta focus:border-verde-claro"
              >
                {[
                  'Consulta sobre un producto',
                  'Quiero hacer un pedido',
                  'Reservar el próximo lote',
                  'Pedido para un evento o empresa',
                  'Distribución y ventas mayoristas',
                  'Otro',
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="zona" className="eyebrow mb-1.5 block text-tinta-suave">
                Zona de entrega
              </label>
              <select
                id="zona"
                value={form.zona}
                onChange={(e) => setForm({ ...form, zona: e.target.value })}
                className="w-full rounded-xl border border-crema-profundo bg-crema px-3.5 py-3 text-sm text-tinta focus:border-verde-claro"
              >
                {MARCA.zonasEntrega.map((z) => (
                  <option key={z}>{z}</option>
                ))}
                <option>Otro / a coordinar</option>
              </select>
            </div>
            <div>
              <label htmlFor="mensaje" className="eyebrow mb-1.5 block text-tinta-suave">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                rows={5}
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                placeholder="Contanos qué necesitás, para cuándo y cuántos serían."
                className="w-full resize-none rounded-xl border border-crema-profundo bg-crema px-3.5 py-3 text-sm text-tinta placeholder:text-tinta-suave/50 focus:border-verde-claro"
              />
            </div>
            <button
              type="submit"
              disabled={!form.nombre.trim()}
              className="flex w-full items-center justify-center gap-2.5 rounded-full bg-verde px-6 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio disabled:opacity-40"
            >
              <IconoWhatsapp width={18} height={18} />
              Enviar por WhatsApp
            </button>
            <p className="text-center text-xs text-tinta-suave">
              No usamos pasarela de pagos: confirmamos stock, envío y forma de pago por chat.
            </p>
          </form>
        </div>
      </div>

      {proximosLotes.length > 0 && (
        <section className="mt-16 rounded-2xl border border-dorado/30 bg-dorado-suave/40 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-dorado">Reservas abiertas</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-verde">
                Estos productos están sin stock
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-tinta-suave">
                Podés reservar tu frasco del próximo lote. Te avisamos por WhatsApp apenas esté
                listo, sin compromiso de pago.
              </p>
            </div>
            <Link
              to="/catalogo"
              className="rounded-full border border-verde px-5 py-2.5 text-sm font-semibold text-verde transition-colors hover:bg-verde hover:text-crema"
            >
              Ver catálogo completo
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {proximosLotes.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3.5 rounded-xl border border-crema-profundo bg-white px-4 py-3"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-verde">{p.nombre}</span>
                  <span className="text-xs text-tinta-suave">
                    {p.presentacion} · {precio(p.precio)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => agregar(p.id, 1, true)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    enCarrito(p.id)
                      ? 'bg-verde-suave text-verde'
                      : 'bg-verde text-crema hover:bg-verde-medio'
                  }`}
                >
                  {enCarrito(p.id) ? 'Reservado' : 'Reservar'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold text-verde">Preguntas frecuentes</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-crema-profundo bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 font-serif text-lg font-semibold text-verde">
                {f.q}
                <span className="text-tinta-suave transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-tinta-suave">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}

const FAQ = [
  {
    q: '¿Puedo pagar por la web?',
    a: 'No usamos pasarela de pagos. Armás tu carrito, nos mandás el pedido por WhatsApp y te confirmamos disponibilidad, envío y forma de pago (efectivo, transferencia o el medio que te quede cómodo).',
  },
  {
    q: '¿Cuánto duran los frascos?',
    a: 'Cada producto tiene un tiempo de curado distinto. Por eso en la ficha de cada uno figura el lote, la fecha de elaboración y la fecha recomendada de consumo. Si tenés dudas, escribinos con el número de lote.',
  },
  {
    q: '¿Qué pasa si un producto está sin stock?',
    a: 'Podés reservar el próximo lote desde la ficha del producto. No se cobra nada por adelantado: te avisamos por WhatsApp cuando esté listo y ahí confirmás o cancelás.',
  },
  {
    q: '¿Hacen pedidos para empresas y eventos?',
    a: 'Sí. Trabajamos con empresas, clubes y eventos. Escribinos por el formulario o por WhatsApp contándonos cantidades y fecha, y te armamos una propuesta con descuento por volumen.',
  },
  {
    q: '¿Puedo devolver un frasco?',
    a: 'Por tratarse de un alimento elaborado y con fecha de consumo, no aceptamos devoluciones de productos abiertos. Si algo llegó con un problema o roto, lo resolvemos sin discusión: escribinos con una foto.',
  },
  {
    q: '¿Conservación?',
    a: 'Los productos sin ácido se conservan en lugar fresco y seco. Una vez abiertos, la mayoría va a heladera. Cada frasco lo indica en la etiqueta, y la ficha del producto en la web lo repite.',
  },
]

function Tarjeta({
  icono,
  titulo,
  texto,
  href,
}: {
  icono: React.ReactNode
  titulo: string
  texto: string
  href?: string
}) {
  const contenido = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-suave text-verde">
        {icono}
      </span>
      <span className="min-w-0">
        <span className="block text-xs tracking-wide text-tinta-suave uppercase">{titulo}</span>
        <span className="mt-0.5 block truncate text-sm font-semibold text-verde">{texto}</span>
      </span>
    </>
  )
  return href ? (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl border border-crema-profundo bg-white p-4 transition-colors hover:border-verde"
    >
      {contenido}
    </a>
  ) : (
    <div className="flex items-center gap-3 rounded-2xl border border-crema-profundo bg-white p-4">
      {contenido}
    </div>
  )
}

function Campo({
  id,
  etiqueta,
  valor,
  onChange,
  placeholder,
  requerido,
}: {
  id: string
  etiqueta: string
  valor: string
  onChange: (v: string) => void
  placeholder?: string
  requerido?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-1.5 block text-tinta-suave">
        {etiqueta}
        {requerido && <span className="ml-1 text-rojo">*</span>}
      </label>
      <input
        id={id}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-crema-profundo bg-crema px-3.5 py-3 text-sm text-tinta placeholder:text-tinta-suave/50 focus:border-verde-claro"
      />
    </div>
  )
}

import { Head, Link, router } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'
import { MONEDA, fecha } from '@/lib/config'
import { BotonAdmin, EnlaceAdmin } from '@/components/BotonAdmin'

export default function PromocionesIndex({ promociones, tipos }) {
  const nombreTipo = Object.fromEntries(tipos.map((t) => [t.id, t.nombre]))

  const eliminar = (p) => {
    if (!confirm(`¿Eliminar la promoción "${p.titulo}"?`)) return
    router.delete(`/admin/promociones/${p.id}`, { preserveScroll: true })
  }

  const alternar = (p) =>
    router.patch(
      `/admin/promociones/${p.id}/alternar`,
      { activa: !p.activa },
      { preserveScroll: true },
    )

  return (
    <>
      <Head title="Promociones" />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Promociones</h1>
          <p className="mt-1 text-sm text-tinta-suave">
            Los descuentos se muestran en la home y la ficha de producto. Sin pasarela de pago: el
            cliente coordina por WhatsApp.
          </p>
        </div>
        <Link
          href="/admin/promociones/create"
          className="rounded-full bg-verde px-5 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
        >
          + Nueva promoción
        </Link>
      </header>

      {promociones.length === 0 ? (
        <TarjetaAdmin>
          <p className="py-10 text-center text-sm text-tinta-suave">
            Todavía no hay promociones cargadas.
          </p>
        </TarjetaAdmin>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {promociones.map((p) => (
            <li key={p.id} className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-serif text-lg font-bold text-verde">{p.titulo}</h2>
                  <p className="mt-1 text-sm text-tinta-suave">{p.descripcion}</p>
                </div>
                <span className="shrink-0 rounded-full bg-dorado px-3 py-1 font-serif text-sm font-bold text-verde">
                  -{p.descuento}%
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="tracking-wide text-tinta-suave uppercase">Tipo</dt>
                  <dd className="mt-0.5 font-medium text-tinta">{nombreTipo[p.tipo] ?? p.tipo}</dd>
                </div>
                <div>
                  <dt className="tracking-wide text-tinta-suave uppercase">Productos</dt>
                  <dd className="mt-0.5 font-medium text-tinta">{p.productos_total}</dd>
                </div>
                <div>
                  <dt className="tracking-wide text-tinta-suave uppercase">Desde</dt>
                  <dd className="mt-0.5 font-medium text-tinta">{fecha(p.vigente_desde)}</dd>
                </div>
                <div>
                  <dt className="tracking-wide text-tinta-suave uppercase">Hasta</dt>
                  <dd className="mt-0.5 font-medium text-tinta">
                    {p.vigente_hasta ? fecha(p.vigente_hasta) : 'Sin límite'}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-crema-oscuro pt-4">
                <span
                  className={`eyebrow rounded-full px-2.5 py-1 ${
                    p.vigente
                      ? 'bg-verde text-crema'
                      : p.activa
                        ? 'bg-crema-profundo text-tinta-suave'
                        : 'bg-rojo text-crema'
                  }`}
                >
                  {p.vigente ? 'Vigente' : p.activa ? 'Fuera de fecha' : 'Inactiva'}
                </span>

                <div className="ml-auto flex items-center gap-1.5">
                  <BotonAdmin variante="contorno" onClick={() => alternar(p)}>
                    {p.activa ? 'Desactivar' : 'Activar'}
                  </BotonAdmin>
                  <EnlaceAdmin variante="primario" href={`/admin/promociones/${p.id}/edit`}>
                    Editar
                  </EnlaceAdmin>
                  <BotonAdmin variante="peligro" onClick={() => eliminar(p)}>
                    Eliminar
                  </BotonAdmin>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs text-tinta-suave">
        Tipos disponibles: {tipos.map((t) => t.nombre).join(' · ')}. El precio final se
        calcula en {MONEDA.simbolo} sobre el precio del producto menos el porcentaje.
      </p>
    </>
  )
}

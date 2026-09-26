import { useState } from 'react'
import { TarjetaAdmin } from '@/admin/AdminLayout'
import { IconoCerrar, IconoMas } from '@/components/Iconos'
import { ImagenProducto } from '@/components/ProductoUI'
import { fecha, precio } from '@/lib/config'
import type { Promocion } from '@/types'
import { useTienda } from '@/store/tienda'

const TIPOS: { id: Promocion['tipo']; nombre: string }[] = [
  { id: 'oferta', nombre: 'Oferta' },
  { id: 'combo', nombre: 'Combo' },
  { id: 'temporada', nombre: 'Temporada' },
  { id: 'limitado', nombre: 'Edición limitada' },
]

function nueva(): Promocion {
  return {
    id: `pr-${Date.now()}`,
    titulo: '',
    descripcion: '',
    tipo: 'oferta',
    descuento: 10,
    productosIds: [],
    activa: true,
    vigente: new Date().toISOString().slice(0, 10),
  }
}

export function AdminPromociones() {
  const { datos, productos, guardarPromocion, eliminarPromocion, guardarProducto } = useTienda()
  const [editando, setEditando] = useState<Promocion | null>(null)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-verde">Promociones</h1>
          <p className="mt-1.5 text-sm text-tinta-suave">
            {datos.promociones.length} promociones ·{' '}
            {datos.promociones.filter((p) => p.activa).length} activas
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditando(nueva())}
          className="inline-flex items-center gap-2 rounded-full bg-verde px-5 py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio"
        >
          <IconoMas width={16} height={16} />
          Crear promoción
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        {TIPOS.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-crema-profundo bg-white p-5 shadow-suave"
          >
            <p className="eyebrow text-tinta-suave">{t.nombre}</p>
            <p className="mt-2 font-serif text-2xl font-bold text-verde">
              {datos.promociones.filter((p) => p.tipo === t.id).length}
            </p>
          </div>
        ))}
      </div>

      <TarjetaAdmin titulo="Promociones cargadas">
        {datos.promociones.length === 0 ? (
          <p className="py-8 text-center text-sm text-tinta-suave">
            No hay promociones. Creá la primera.
          </p>
        ) : (
          <ul className="divide-y divide-crema-oscuro">
            {datos.promociones.map((promo) => {
              const prod = productos.find((p) => p.id === promo.productosIds[0])
              return (
                <li key={promo.id} className="flex flex-wrap items-center gap-4 py-4">
                  {prod ? (
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-crema-oscuro">
                      <ImagenProducto producto={prod} />
                    </span>
                  ) : (
                    <span className="h-14 w-14 shrink-0 rounded-xl bg-crema-oscuro" />
                  )}

                  <div className="min-w-40 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-base font-semibold text-verde">{promo.titulo}</p>
                      <span className="eyebrow rounded-full bg-verde-suave px-2 py-0.5 text-verde">
                        {TIPOS.find((t) => t.id === promo.tipo)?.nombre}
                      </span>
                      {!promo.activa && (
                        <span className="eyebrow rounded-full bg-crema-profundo px-2 py-0.5 text-tinta-suave">
                          Pausada
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-tinta-suave">{promo.descripcion}</p>
                    <p className="mt-1 text-xs text-tinta-suave">
                      {prod?.nombre ?? 'Sin producto asignado'} · vigente hasta{' '}
                      {fecha(promo.vigente)}
                      {promo.descuento > 0 && ` · -${promo.descuento}%`}
                    </p>
                  </div>

                  {prod && promo.descuento > 0 && (
                    <span className="shrink-0 text-right">
                      <span className="block text-xs text-tinta-suave line-through">
                        {precio(prod.precioAntes ?? Math.round(prod.precio / (1 - promo.descuento / 100)))}
                      </span>
                      <span className="block font-serif text-base font-bold text-rojo">
                        {precio(Math.round(prod.precio * (1 - promo.descuento / 100)))}
                      </span>
                    </span>
                  )}

                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => guardarPromocion({ ...promo, activa: !promo.activa })}
                      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        promo.activa
                          ? 'border-crema-profundo text-tinta-suave hover:border-dorado hover:text-dorado'
                          : 'border-verde text-verde hover:bg-verde hover:text-crema'
                      }`}
                    >
                      {promo.activa ? 'Pausar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditando(promo)}
                      className="rounded-full bg-verde px-3.5 py-2 text-xs font-semibold text-crema transition-colors hover:bg-verde-medio"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarPromocion(promo.id)}
                      className="rounded-full border border-crema-profundo px-3.5 py-2 text-xs font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </TarjetaAdmin>

      <TarjetaAdmin
        titulo="Descuentos directos por producto"
        subtitulo="Alternativa simple al precio tachado"
      >
        <ul className="divide-y divide-crema-oscuro">
          {productos
            .filter((p) => p.precioAntes)
            .map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-4 py-3">
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-crema-oscuro">
                  <ImagenProducto producto={p} />
                </span>
                <span className="min-w-40 flex-1 text-sm font-semibold text-verde">{p.nombre}</span>
                <span className="text-xs text-tinta-suave line-through">
                  {precio(p.precioAntes!)}
                </span>
                <span className="font-serif font-bold text-verde">{precio(p.precio)}</span>
                <button
                  type="button"
                  onClick={() => guardarProducto({ ...p, precioAntes: undefined })}
                  className="rounded-full border border-crema-profundo px-3.5 py-2 text-xs font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
                >
                  Quitar descuento
                </button>
              </li>
            ))}
        </ul>
        {productos.filter((p) => p.precioAntes).length === 0 && (
          <p className="py-6 text-center text-sm text-tinta-suave">
            Ningún producto tiene precio tachado. Cargalo desde la edición del producto.
          </p>
        )}
      </TarjetaAdmin>

      {editando && (
        <FormularioPromocion
          promo={editando}
          onCerrar={() => setEditando(null)}
          onGuardar={(p) => {
            guardarPromocion(p)
            setEditando(null)
          }}
        />
      )}
    </div>
  )
}

function FormularioPromocion({
  promo,
  onGuardar,
  onCerrar,
}: {
  promo: Promocion
  onGuardar: (p: Promocion) => void
  onCerrar: () => void
}) {
  const { productos } = useTienda()
  const [p, setP] = useState(promo)

  return (
    <div className="fixed inset-0 z-70 flex items-start justify-center overflow-y-auto p-0 sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="animar-aparece fixed inset-0 bg-tinta/50"
      />
      <div className="animar-desliza relative my-0 w-full max-w-xl bg-crema shadow-flotante sm:my-8">
        <header className="flex items-center justify-between border-b border-crema-profundo px-5 py-4">
          <h2 className="font-serif text-xl font-semibold text-verde">
            {p.titulo ? `Editar: ${p.titulo}` : 'Nueva promoción'}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full p-2 text-tinta-suave hover:bg-verde-suave hover:text-verde"
            aria-label="Cerrar"
          >
            <IconoCerrar />
          </button>
        </header>

        <div className="space-y-4 p-5">
          <label className="block">
            <span className="eyebrow mb-1.5 block text-tinta-suave">Título</span>
            <input
              value={p.titulo}
              onChange={(e) => setP({ ...p, titulo: e.target.value })}
              placeholder="Oferta · Cebolla Morada"
              className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="eyebrow mb-1.5 block text-tinta-suave">Descripción</span>
            <textarea
              rows={3}
              value={p.descripcion}
              onChange={(e) => setP({ ...p, descripcion: e.target.value })}
              className="w-full resize-none rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Tipo</span>
              <select
                value={p.tipo}
                onChange={(e) => setP({ ...p, tipo: e.target.value as Promocion['tipo'] })}
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              >
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Descuento %</span>
              <input
                type="number"
                min={0}
                max={90}
                value={p.descuento}
                onChange={(e) =>
                  setP({ ...p, descuento: Math.max(0, Math.min(90, Number(e.target.value))) })
                }
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              />
            </label>

            <label className="block">
              <span className="eyebrow mb-1.5 block text-tinta-suave">Vigente hasta</span>
              <input
                type="date"
                value={p.vigente}
                onChange={(e) => setP({ ...p, vigente: e.target.value })}
                className="w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm"
              />
            </label>
          </div>

          <div>
            <span className="eyebrow mb-2 block text-tinta-suave">Producto asociado</span>
            <div className="grid max-h-64 gap-1.5 overflow-y-auto rounded-xl border border-crema-profundo bg-white p-2 sm:grid-cols-2">
              {productos.map((prod) => {
                const activo = p.productosIds.includes(prod.id)
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() =>
                      setP({
                        ...p,
                        productosIds: activo
                          ? p.productosIds.filter((x) => x !== prod.id)
                          : [prod.id, ...p.productosIds],
                      })
                    }
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      activo ? 'bg-verde text-crema' : 'text-tinta hover:bg-crema-oscuro'
                    }`}
                  >
                    <span className="h-8 w-8 shrink-0 overflow-hidden rounded">
                      <ImagenProducto producto={prod} />
                    </span>
                    <span className="min-w-0 flex-1 truncate">{prod.nombre}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <footer className="flex gap-3 border-t border-crema-profundo px-5 py-4">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 rounded-full border border-crema-profundo py-3 text-sm font-semibold text-tinta-suave"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onGuardar(p)}
            disabled={!p.titulo.trim()}
            className="flex-1 rounded-full bg-verde py-3 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-40"
          >
            Guardar promoción
          </button>
        </footer>
      </div>
    </div>
  )
}

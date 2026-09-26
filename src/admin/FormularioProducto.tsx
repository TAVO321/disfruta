import { useState } from 'react'
import { IconoCamara, IconoCerrar, IconoEtiqueta } from '@/components/Iconos'
import { CATEGORIAS, NIVELES_PICANTE, PLATOS, fecha } from '@/lib/config'
import type { CategoriaId, Lote, NivelPicante, Presentacion, Producto } from '@/types'
import { useTienda } from '@/store/tienda'

const PRESENTACIONES: Presentacion[] = [
  'Frasco 220 g',
  'Frasco 350 g',
  'Frasco 500 g',
  'Frasco 1 kg',
  'Pack x3',
  'Pack x6',
]

const TONOS = {
  cebolla: { fondo: '#EFE3CC', contenido: '#C9A0D6', acento: '#8E4FA8', tapa: '#1F3D2B' },
  escabeche: { fondo: '#F2E2CB', contenido: '#C8452F', acento: '#8E2A1B', tapa: '#1F3D2B' },
  uchu: { fondo: '#F0DFC4', contenido: '#D9741F', acento: '#A4500F', tapa: '#2D5439' },
  picante: { fondo: '#F5DEC9', contenido: '#B23434', acento: '#7E1F1F', tapa: '#1F3D2B' },
  ajo: { fondo: '#EDE6D2', contenido: '#E5D6A8', acento: '#B49A5A', tapa: '#1F3D2B' },
  verde: { fondo: '#E2E9DE', contenido: '#5E8C4E', acento: '#2D5439', tapa: '#C89B3C' },
  dorado: { fondo: '#F4EAD4', contenido: '#E0B869', acento: '#A87A22', tapa: '#1F3D2B' },
  mixto: { fondo: '#E9E0CE', contenido: '#B4623A', acento: '#7A3A1E', tapa: '#1F3D2B' },
}

export function productoVacio(): Producto {
  return {
    id: `p-${Date.now()}`,
    nombre: '',
    categoria: 'encurtidos',
    precio: 12000,
    descripcionCorta: '',
    descripcion: '',
    presentacion: 'Frasco 350 g',
    nivelPicante: 'suave',
    stock: 0,
    stockMinimo: 5,
    activo: true,
    destacado: false,
    limitado: false,
    temporada: false,
    combo: false,
    peso: 350,
    ingredientes: [],
    recommendedPlatos: [],
    recomendacionConsumo: '',
    conservacion: 'Conservar en lugar fresco y seco. Una vez abierto, refrigerar.',
    lotes: [],
    gallery: [],
    tono: TONOS.cebolla,
    creado: new Date().toISOString().slice(0, 10),
  }
}

export function FormularioProducto({
  producto,
  onCerrar,
}: {
  producto: Producto
  onCerrar: () => void
}) {
  const { guardarProducto } = useTienda()
  const [p, setP] = useState<Producto>(producto)
  const [nuevoLote, setNuevoLote] = useState<Lote>({
    id: `l-${Date.now()}`,
    codigo: '',
    fechaElaboracion: new Date().toISOString().slice(0, 10),
    fechaConsumoRecomendado: '',
    cantidad: 0,
    restante: 0,
  })
  const [errores, setErrores] = useState<string[]>([])

  const cambiar = <K extends keyof Producto>(campo: K, valor: Producto[K]) =>
    setP((actual) => ({ ...actual, [campo]: valor }))

  const guardar = (e: React.FormEvent) => {
    e.preventDefault()
    const faltantes: string[] = []
    if (!p.nombre.trim()) faltantes.push('El nombre es obligatorio.')
    if (p.precio <= 0) faltantes.push('El precio tiene que ser mayor a cero.')
    if (!p.descripcionCorta.trim()) faltantes.push('Falta la descripción corta.')
    if (p.ingredientes.length === 0) faltantes.push('Cargá al menos un ingrediente.')
    setErrores(faltantes)
    if (faltantes.length) return

    guardarProducto({
      ...p,
      nombre: p.nombre.trim(),
      peso: p.presentacion.match(/(\d+)\s*g/)?.[1]
        ? Number(p.presentacion.match(/(\d+)\s*g/)![1])
        : p.peso,
    })
    onCerrar()
  }

  const subirFoto = (archivo: File, indice: number | 'nueva') => {
    const lector = new FileReader()
    lector.onload = () => {
      const data = String(lector.result)
      if (indice === 'nueva') cambiar('gallery', [...p.gallery, data])
      else cambiar('gallery', p.gallery.map((f, i) => (i === indice ? data : f)))
    }
    lector.readAsDataURL(archivo)
  }

  return (
    <div className="fixed inset-0 z-70 flex items-start justify-center overflow-y-auto p-0 sm:p-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="animar-aparece fixed inset-0 bg-tinta/50"
      />
      <form
        onSubmit={guardar}
        className="animar-desliza relative my-0 w-full max-w-3xl bg-crema shadow-flotante sm:my-8"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-crema-profundo bg-crema px-5 py-4">
          <h2 className="font-serif text-xl font-semibold text-verde">
            {p.nombre ? `Editar: ${p.nombre}` : 'Nuevo producto'}
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

        <div className="space-y-6 p-5 sm:p-6">
          {errores.length > 0 && (
            <div className="rounded-xl border border-rojo/30 bg-rojo-suave p-4">
              <p className="text-sm font-semibold text-rojo">Faltan datos:</p>
              <ul className="mt-1.5 list-inside list-disc text-sm text-rojo">
                {errores.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre" requerido>
              <input
                value={p.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)}
                placeholder="Cebolla Morada Encurtida"
                className={inputClases}
              />
            </Campo>

            <Campo etiqueta="Categoría">
              <select
                value={p.categoria}
                onChange={(e) => cambiar('categoria', e.target.value as CategoriaId)}
                className={inputClases}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo etiqueta="Precio (Bs)" requerido>
              <input
                type="number"
                min={0}
                value={p.precio}
                onChange={(e) => cambiar('precio', Number(e.target.value))}
                className={inputClases}
              />
            </Campo>

            <Campo etiqueta="Precio tachado (opcional)">
              <input
                type="number"
                min={0}
                value={p.precioAntes ?? ''}
                onChange={(e) =>
                  cambiar('precioAntes', e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="Sin tachado"
                className={inputClases}
              />
            </Campo>

            <Campo etiqueta="Presentación">
              <select
                value={p.presentacion}
                onChange={(e) => cambiar('presentacion', e.target.value as Presentacion)}
                className={inputClases}
              >
                {PRESENTACIONES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Campo>

            <Campo etiqueta="Nivel de picante">
              <select
                value={p.nivelPicante}
                onChange={(e) => cambiar('nivelPicante', e.target.value as NivelPicante)}
                className={inputClases}
              >
                {NIVELES_PICANTE.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nombre}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo etiqueta="Stock disponible">
              <input
                type="number"
                min={0}
                value={p.stock}
                onChange={(e) => cambiar('stock', Number(e.target.value))}
                className={inputClases}
              />
            </Campo>

            <Campo etiqueta="Alerta de poco stock">
              <input
                type="number"
                min={0}
                value={p.stockMinimo}
                onChange={(e) => cambiar('stockMinimo', Number(e.target.value))}
                className={inputClases}
              />
            </Campo>
          </div>

          <Campo etiqueta="Descripción corta (la que se ve en la tarjeta)">
            <input
              value={p.descripcionCorta}
              onChange={(e) => cambiar('descripcionCorta', e.target.value)}
              placeholder="Crujiente, agridulce y rosada. La reina de la parrilla."
              className={inputClases}
            />
          </Campo>

          <Campo etiqueta="Descripción completa">
            <textarea
              rows={4}
              value={p.descripcion}
              onChange={(e) => cambiar('descripcion', e.target.value)}
              className={`${inputClases} resize-none`}
            />
          </Campo>

          <Campo etiqueta="Recomendación de consumo">
            <textarea
              rows={2}
              value={p.recomendacionConsumo}
              onChange={(e) => cambiar('recomendacionConsumo', e.target.value)}
              placeholder="Ideal para acompañar la carne asada y los choripanes."
              className={`${inputClases} resize-none`}
            />
          </Campo>

          <Campo etiqueta="Conservación">
            <input
              value={p.conservacion}
              onChange={(e) => cambiar('conservacion', e.target.value)}
              className={inputClases}
            />
          </Campo>

          <div>
            <p className="eyebrow mb-2 text-tinta-suave">Ingredientes (uno por línea)</p>
            <textarea
              rows={5}
              value={p.ingredientes.join('\n')}
              onChange={(e) =>
                cambiar(
                  'ingredientes',
                  e.target.value.split('\n').map((x) => x.trim()).filter(Boolean),
                )
              }
              placeholder={'Cebolla morada fresca\nVinagre de alcohol\nSal marina'}
              className={`${inputClases} resize-none`}
            />
          </div>

          <div>
            <p className="eyebrow mb-2 text-tinta-suave">Con qué platos combina</p>
            <div className="flex flex-wrap gap-1.5">
              {PLATOS.map((pl) => {
                const activo = p.recommendedPlatos.includes(pl.id)
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() =>
                      cambiar(
                        'recommendedPlatos',
                        activo
                          ? p.recommendedPlatos.filter((x) => x !== pl.id)
                          : [...p.recommendedPlatos, pl.id],
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      activo
                        ? 'border-verde bg-verde text-crema'
                        : 'border-crema-profundo bg-white text-tinta hover:border-verde'
                    }`}
                  >
                    {pl.emoji} {pl.nombre}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-crema-profundo bg-crema-oscuro/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Interruptor
              etiqueta="Activo en la web"
              valor={p.activo}
              onChange={(v) => cambiar('activo', v)}
            />
            <Interruptor
              etiqueta="Destacado en el inicio"
              valor={p.destacado}
              onChange={(v) => cambiar('destacado', v)}
            />
            <Interruptor
              etiqueta="Edición limitada"
              valor={p.limitado}
              onChange={(v) => cambiar('limitado', v)}
            />
            <Interruptor
              etiqueta="Producto de temporada"
              valor={p.temporada}
              onChange={(v) => cambiar('temporada', v)}
            />
            <Campo etiqueta="Insignia (texto del sello)">
              <input
                value={p.insignia ?? ''}
                onChange={(e) => cambiar('insignia', e.target.value || undefined)}
                placeholder="Más vendido"
                className={inputClases}
              />
            </Campo>
            <Campo etiqueta="Tono de la ilustración">
              <select
                value={Object.entries(TONOS).find(([, v]) => v === p.tono)?.[0] ?? 'cebolla'}
                onChange={(e) =>
                  cambiar('tono', TONOS[e.target.value as keyof typeof TONOS])
                }
                className={inputClases}
              >
                {Object.keys(TONOS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <div>
            <p className="eyebrow mb-2 flex items-center gap-2 text-tinta-suave">
              <IconoCamara width={14} height={14} /> Galería de fotos
            </p>
            <p className="mb-3 text-xs text-tinta-suave">
              Si no cargás ninguna, se muestra la ilustración del frasco. La primera foto es la
              principal.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {p.gallery.map((foto, i) => (
                <div key={i} className="relative">
                  <img src={foto} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  <div className="absolute inset-x-1 bottom-1 flex gap-1">
                    <label className="flex-1 cursor-pointer rounded-md bg-white/90 py-1 text-center text-[0.6rem] font-semibold text-verde">
                      Cambiar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && subirFoto(e.target.files[0], i)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        cambiar('gallery', p.gallery.filter((_, x) => x !== i))
                      }
                      className="rounded-md bg-rojo/90 px-2 py-1 text-[0.6rem] font-semibold text-white"
                    >
                      Sacar
                    </button>
                  </div>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-crema-profundo bg-white text-tinta-suave transition-colors hover:border-verde hover:text-verde">
                <IconoCamara width={20} height={20} />
                <span className="text-[0.65rem] font-semibold">Agregar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && subirFoto(e.target.files[0], 'nueva')}
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-dorado/30 bg-dorado-suave/40 p-4">
            <p className="eyebrow mb-3 flex items-center gap-2 text-dorado">
              <IconoEtiqueta width={14} height={14} /> Registrar lote de producción
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Campo etiqueta="Código de lote">
                <input
                  value={nuevoLote.codigo}
                  onChange={(e) => setNuevoLote({ ...nuevoLote, codigo: e.target.value })}
                  placeholder="CM-2609-C"
                  className={inputClases}
                />
              </Campo>
              <Campo etiqueta="Fecha de elaboración">
                <input
                  type="date"
                  value={nuevoLote.fechaElaboracion}
                  onChange={(e) => setNuevoLote({ ...nuevoLote, fechaElaboracion: e.target.value })}
                  className={inputClases}
                />
              </Campo>
              <Campo etiqueta="Consumo recomendado">
                <input
                  type="date"
                  value={nuevoLote.fechaConsumoRecomendado}
                  onChange={(e) =>
                    setNuevoLote({ ...nuevoLote, fechaConsumoRecomendado: e.target.value })
                  }
                  className={inputClases}
                />
              </Campo>
              <Campo etiqueta="Unidades del lote">
                <input
                  type="number"
                  min={0}
                  value={nuevoLote.cantidad}
                  onChange={(e) =>
                    setNuevoLote({ ...nuevoLote, cantidad: Number(e.target.value) })
                  }
                  className={inputClases}
                />
              </Campo>
            </div>
            <button
              type="button"
              disabled={!nuevoLote.codigo || !nuevoLote.fechaConsumoRecomendado}
              onClick={() => {
                cambiar('lotes', [
                  { ...nuevoLote, restante: nuevoLote.cantidad },
                  ...p.lotes,
                ])
                cambiar('stock', p.stock + nuevoLote.cantidad)
                setNuevoLote({
                  id: `l-${Date.now()}`,
                  codigo: '',
                  fechaElaboracion: new Date().toISOString().slice(0, 10),
                  fechaConsumoRecomendado: '',
                  cantidad: 0,
                  restante: 0,
                })
              }}
              className="mt-3 rounded-full bg-verde px-5 py-2.5 text-xs font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-40"
            >
              + Agregar este lote al producto
            </button>

            {p.lotes.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-dorado/25 pt-4">
                {p.lotes.map((l) => (
                  <li
                    key={l.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 text-xs"
                  >
                    <strong className="text-verde">{l.codigo}</strong>
                    <span className="text-tinta-suave">
                      Elaborado {fecha(l.fechaElaboracion)}
                    </span>
                    <span className="text-tinta-suave">
                      Vence {fecha(l.fechaConsumoRecomendado)}
                    </span>
                    <span className={l.restante === 0 ? 'text-rojo' : 'text-verde'}>
                      {l.restante} / {l.cantidad}
                    </span>
                    <button
                      type="button"
                      onClick={() => cambiar('lotes', p.lotes.filter((x) => x.id !== l.id))}
                      className="ml-auto text-tinta-suave hover:text-rojo"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className="sticky bottom-0 flex gap-3 border-t border-crema-profundo bg-crema px-5 py-4">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 rounded-full border border-crema-profundo py-3 text-sm font-semibold text-tinta-suave transition-colors hover:border-rojo hover:text-rojo"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 rounded-full bg-verde py-3 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio"
          >
            Guardar producto
          </button>
        </footer>
      </form>
    </div>
  )
}

const inputClases =
  'w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-sm text-tinta placeholder:text-tinta-suave/50 focus:border-verde-claro'

function Campo({
  etiqueta,
  children,
  requerido,
}: {
  etiqueta: string
  children: React.ReactNode
  requerido?: boolean
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-1.5 block text-tinta-suave">
        {etiqueta}
        {requerido && <span className="ml-1 text-rojo">*</span>}
      </span>
      {children}
    </label>
  )
}

function Interruptor({
  etiqueta,
  valor,
  onChange,
}: {
  etiqueta: string
  valor: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!valor)}
      className="flex items-center gap-2.5 rounded-xl border border-crema-profundo bg-white px-3.5 py-2.5 text-left"
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          valor ? 'bg-verde' : 'bg-crema-profundo'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            valor ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className="text-xs font-medium text-tinta">{etiqueta}</span>
    </button>
  )
}


import { useEffect } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { TarjetaAdmin } from '@/layouts/LayoutAdmin'

export default function AjustesIndex({ ajustes }) {
  const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
    whatsapp: '',
    zonas_entrega: '',
    horario_atencion: '',
    banco: '',
  })

  useEffect(() => {
    for (const a of ajustes) {
      setData(a.clave, a.valor ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ajustes])

  const enviar = (e) => {
    e.preventDefault()
    // La ruta de actualizacion es PUT, no POST.
    put('/admin/ajustes')
  }

  const soloDigitos = /^[0-9]{7,15}$/.test(data.whatsapp)

  return (
    <>
      <Head title="Ajustes" />

      <header className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-verde sm:text-3xl">Ajustes</h1>
        <p className="mt-1 text-sm text-tinta-suave">
          Datos de contacto, entrega y cobro. Se aplican en toda la web al guardar.
        </p>
      </header>

      <form onSubmit={enviar} className="max-w-3xl">
        <TarjetaAdmin
          titulo="Contacto y entrega"
          subtitulo="Estos valores alimentan el pie de pagina, el carrito y los botones de WhatsApp."
        >
          <div className="space-y-5">
            {ajustes.map((ajuste) => (
              <Campo key={ajuste.clave} ajuste={ajuste}>
                {ajuste.clave === 'whatsapp' ? (
                  <>
                    <input
                      value={data.whatsapp}
                      onChange={(e) => setData('whatsapp', e.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="59170000000"
                      className="w-full rounded-xl border border-crema-oscuro bg-crema px-4 py-3 font-mono text-verde focus:border-verde focus:ring-2 focus:ring-verde/20 focus:outline-none"
                    />
                    {data.whatsapp !== '' && (
                      <p className={`mt-2 text-xs ${soloDigitos ? 'text-verde-medio' : 'text-rojo'}`}>
                        {soloDigitos ? (
                          <>
                            Se usará{' '}
                            <a
                              href={`https://wa.me/${data.whatsapp}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline"
                            >
                              wa.me/{data.whatsapp}
                            </a>
                          </>
                        ) : (
                          'Solo números, sin el + ni espacios (7 a 15 dígitos).'
                        )}
                      </p>
                    )}
                  </>
                ) : ajuste.clave === 'zonas_entrega' ? (
                  <>
                    <input
                      value={data.zonas_entrega}
                      onChange={(e) => setData('zonas_entrega', e.target.value)}
                      className="w-full rounded-xl border border-crema-oscuro bg-crema px-4 py-3 text-verde focus:border-verde focus:ring-2 focus:ring-verde/20 focus:outline-none"
                    />
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {data.zonas_entrega
                        .split('|')
                        .map((z) => z.trim())
                        .filter(Boolean)
                        .map((z, i) => (
                          <span
                            key={`${z}-${i}`}
                            className="rounded-full bg-verde-suave px-2.5 py-1 text-xs text-verde"
                          >
                            {z}
                          </span>
                        ))}
                    </p>
                  </>
                ) : (
                  <textarea
                    value={data[ajuste.clave]}
                    onChange={(e) => setData(ajuste.clave, e.target.value)}
                    rows={ajuste.clave === 'banco' ? 3 : 1}
                    className="w-full resize-y rounded-xl border border-crema-oscuro bg-crema px-4 py-3 text-verde focus:border-verde focus:ring-2 focus:ring-verde/20 focus:outline-none"
                  />
                )}
              </Campo>
            ))}

            {errors.whatsapp && <p className="text-sm text-rojo">{errors.whatsapp}</p>}

            <div className="flex items-center gap-3 border-t border-crema-oscuro pt-5">
              <button
                type="submit"
                disabled={processing}
                className="rounded-full bg-verde px-6 py-2.5 text-sm font-semibold text-crema transition-colors hover:bg-verde-medio disabled:opacity-50"
              >
                {processing ? 'Guardando...' : 'Guardar ajustes'}
              </button>
            </div>
          </div>
        </TarjetaAdmin>
      </form>
    </>
  )
}

function Campo({ ajuste, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-verde">{ajuste.etiqueta}</label>
      {children}
      <p className="mt-1.5 text-xs text-tinta-suave">{ajuste.ayuda}</p>
    </div>
  )
}

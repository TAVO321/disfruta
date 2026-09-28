import { createContext, useCallback, useContext, useState } from 'react'
import { BotonAdmin } from '@/components/BotonAdmin'

const ContextoConfirmacion = createContext(null)

/**
 * Reemplazo estilizado del confirm() del navegador.
 *
 * Uso:
 *   const { confirmar } = useConfirmacion()
 *   if (!(await confirmar({ titulo: '...', mensaje: '...' }))) return
 */
export function ConfirmacionProvider({ children }) {
  const [config, setConfig] = useState(null)
  const [resolver, setResolver] = useState(null)

  const confirmar = useCallback(
    ({
      titulo = '¿Confirmar?',
      mensaje = '',
      confirmarTexto = 'Aceptar',
      cancelarTexto = 'Cancelar',
      variante = 'primario',
    } = {}) =>
      new Promise((resolve) => {
        setConfig({ titulo, mensaje, confirmarTexto, cancelarTexto, variante })
        setResolver(() => resolve)
      }),
    [],
  )

  const responder = (valor) => {
    if (resolver) resolver(valor)
    setConfig(null)
    setResolver(null)
  }

  return (
    <ContextoConfirmacion.Provider value={{ confirmar }}>
      {children}
      {config && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-tinta/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.currentTarget === e.target) responder(false)
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-crema-profundo bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-bold text-verde">{config.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-tinta whitespace-pre-line">
              {config.mensaje}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <BotonAdmin variante="contorno" onClick={() => responder(false)}>
                {config.cancelarTexto}
              </BotonAdmin>
              <BotonAdmin variante={config.variante} onClick={() => responder(true)}>
                {config.confirmarTexto}
              </BotonAdmin>
            </div>
          </div>
        </div>
      )}
    </ContextoConfirmacion.Provider>
  )
}

export function useConfirmacion() {
  const ctx = useContext(ContextoConfirmacion)
  if (!ctx) throw new Error('useConfirmacion debe usarse dentro de ConfirmacionProvider')
  return ctx
}

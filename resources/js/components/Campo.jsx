const CLASES =
  'w-full rounded-xl border border-crema-profundo bg-white px-3.5 py-3 text-sm text-tinta transition-colors placeholder:text-tinta-suave/50 focus:border-verde-claro'

/**
 * Campo de formulario con etiqueta. Lo usan el carrito lateral y la pagina del
 * carrito: los dos formularios de checkout son el mismo, asi que el control
 * vive aca para que no se desincronicen.
 */
export function Campo({ etiqueta, valor, onChange, placeholder, multilinea, requerido }) {
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
          className={`${CLASES} resize-none`}
        />
      ) : (
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={CLASES}
        />
      )}
    </div>
  )
}

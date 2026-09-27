import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { IconoCerrar } from '@/components/Iconos'

/**
 * Muestra el mensaje de flash que envian los controllers con
 * back()->with('success'|'error', ...). Se monta en los dos layouts.
 */
export function Flash() {
  const { flash } = usePage().props
  const [oculto, setOculto] = useState(false)

  // Al cambiar de pagina el mensaje anterior ya no aplica.
  useEffect(() => setOculto(false), [flash?.success, flash?.error])

  const texto = oculto ? null : (flash?.success ?? flash?.error)
  if (!texto) return null

  const esError = !flash?.success && Boolean(flash?.error)

  return (
    <div
      role="status"
      aria-live="polite"
      className={`animar-aparece sticky top-0 z-50 flex items-start gap-3 px-4 py-3 text-sm shadow-suave sm:px-6 ${
        esError ? 'bg-rojo text-crema' : 'bg-verde text-crema'
      }`}
    >
      <p className="min-w-0 flex-1">{texto}</p>
      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={() => setOculto(true)}
        className="-my-1 shrink-0 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
      >
        <IconoCerrar width={16} height={16} />
      </button>
    </div>
  )
}

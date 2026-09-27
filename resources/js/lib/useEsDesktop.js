import { useEffect, useState } from 'react'

/**
 * Indica si la ventana entra en el breakpoint `lg` de Tailwind (64rem = 1024px).
 *
 * Sirve para no montar ramas que CSS esconde con `hidden`: React construye y
 * reconcilia los `display: none` igual que las visibles, asi que un panel
 * oculto en movil se paga en cada render sin aportar nada en pantalla.
 */
export function useEsDesktop(consulta = '(min-width: 64rem)') {
  const [coincide, setCoincide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(consulta).matches,
  )

  useEffect(() => {
    const medio = window.matchMedia(consulta)
    const alCambiar = (evento) => setCoincide(evento.matches)

    setCoincide(medio.matches)
    medio.addEventListener('change', alCambiar)

    return () => medio.removeEventListener('change', alCambiar)
  }, [consulta])

  return coincide
}

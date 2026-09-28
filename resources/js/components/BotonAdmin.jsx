import { Link } from '@inertiajs/react'

/**
 * Botones de accion del panel.
 *
 * Antes cada fila repetia las clases y "Eliminar" quedaba como un texto mas,
 * igual que "Ver": sin borde ni color propio no se leia como la accion
 * destructiva que es, y cada pagina lo resolvia un poco distinto. Ahora todos
 * comparten la misma base y solo cambia la variante.
 *
 * Las variantes se nombran por apariencia, no por uso, asi un boton verde
 * lleno sirve para "Editar", "Guardar" o "+ Nuevo" sin inventar un nombre
 * por cada accion.
 */
const BASE =
  'inline-flex items-center justify-center gap-1.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const TAMANOS = {
  sm: 'rounded-lg px-2.5 py-1.5 text-xs',
  bloque: 'w-full rounded-full px-5 py-2.5 text-sm',
}

const VARIANTES = {
  // Verde lleno: la accion principal de la fila.
  primario: 'bg-verde text-crema hover:bg-verde-medio',
  // Texto suelto, sin caja: lo secundario que no compite con la accion principal.
  suave: 'text-tinta-suave hover:bg-crema hover:text-verde',
  // Contorno neutro: acciones terciarias.
  contorno: 'border border-crema-profundo text-tinta hover:border-verde hover:text-verde',
  // Contorno verde: salida o contacto.
  contornoVerde: 'border border-verde text-verde hover:bg-verde hover:text-crema',
  // Contorno rojo: siempre destructivo. Se lee como borrar antes de hacer clic.
  peligro: 'border border-rojo/30 text-rojo hover:border-rojo hover:bg-rojo hover:text-crema',
}

export function claseBoton(variante, tamano = 'sm') {
  return `${BASE} ${TAMANOS[tamano]} ${VARIANTES[variante]}`
}

export function BotonAdmin({ variante, tamano = 'sm', className = '', ...props }) {
  return <button type="button" className={`${claseBoton(variante, tamano)} ${className}`} {...props} />
}

export function EnlaceAdmin({ variante, tamano = 'sm', className = '', ...props }) {
  return <Link className={`${claseBoton(variante, tamano)} ${className}`} {...props} />
}

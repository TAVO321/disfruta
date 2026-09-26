const CLAVE_SESION = 'disfruta-admin-sesion'

// La contrasena se toma de la variable de entorno VITE_ADMIN_PASSWORD.
// Si no esta definida se usa la de abajo, que hay que cambiar antes de publicar.
const CONTRASENA =
  import.meta.env.VITE_ADMIN_PASSWORD?.trim() || 'disfruta2026'

export const CONTRASENA_POR_DEFECTO = !import.meta.env.VITE_ADMIN_PASSWORD?.trim()

/** SHA-256 en hexadecimal. Requiere contexto seguro (https o localhost). */
export async function hashTexto(texto: string): Promise<string> {
  const datos = new TextEncoder().encode(texto)
  const buffer = await crypto.subtle.digest('SHA-256', datos)
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function contrasenaCorrecta(ingresada: string): Promise<boolean> {
  const [a, b] = await Promise.all([hashTexto(ingresada), hashTexto(CONTRASENA)])
  return a === b
}

export async function haySesionAdmin(): Promise<boolean> {
  try {
    const guardado = window.sessionStorage.getItem(CLAVE_SESION)
    return guardado === (await hashTexto(CONTRASENA))
  } catch {
    return false
  }
}

export async function iniciarSesionAdmin(contrasena: string): Promise<boolean> {
  if (!(await contrasenaCorrecta(contrasena))) return false
  try {
    window.sessionStorage.setItem(CLAVE_SESION, await hashTexto(CONTRASENA))
  } catch {
    /* sin storage disponible: la sesion dura lo que lasts el render */
  }
  return true
}

export function cerrarSesionAdmin() {
  try {
    window.sessionStorage.removeItem(CLAVE_SESION)
  } catch {
    /* sin storage disponible no hay nada que limpiar */
  }
}

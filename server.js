import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(fileURLToPath(new URL('./dist/', import.meta.url)))
const puerto = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
}

const conCache = 'public, max-age=31536000, immutable'
const sinCache = 'no-cache, must-revalidate'

const html = (respuesta, codigo, mensaje) => {
  respuesta.writeHead(codigo, {
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': sinCache,
  })
  respuesta.end(mensaje)
}

const resolver = async (ruta) => {
  const limpio = normalize(decodeURIComponent(ruta)).replace(/^[/\\]+/, '')
  const destino = resolve(raiz, limpio)

  if (destino !== raiz && !destino.startsWith(raiz + sep)) return null

  try {
    const info = await stat(destino)
    return info.isDirectory() ? join(destino, 'index.html') : destino
  } catch {
    return join(raiz, 'index.html')
  }
}

const servir = async (peticion, respuesta) => {
  if (peticion.method !== 'GET' && peticion.method !== 'HEAD') {
    return html(respuesta, 405, 'Metodo no permitido')
  }

  const url = new URL(peticion.url, `http://${peticion.headers.host || 'localhost'}`)
  const archivo = await resolver(url.pathname)

  if (!archivo) return html(respuesta, 403, 'Prohibido')

  let contenido
  try {
    contenido = await readFile(archivo)
  } catch {
    return html(respuesta, 404, 'No encontrado')
  }

  const conHash = url.pathname.startsWith('/assets/') && !archivo.endsWith('index.html')

  respuesta.writeHead(200, {
    'content-type': tipos[extname(archivo).toLowerCase()] || 'application/octet-stream',
    'cache-control': conHash ? conCache : sinCache,
    'x-content-type-options': 'nosniff',
    'content-length': contenido.length,
  })

  respuesta.end(peticion.method === 'HEAD' ? undefined : contenido)
}

createServer((peticion, respuesta) => {
  servir(peticion, respuesta).catch(() => html(respuesta, 500, 'Error interno'))
}).listen(puerto, host, () => {
  console.log(`DISFRUTA servido desde ${raiz} en http://${host}:${puerto}`)
})

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(fileURLToPath(new URL('./dist/', import.meta.url)))
const indice = join(raiz, 'index.html')
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

const construir = () => {
  console.log('[aviso] No existe dist/index.html. Ejecutando "npm run build"...')
  const salida = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', shell: true })
  return salida.status === 0 && existsSync(indice)
}

const resolver = async (ruta) => {
  const limpio = normalize(decodeURIComponent(ruta)).replace(/^[/\\]+/, '')
  const destino = resolve(raiz, limpio)

  if (destino !== raiz && !destino.startsWith(raiz + sep)) return null

  try {
    const info = await stat(destino)
    return info.isDirectory() ? join(destino, 'index.html') : destino
  } catch {
    return indice
  }
}

const servir = async (peticion, respuesta) => {
  if (peticion.method !== 'GET' && peticion.method !== 'HEAD') {
    respuesta.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' })
    return respuesta.end('Metodo no permitido')
  }

  const url = new URL(peticion.url, `http://${peticion.headers.host || 'localhost'}`)

  if (url.pathname === '/up' || url.pathname === '/health') {
    respuesta.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': sinCache })
    return respuesta.end('{"status":"ok"}')
  }

  const archivo = await resolver(url.pathname)

  if (!archivo) {
    respuesta.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
    return respuesta.end('Prohibido')
  }

  let contenido
  try {
    contenido = await readFile(archivo)
  } catch {
    respuesta.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    return respuesta.end('No encontrado')
  }

  const conHash = url.pathname.startsWith('/assets/') && !archivo.endsWith('index.html')

  respuesta.writeHead(200, {
    'content-type': tipos[extname(archivo).toLowerCase()] || 'application/octet-stream',
    'cache-control': conHash ? conCache : sinCache,
    'x-content-type-options': 'nosniff',
    'content-length': contenido.length,
  })

  return respuesta.end(peticion.method === 'HEAD' ? undefined : contenido)
}

const servidor = createServer((peticion, respuesta) => {
  const inicio = Date.now()
  respuesta.on('finish', () => {
    const url = peticion.url || '/'
    console.log(`${peticion.method} ${url} -> ${respuesta.statusCode} (${Date.now() - inicio}ms)`)
  })
  servir(peticion, respuesta).catch(() => {
    if (!respuesta.headersSent) respuesta.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
    respuesta.end('Error interno')
  })
})

servidor.on('error', (error) => {
  console.error(`[fatal] No se pudo escuchar en ${host}:${puerto} -> ${error.message}`)
  process.exit(1)
})

if (!existsSync(indice) && !construir()) {
  console.error('[fatal] dist/index.html no existe y el build fallo.')
  console.error('[fatal] Configura el build command de Laravel Cloud como: npm ci --audit false && npm run build')
  process.exit(1)
}

servidor.listen(puerto, host, () => {
  console.log(`[ok] PORT=${process.env.PORT || '(sin definir, uso 3000)'}`)
  console.log(`[ok] Sirviendo ${raiz} en http://${host}:${puerto}`)
})

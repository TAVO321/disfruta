import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ProveedorCarrito } from '@/context/Carrito'
import LayoutPublico from '@/layouts/LayoutPublico'
import LayoutAdmin from '@/layouts/LayoutAdmin'

// Sin eager:true cada pagina es su propio chunk. Antes todo el panel admin
// viajaba dentro del bundle de la web publica.
const pages = import.meta.glob('./pages/**/*.jsx')

// Inertia 3 no toma un prop layout en <App>: lee el estatico Component.layout.
// Se asigna aqui para no repetirlo en cada pagina. El login va sin chrome:
// no lleva layout, y devolver la pagina tal cual hace entrar a Inertia en un
// loop de renders.
const aplicarLayout = (ruta, modulo) => {
  const Componente = modulo.default

  if (ruta.endsWith('Admin/Acceso.jsx')) return modulo

  Componente.layout = ruta.startsWith('./pages/Admin/')
    ? (page) => <LayoutAdmin>{page}</LayoutAdmin>
    : (page) => <LayoutPublico>{page}</LayoutPublico>

  return modulo
}

createInertiaApp({
  title: (titulo) => (titulo ? `${titulo} · DISFRUTA` : 'DISFRUTA'),

  // laravel-vite-plugin v3 recibe el mapa completo de paginas y resuelve
  // solo; la firma vieja (path, page, default) hacia pages[path] y fallaba.
  // El layout se aplica sobre el modulo ya importado, antes de que Inertia
  // llegue a renderizarlo.
  resolve: (name) => {
    const ruta = `./pages/${name}.jsx`

    return resolvePageComponent(ruta, pages).then((modulo) => aplicarLayout(ruta, modulo))
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <ProveedorCarrito>
        <App {...props} />
      </ProveedorCarrito>,
    )
  },
})

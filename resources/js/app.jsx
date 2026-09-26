import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ProveedorCarrito } from '@/context/Carrito'
import LayoutPublico from '@/layouts/LayoutPublico'
import LayoutAdmin from '@/layouts/LayoutAdmin'

const pages = import.meta.glob('./pages/**/*.jsx', { eager: true })

createInertiaApp({
  title: (titulo) => (titulo ? `${titulo} · DISFRUTA` : 'DISFRUTA'),

  // laravel-vite-plugin v3 recibe el mapa completo de paginas y resuelve
  // solo; la firma vieja (path, page, default) hacia pages[path] y fallaba.
  resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, pages),

  setup({ el, App, props }) {
    // El layout se resuelve en cada navegacion (no una sola vez al cargar):
    // asi ir del panel a la web o al login cambia el chrome correctamente.
    const resolverLayout = (page) => {
      const url = window.location.pathname

      if (url === '/admin/acceso') return page
      if (url.startsWith('/admin')) return <LayoutAdmin>{page}</LayoutAdmin>

      return <LayoutPublico>{page}</LayoutPublico>
    }

    createRoot(el).render(
      <ProveedorCarrito>
        <App {...props} layout={resolverLayout} />
      </ProveedorCarrito>,
    )
  },
})

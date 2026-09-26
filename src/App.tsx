import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AccesoAdmin } from '@/admin/AccesoAdmin'
import { AdminLayout } from '@/admin/AdminLayout'
import { AdminClientes } from '@/admin/AdminClientes'
import { AdminLotes } from '@/admin/AdminLotes'
import { AdminPedidos } from '@/admin/AdminPedidos'
import { AdminProductos } from '@/admin/AdminProductos'
import { AdminPromociones } from '@/admin/AdminPromociones'
import { AdminResumen } from '@/admin/AdminResumen'
import { AdminStock } from '@/admin/AdminStock'
import { CarritoLateral } from '@/components/CarritoLateral'
import { FichaProducto } from '@/components/FichaProducto'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Catalogo } from '@/pages/Catalogo'
import { Contacto } from '@/pages/Contacto'
import { Favoritos } from '@/pages/Favoritos'
import { Home } from '@/pages/Home'
import { Nosotros } from '@/pages/Nosotros'
import { Promociones } from '@/pages/Promociones'
import { ProveedorTienda } from '@/store/tienda'
import { haySesionAdmin } from '@/lib/seguridad'
import type { Producto } from '@/types'

function Sitio() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [ficha, setFicha] = useState<Producto | null>(null)
  const { pathname } = useLocation()

  // Cierra la ficha y vuelve arriba al cambiar de ruta.
  // El arreglo de dependencias va solo con pathname: setFicha es estable, y
  // pasar un callback inline aqui hacia que el efecto se dispare en cada render.
  useEffect(() => {
    setFicha(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onVer={setFicha} />} />
          <Route path="/catalogo" element={<Catalogo onVer={setFicha} />} />
          <Route path="/promociones" element={<Promociones onVer={setFicha} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/favoritos" element={<Favoritos onVer={setFicha} />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>

      <Footer />
      <CarritoLateral abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />
      {ficha && <FichaProducto producto={ficha} onCerrar={() => setFicha(null)} />}
    </div>
  )
}

function PanelAdmin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminResumen />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="stock" element={<AdminStock />} />
        <Route path="lotes" element={<AdminLotes />} />
        <Route path="pedidos" element={<AdminPedidos />} />
        <Route path="promociones" element={<AdminPromociones />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="*" element={<AdminResumen />} />
      </Routes>
    </AdminLayout>
  )
}

/** Puerta de entrada del panel: exige contrasena antes de montar el admin. */
function AdminProtegido() {
  const [permitido, setPermitido] = useState<boolean | null>(null)

  useEffect(() => {
    let vivo = true
    haySesionAdmin().then((ok) => {
      if (vivo) setPermitido(ok)
    })
    return () => {
      vivo = false
    }
  }, [])

  if (permitido === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-crema">
        <p className="text-sm tracking-wide text-tinta-suave uppercase">Verificando...</p>
      </div>
    )
  }

  if (!permitido) return <AccesoAdmin alEntrar={() => setPermitido(true)} />

  return <PanelAdmin />
}

function NoEncontrado() {
  return (
    <div className="container-disfruta flex flex-col items-center justify-center py-32 text-center">
      <p className="font-serif text-6xl font-bold text-dorado/40">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-verde">Esta página no existe</h1>
      <p className="mt-3 max-w-md text-tinta-suave">
        Puede que el link esté viejo o que el producto se haya eliminado. Volvé al catálogo
        para seguir explorando.
      </p>
      <a
        href="/catalogo"
        className="mt-8 rounded-full bg-verde px-7 py-3.5 text-sm font-semibold tracking-wide text-crema uppercase transition-colors hover:bg-verde-medio"
      >
        Ir al catálogo
      </a>
    </div>
  )
}

export default function App() {
  return (
    <ProveedorTienda>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminProtegido />} />
          <Route path="*" element={<Sitio />} />
        </Routes>
      </BrowserRouter>
    </ProveedorTienda>
  )
}

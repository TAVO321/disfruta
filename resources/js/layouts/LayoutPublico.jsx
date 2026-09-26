import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CarritoLateral } from '@/components/CarritoLateral'

export default function LayoutPublico({ children }) {
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <meta name="description" content="Acompañamientos artesanales DISFRUTA: encurtidos, escabechos, picantes y combos." />
      </Head>

      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-verde focus:px-4 focus:py-2 focus:text-crema"
      >
        Saltar al contenido
      </a>

      <Navbar onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main id="contenido" className="flex-1">
        {children}
      </main>

      <Footer />
      <CarritoLateral abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />
    </div>
  )
}

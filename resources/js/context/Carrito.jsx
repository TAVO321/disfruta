import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CLAVE = 'disfruta-carrito-v1'
const TOPE_RESERVA = 10

/**
 * El carrito es el unico estado que vive en el navegador: es efimero y no
 * necesita estar en la base. Productos, stock, promociones y pedidos vienen
 * de Laravel, y el pedido se persiste recien al confirmar.
 */
const Contexto = createContext(null)

function cargar() {
  try {
    const guardado = JSON.parse(window.localStorage.getItem(CLAVE) ?? '[]')
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function ProveedorCarrito({ children }) {
  const [lineas, setLineas] = useState(cargar)

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(lineas))
    } catch {
      /* cuota excedida: se sigue funcionando en memoria */
    }
  }, [lineas])

  const quitar = useCallback((productoId, reserva) => {
    setLineas((previas) =>
      previas.filter((i) => !(i.productoId === productoId && i.reserva === reserva)),
    )
  }, [])

  const api = useMemo(() => {
    const total = lineas.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

    return {
      items: lineas,
      total,
      cantidad: lineas.reduce((n, i) => n + i.cantidad, 0),
      hayReservas: lineas.some((i) => i.reserva),

      enCarrito: (productoId) => lineas.some((i) => i.productoId === productoId),

      agregar: (producto, cantidad = 1, reserva = false) => {
        const tope = reserva ? TOPE_RESERVA : Math.max(producto.stock, 1)

        setLineas((previas) => {
          const existe = previas.find(
            (i) => i.productoId === producto.id && i.reserva === reserva,
          )

          if (existe) {
            return previas.map((i) =>
              i === existe ? { ...i, cantidad: Math.min(i.cantidad + cantidad, tope) } : i,
            )
          }

          return [
            ...previas,
            {
              productoId: producto.id,
              nombre: producto.nombre,
              slug: producto.slug,
              presentacion: producto.presentacion,
              precio: producto.precio,
              imagen: producto.imagen ?? null,
              tono: producto.tono,
              cantidad: Math.min(cantidad, tope),
              tope,
              reserva,
            },
          ]
        })
      },

      alternarReserva: (productoId) => {
        setLineas((previas) => {
          const original = previas.find((i) => i.productoId === productoId && !i.reserva)
          const reserva = previas.find((i) => i.productoId === productoId && i.reserva)

          if (reserva) return previas.filter((i) => i !== reserva)
          if (!original) return previas

          return previas.map((i) =>
            i === original
              ? { ...i, reserva: true, tope: TOPE_RESERVA, cantidad: Math.min(i.cantidad, TOPE_RESERVA) }
              : i,
          )
        })
      },

      cambiarCantidad: (productoId, cantidad, reserva) => {
        if (cantidad <= 0) return quitar(productoId, reserva)

        setLineas((previas) =>
          previas.map((i) =>
            i.productoId === productoId && i.reserva === reserva
              ? { ...i, cantidad: Math.min(cantidad, i.tope ?? TOPE_RESERVA) }
              : i,
          ),
        )
      },

      eliminar: quitar,
      vaciar: () => setLineas([]),
    }
  }, [lineas, quitar])

  return <Contexto.Provider value={api}>{children}</Contexto.Provider>
}

export function useCarrito() {
  const contexto = useContext(Contexto)

  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  }

  return contexto
}

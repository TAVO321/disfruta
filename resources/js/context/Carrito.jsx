import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CLAVE = 'disfruta-carrito-v1'
const TOPE_RESERVA = 10

/**
 * El carrito es el unico estado que vive en el navegador: es efimero y no
 * necesita estar en la base. Productos, stock, promociones y pedidos vienen
 * de Laravel, y el pedido se persiste recien al confirmar.
 *
 * El estado y las acciones viven en contextos separados a proposito. Las
 * acciones nunca cambian de identidad, asi que un componente que solo necesita
 * agregar al carrito no se re-renderiza cuando el carrito cambia. Con un solo
 * contexto, cada "Agregar" repintaba las doce tarjetas de la grilla y los 552
 * nodos de SVG de los frascos, que es lo que se senteia lento al comprar.
 */
const ContextoEstado = createContext(null)
const ContextoAcciones = createContext(null)

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

  const agregar = useCallback((producto, cantidad = 1, reserva = false) => {
    const tope = reserva ? TOPE_RESERVA : Math.max(producto.stock, 1)

    setLineas((previas) => {
      const existe = previas.find((i) => i.productoId === producto.id && i.reserva === reserva)

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
  }, [])

  const quitar = useCallback((productoId, reserva) => {
    setLineas((previas) => previas.filter((i) => !(i.productoId === productoId && i.reserva === reserva)))
  }, [])

  const cambiarCantidad = useCallback(
    (productoId, cantidad, reserva) => {
      if (cantidad <= 0) {
        return quitar(productoId, reserva)
      }

      setLineas((previas) =>
        previas.map((i) =>
          i.productoId === productoId && i.reserva === reserva
            ? { ...i, cantidad: Math.min(cantidad, i.tope ?? TOPE_RESERVA) }
            : i,
        ),
      )
    },
    [quitar],
  )

  const vaciar = useCallback(() => setLineas([]), [])

  const acciones = useMemo(
    () => ({ agregar, cambiarCantidad, eliminar: quitar, vaciar }),
    [agregar, cambiarCantidad, quitar, vaciar],
  )

  const estado = useMemo(() => {
    let total = 0
    let cantidad = 0
    const ids = new Set()

    for (const linea of lineas) {
      total += linea.precio * linea.cantidad
      cantidad += linea.cantidad
      ids.add(linea.productoId)
    }

    return { items: lineas, ids, total, cantidad }
  }, [lineas])

  return (
    <ContextoAcciones.Provider value={acciones}>
      <ContextoEstado.Provider value={estado}>{children}</ContextoEstado.Provider>
    </ContextoAcciones.Provider>
  )
}

function useEstadoCarrito() {
  const estado = useContext(ContextoEstado)

  if (!estado) {
    throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  }

  return estado
}

/**
 * Solo para las acciones: no re-renderiza el componente cuando el carrito
 * cambia, porque el valor del contexto es estable.
 */
export function useCarritoAcciones() {
  const acciones = useContext(ContextoAcciones)

  if (!acciones) {
    throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  }

  return acciones
}

/**
 * Los ids de los productos en el carrito, para pintar el estado del boton sin
 * suscribirse a todo el carrito.
 */
export function useCarritoIds() {
  return useEstadoCarrito().ids
}

/** Estado y acciones juntos, para el navbar y el carrito lateral. */
export function useCarrito() {
  const { items, ids, total, cantidad } = useEstadoCarrito()
  const acciones = useCarritoAcciones()

  return useMemo(
    () => ({ items, total, cantidad, ...acciones, enCarrito: (productoId) => ids.has(productoId) }),
    [items, ids, total, cantidad, acciones],
  )
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PRODUCTOS_SEED, PROMOCIONES_SEED, RESENAS_SEED } from '@/data/seed'
import type {
  Cliente,
  ItemCarrito,
  Pedido,
  Producto,
  Promocion,
  Reseña,
} from '@/types'

const CLAVE = 'disfruta-datos-v2'

interface Datos {
  productos: Producto[]
  promociones: Promocion[]
  resenas: Reseña[]
  pedidos: Pedido[]
  clientes: Cliente[]
  carrito: ItemCarrito[]
  favoritos: string[]
  reservas: string[]
  contadorPedido: number
}

const SEMILLA: Datos = {
  productos: PRODUCTOS_SEED,
  promociones: PROMOCIONES_SEED,
  resenas: RESENAS_SEED,
  pedidos: [
    {
      id: 'DIS-0001',
      cliente: 'Valentina Ríos',
      telefono: '7 1000 0001',
      zona: 'La Paz y zona central',
      items: [
        { productoId: 'p-cebolla-morada', nombre: 'Cebolla Morada Encurtida', cantidad: 2, precio: 12500, reserva: false },
        { productoId: 'p-jalapeno-escabeche', nombre: 'Jalapeños en Escabeche', cantidad: 1, precio: 13800, reserva: false },
      ],
      total: 88,
      notas: 'Entregar después de las 18 hs.',
      estado: 'entregado',
      creado: '2026-09-18T11:20:00',
    },
    {
      id: 'DIS-0002',
      cliente: 'Marcos Gutiérrez',
      telefono: '7 2000 0002',
      zona: 'Santa Cruz de la Sierra',
      items: [
        { productoId: 'p-combo-parrillada', nombre: 'Combo Parrillera DISFRUTA', cantidad: 1, precio: 95, reserva: false },
      ],
      total: 95,
      notas: '',
      estado: 'entregado',
      creado: '2026-09-20T19:05:00',
    },
    {
      id: 'DIS-0003',
      cliente: 'Sofía Andreotti',
      telefono: '6 7000 0003',
      zona: 'La Paz y zona central',
      items: [
        { productoId: 'p-uchu-escabeche', nombre: 'Uchus en Escabeche Suave', cantidad: 2, precio: 14200, reserva: true },
        { productoId: 'p-relish-tomate', nombre: 'Relish de Tomate con Ajo', cantidad: 1, precio: 14500, reserva: false },
      ],
      total: 104,
      notas: 'Es una reserva del próximo lote de uchus.',
      estado: 'confirmado',
      creado: '2026-09-24T10:45:00',
    },
    {
      id: 'DIS-0004',
      cliente: 'Damián López',
      telefono: '7 3000 0004',
      zona: 'La Paz y zona central',
      items: [
        { productoId: 'p-pique-macho', nombre: 'Escabeche para Pique Macho', cantidad: 1, precio: 21900, reserva: false },
        { productoId: 'p-ajo-encurtido', nombre: 'Ajo Encurtido Suave', cantidad: 2, precio: 11800, reserva: false },
      ],
      total: 107,
      notas: 'Pique macho del domingo, consultar si llega temprano.',
      estado: 'preparando',
      creado: '2026-09-25T09:15:00',
    },
  ],
  clientes: [
    {
      id: 'c-1',
      nombre: 'Valentina Ríos',
      telefono: '7 1000 0001',
      zona: 'La Paz y zona central',
      pedidos: 4,
      gastado: 890,
      favoritosIds: ['p-cebolla-morada', 'p-relish-tomate'],
      reservasIds: [],
      ultimoContacto: '2026-09-18',
    },
    {
      id: 'c-2',
      nombre: 'Marcos Gutiérrez',
      telefono: '7 2000 0002',
      zona: 'Santa Cruz de la Sierra',
      pedidos: 3,
      gastado: 620,
      favoritosIds: ['p-combo-parrillada', 'p-pique-macho'],
      reservasIds: [],
      ultimoContacto: '2026-09-20',
    },
    {
      id: 'c-3',
      nombre: 'Sofía Andreotti',
      telefono: '6 7000 0003',
      zona: 'La Paz y zona central',
      pedidos: 2,
      gastado: 390,
      favoritosIds: ['p-jalapeno-escabeche'],
      reservasIds: ['p-uchu-escabeche'],
      ultimoContacto: '2026-09-24',
    },
    {
      id: 'c-4',
      nombre: 'Damián López',
      telefono: '7 3000 0004',
      zona: 'La Paz y zona central',
      pedidos: 1,
      gastado: 107,
      favoritosIds: ['p-picante-habanero'],
      reservasIds: [],
      ultimoContacto: '2026-09-25',
    },
  ],
  carrito: [],
  favoritos: ['p-cebolla-morada', 'p-picante-habanero'],
  reservas: ['p-uchu-escabeche'],
  contadorPedido: 4,
}

function cargar(): Datos {
  if (typeof window === 'undefined') return SEMILLA
  try {
    const bruto = window.localStorage.getItem(CLAVE)
    if (!bruto) return SEMILLA
    const guardado = JSON.parse(bruto) as Partial<Datos>
    return { ...SEMILLA, ...guardado }
  } catch {
    return SEMILLA
  }
}

interface Tienda {
  datos: Datos
  productos: Producto[]
  carrito: ItemCarrito[]
  productosEnCarrito: (ItemCarrito & { producto: Producto })[]
  totalCarrito: number
  cantidadCarrito: number
  enCarrito: (id: string) => boolean
  agregar: (id: string, cantidad?: number, reserva?: boolean) => void
  cambiarCantidad: (id: string, cantidad: number, reserva: boolean) => void
  eliminar: (id: string, reserva: boolean) => void
  vaciarCarrito: () => void
  esFavorito: (id: string) => boolean
  alternarFavorito: (id: string) => void
  alternarReserva: (id: string) => void
  guardarPedido: (pedido: Omit<Pedido, 'id' | 'creado' | 'estado'>) => Pedido
  actualizarEstadoPedido: (id: string, estado: Pedido['estado']) => void
  guardarProducto: (producto: Producto) => void
  eliminarProducto: (id: string) => void
  guardarPromocion: (p: Promocion) => void
  eliminarPromocion: (id: string) => void
  guardarReseña: (productoId: string, datos: Omit<Reseña, 'id' | 'productoId' | 'fecha'>) => void
  ajustarStock: (id: string, delta: number) => void
  registrarLote: (id: string, lote: Producto['lotes'][number]) => void
  reiniciar: () => void
}

const Contexto = createContext<Tienda | null>(null)

export function ProveedorTienda({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<Datos>(cargar)

  useEffect(() => {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch {
      /* cuota excedida: se sigue funcionando en memoria */
    }
  }, [datos])

  const guardar = useCallback((cambio: (d: Datos) => Datos) => setDatos(cambio), [])

  const api = useMemo<Tienda>(() => {
    const productos = datos.productos

    const productosEnCarrito = datos.carrito
      .map((item) => {
        const producto = productos.find((p) => p.id === item.productoId)
        return producto ? { ...item, producto } : null
      })
      .filter((x): x is ItemCarrito & { producto: Producto } => x !== null)

    const totalCarrito = productosEnCarrito.reduce(
      (suma, i) => suma + i.producto.precio * i.cantidad,
      0,
    )

    return {
      datos,
      productos,
      carrito: datos.carrito,
      productosEnCarrito,
      totalCarrito,
      cantidadCarrito: datos.carrito.reduce((n, i) => n + i.cantidad, 0),

      enCarrito: (id) => datos.carrito.some((i) => i.productoId === id),

      agregar: (id, cantidad = 1, reserva = false) =>
        guardar((d) => {
          const existe = d.carrito.find((i) => i.productoId === id && i.reserva === reserva)
          const producto = d.productos.find((p) => p.id === id)
          const tope = reserva ? 10 : producto?.stock ?? 10
          return {
            ...d,
            carrito: existe
              ? d.carrito.map((i) =>
                  i === existe ? { ...i, cantidad: Math.min(i.cantidad + cantidad, tope) } : i,
                )
              : [...d.carrito, { productoId: id, cantidad: Math.min(cantidad, tope), reserva }],
          }
        }),

      cambiarCantidad: (id, cantidad, reserva) =>
        guardar((d) => ({
          ...d,
          carrito:
            cantidad <= 0
              ? d.carrito.filter((i) => !(i.productoId === id && i.reserva === reserva))
              : d.carrito.map((i) =>
                  i.productoId === id && i.reserva === reserva ? { ...i, cantidad } : i,
                ),
        })),

      eliminar: (id, reserva) =>
        guardar((d) => ({
          ...d,
          carrito: d.carrito.filter((i) => !(i.productoId === id && i.reserva === reserva)),
        })),

      vaciarCarrito: () => guardar((d) => ({ ...d, carrito: [] })),

      esFavorito: (id) => datos.favoritos.includes(id),
      alternarFavorito: (id) =>
        guardar((d) => ({
          ...d,
          favoritos: d.favoritos.includes(id)
            ? d.favoritos.filter((f) => f !== id)
            : [...d.favoritos, id],
        })),

      alternarReserva: (id) =>
        guardar((d) => ({
          ...d,
          reservas: d.reservas.includes(id)
            ? d.reservas.filter((f) => f !== id)
            : [...d.reservas, id],
        })),

      guardarPedido: (parcial) => {
        const n = datos.contadorPedido + 1
        const pedido: Pedido = {
          ...parcial,
          id: `DIS-${String(n).padStart(4, '0')}`,
          estado: 'nuevo',
          creado: new Date().toISOString(),
        }
        guardar((d) => {
          const productos = d.productos
          const items = pedido.items.map((i) => ({ ...i }))
          const stock = [...productos]
          for (const item of items) {
            if (item.reserva) continue
            const idx = stock.findIndex((p) => p.id === item.productoId)
            if (idx >= 0) {
              const p = stock[idx]
              stock[idx] = {
                ...p,
                stock: Math.max(0, p.stock - item.cantidad),
                lotes: p.lotes.map((l) => ({
                  ...l,
                  restante: Math.max(0, l.restante - item.cantidad),
                })),
              }
            }
          }
          const clienteExistente = d.clientes.find(
            (c) => c.nombre.toLowerCase() === pedido.cliente.toLowerCase(),
          )
          const clientes = clienteExistente
            ? d.clientes.map((c) =>
                c.id === clienteExistente.id
                  ? {
                      ...c,
                      pedidos: c.pedidos + 1,
                      gastado: c.gastado + pedido.total,
                      telefono: pedido.telefono || c.telefono,
                      zona: pedido.zona || c.zona,
                      reservasIds: [
                        ...new Set([
                          ...c.reservasIds,
                          ...items.filter((i) => i.reserva).map((i) => i.productoId),
                        ]),
                      ],
                      ultimoContacto: pedido.creado.slice(0, 10),
                    }
                  : c,
              )
            : [
                {
                  id: `c-${d.clientes.length + 1}`,
                  nombre: pedido.cliente,
                  telefono: pedido.telefono,
                  zona: pedido.zona,
                  pedidos: 1,
                  gastado: pedido.total,
                  favoritosIds: datos.favoritos,
                  reservasIds: items.filter((i) => i.reserva).map((i) => i.productoId),
                  ultimoContacto: pedido.creado.slice(0, 10),
                },
                ...d.clientes,
              ]

          return {
            ...d,
            productos: stock,
            pedidos: [pedido, ...d.pedidos],
            clientes,
            contadorPedido: n,
            reservas: [
              ...new Set([
                ...d.reservas,
                ...items.filter((i) => i.reserva).map((i) => i.productoId),
              ]),
            ],
            carrito: [],
          }
        })
        return pedido
      },

      actualizarEstadoPedido: (id, estado) =>
        guardar((d) => ({ ...d, pedidos: d.pedidos.map((p) => (p.id === id ? { ...p, estado } : p)) })),

      guardarProducto: (producto) =>
        guardar((d) => ({
          ...d,
          productos: d.productos.some((p) => p.id === producto.id)
            ? d.productos.map((p) => (p.id === producto.id ? producto : p))
            : [producto, ...d.productos],
        })),

      eliminarProducto: (id) =>
        guardar((d) => ({
          ...d,
          productos: d.productos.filter((p) => p.id !== id),
          favoritos: d.favoritos.filter((f) => f !== id),
          reservas: d.reservas.filter((f) => f !== id),
          carrito: d.carrito.filter((i) => i.productoId !== id),
        })),

      guardarPromocion: (p) =>
        guardar((d) => ({
          ...d,
          promociones: d.promociones.some((x) => x.id === p.id)
            ? d.promociones.map((x) => (x.id === p.id ? p : x))
            : [p, ...d.promociones],
        })),

      eliminarPromocion: (id) =>
        guardar((d) => ({ ...d, promociones: d.promociones.filter((p) => p.id !== id) })),

      guardarReseña: (productoId, r) =>
        guardar((d) => ({
          ...d,
          resenas: [
            {
              id: `r-${Date.now()}`,
              productoId,
              fecha: new Date().toISOString().slice(0, 10),
              ...r,
            },
            ...d.resenas,
          ],
        })),

      ajustarStock: (id, delta) =>
        guardar((d) => ({
          ...d,
          productos: d.productos.map((p) =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
          ),
        })),

      registrarLote: (id, lote) =>
        guardar((d) => ({
          ...d,
          productos: d.productos.map((p) =>
            p.id === id
              ? { ...p, lotes: [lote, ...p.lotes], stock: p.stock + lote.cantidad }
              : p,
          ),
        })),

      reiniciar: () => {
        window.localStorage.removeItem(CLAVE)
        setDatos(SEMILLA)
      },
    }
  }, [datos, guardar])

  return <Contexto.Provider value={api}>{children}</Contexto.Provider>
}

export function useTienda() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useTienda debe usarse dentro de <ProveedorTienda>')
  return ctx
}

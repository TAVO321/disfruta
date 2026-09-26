/**
 * Formas de datos que llegan desde Laravel (ver app/Http/Resources).
 * Las claves son camelCase a proposito, para que los componentes React
 * existentes se puedan reutilizar sin una capa de traduccion.
 *
 * @typedef {Object} Categoria
 * @property {number} id
 * @property {string} slug
 * @property {string} nombre
 * @property {number} [total]
 *
 * @typedef {Object} Lote
 * @property {number} id
 * @property {string} codigo
 * @property {string} fechaElaboracion
 * @property {string} fechaConsumoRecomendado
 * @property {number} cantidad
 * @property {number} restante
 *
 * @typedef {Object} Resena
 * @property {number} id
 * @property {string} autor
 * @property {number} estrellas
 * @property {string} texto
 * @property {string} fecha
 *
 * @typedef {Object} Producto
 * @property {number} id
 * @property {string} nombre
 * @property {string} slug
 * @property {Categoria} categoria
 * @property {number} precio
 * @property {number|null} precioAntes
 * @property {string} descripcionCorta
 * @property {string|null} descripcion
 * @property {string} presentacion
 * @property {string} nivelPicante
 * @property {number} stock
 * @property {number} stockMinimo
 * @property {boolean} activo
 * @property {boolean} destacado
 * @property {boolean} limitado
 * @property {boolean} temporada
 * @property {boolean} combo
 * @property {string|null} insignia
 * @property {number} peso
 * @property {string[]} ingredientes
 * @property {string[]} platosRecomendados
 * @property {string|null} recomendacionConsumo
 * @property {string|null} conservacion
 * @property {boolean} disponible
 * @property {string|null} imagen
 * @property {string[]} gallery
 * @property {{fondo:string,contenido:string,acento:string,tapa:string}} tono
 * @property {Lote[]} lotes
 * @property {Resena[]} resenas
 * @property {string} creado
 *
 * @typedef {Object} ItemCarrito
 * @property {number} productoId
 * @property {number} cantidad
 * @property {boolean} reserva
 *
 * @typedef {Object} ItemResuelto extends ItemCarrito
 * @property {Producto} producto
 *
 * @typedef {Object} ItemPedido
 * @property {number} productoId
 * @property {string} nombre
 * @property {number} cantidad
 * @property {number} precio
 * @property {number} subtotal
 * @property {boolean} reserva
 *
 * @typedef {Object} Pedido
 * @property {number} id
 * @property {string} cliente
 * @property {string} telefono
 * @property {string} zona
 * @property {string|null} notas
 * @property {string} estado
 * @property {number} total
 * @property {string} creado
 * @property {ItemPedido[]} items
 *
 * @typedef {Object} Promocion
 * @property {number} id
 * @property {string} titulo
 * @property {string} descripcion
 * @property {'oferta'|'combo'|'temporada'} tipo
 * @property {number} descuento
 * @property {boolean} activa
 * @property {string|null} vigenteDesde
 * @property {string|null} vigenteHasta
 * @property {boolean} vigente
 * @property {Producto[]} productos
 */

export const NIVELES = ['suave', 'medio', 'picante', 'muy-picante', 'infierno']

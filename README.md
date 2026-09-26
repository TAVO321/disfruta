# DISFRUTA

Web de acompañamientos artesanales: catálogo, carrito, pedidos por WhatsApp y panel
administrativo. Es una SPA (Vite + React + TypeScript + Tailwind CSS) que guarda todo
en `localStorage`, sin backend ni base de datos.

Los precios están en **bolivianos (Bs)**.

## Puesta en marcha

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # build de produccion en dist/
npm run preview  # previsualiza el build
npm run lint     # oxlint
```

En PowerShell usá `npm.cmd` en lugar de `npm` si te bloquea la política de ejecución
(`npm.ps1`).

## Rutas

| Público | Admin (pide contraseña) |
| --- | --- |
| `/` inicio | `/admin` resumen |
| `/catalogo` | `/admin/productos` |
| `/promociones` | `/admin/promociones` |
| `/nosotros` | `/admin/stock` |
| `/contacto` | `/admin/lotes` |
| `/favoritos` | `/admin/pedidos` |
| | `/admin/clientes` |

`/favoritos` guarda los favoritos y las reservas de lote del usuario en su navegador.

## Acceso al panel

`/admin` está protegido con contraseña. La contraseña se toma de la variable de entorno
`VITE_ADMIN_PASSWORD`; si no está definida se usa `disfruta2026` (la pantalla de acceso
lo avisa).

Para fijar tu propia contraseña, creá un archivo `.env` en la raíz del proyecto:

```
VITE_ADMIN_PASSWORD=tu contrasena
```

La sesión se guarda en `sessionStorage`, así que se cierra al cerrar la pestaña del
navegador. Hay un botón "Cerrar sesión" en el panel.

**Aviso importante:** esta protección es del lado del cliente, no es seguridad real. La
contraseña viaja dentro del JavaScript que se descarga, así que alguien técnico podría
saltearla. Para un sitio público de verdad hace falta autenticación en un servidor. Cuando
se implemente la base de datos, hay que mover el login y los datos al backend.

## Qué hay que cambiar antes de publicar

Estos datos son de ejemplo. Editá `src/lib/config.ts`:

- `MARCA.nombre`, `lema`, `horarios`
- `MARCA.telefono` y `MARCA.whatsapp` (número en formato internacional, solo dígitos)
- `MARCA.zonasEntrega` (hoy: La Paz, Santa Cruz, Cochabamba y Tarija)
- Los precios del catálogo están en `src/data/seed.ts`

El WhatsApp de ejemplo es `+591 7 0000 0000`. Hay que reemplazarlo por el real.

## La base de datos (pendiente)

Hoy todo vive en `localStorage`, bajo la clave `disfruta-datos-v2`. Eso significa que los
datos no se comparten entre dispositivos: si vos administrás desde una computadora, el
cliente que entra desde el celular ve los datos originales, y no hay respaldo.

El proyecto **requiere una base de datos** para funcionar en serio. Cuando se implemente,
hay que mover la capa `src/store/tienda.tsx` y la semilla `src/data/seed.ts` a un backend
(por ejemplo Supabase, Firebase o una API propia) y sacar la autenticación del panel del
lado del cliente.

## Como funcionan los pedidos

1. El cliente arma el carrito.
2. Completa nombre, teléfono, zona de entrega y notas.
3. Se genera un mensaje con el detalle y se abre WhatsApp.
4. El pedido queda registrado en el panel, con el estado *Pendiente*.

No hay pagos ni pasarela: el cobro se coordina por WhatsApp. El stock se descuenta al
confirmar el pedido.

## Fotos de productos

Los productos sin foto usan una ilustración SVG de frasco. Para cargar fotos reales,
entro a **Admin > Productos > Editar > Fotos**. Se guardan como data URL dentro de
`localStorage`, así que tené en cuenta el límite del navegador: para un catálogo grande
conviene pasar a un backend o a un servicio de imágenes.

## Persistencia

Todo vive bajo la clave `disfruta-datos-v2` en `localStorage`. Para volver a los datos
de ejemplo, vaciá el almacenamiento del sitio desde las herramientas del navegador, o
subí la versión de la clave en `src/store/tienda.tsx`.

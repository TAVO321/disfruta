-- ===========================================================================
--  DISFRUTA - Catalogos editables + paletas por familia
--  Generado: 2026-09-27 16:56
--
--  QUE HACE ESTE ARCHIVO
--    Crea los catalogos de platos, niveles de picante, estados de pedido y
--    tipos de promocion, y le asigna su paleta de frasco a cada familia.
--
--  COMO USARLO
--    1. Correrlo contra una base YA MIGRADA (las tablas deben existir):
--         mysql -u USUARIO -p NOMBRE_BD < catalogos.sql
--    2. Es idempotente: se puede correr varias veces sin duplicar nada.
--    3. No toca productos, pedidos, clientes ni lotes.
--
--  SI PREFERIS QUE SE APLIQUE SOLO
--    No hace falta importar este archivo a mano, las migraciones lo hacen:
--         php artisan migrate --force
--         php artisan db:seed --class=Database\Seeders\CatalogosSeeder --force
--
--  NOTA SOBRE LAS PALETAS
--    La paleta vive en la FAMILIA, no en el producto. Los productos que ya
--    tienen el frasco de otro color NO cambian solos: se actualizan recien
--    cuando se pulsa "Aplicar a todos" en admin/categorias.
--
--  CAMPOS
--    platos         : nombre, emoji, orden, activo
--    niveles_picante  : nombre, chilis, descripcion, orden, activo
--    estados_pedido   : nombre, tono, orden, activo, es_final
--    tipos_promocion  : nombre, descripcion, orden, activo
-- ===========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('carnes','Carnes','🥩',6,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('choripan','Choripán','🥖',2,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('empanadas','Empanadas','🥟',8,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('hamburguesas','Hamburguesas','🍔',3,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('papas','Papas y guarniciones','🥔',10,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('parrillada','Parrillada','🔥',1,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('pastas','Pastas','🍝',7,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('pique-macho','Pique macho','🍖',5,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('pizzas','Pizzas','🍕',9,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('pollo','Pollo','🍗',4,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('queso','Quesos y tablas','🧀',12,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `platos` (`id`, `nombre`, `emoji`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('tacos','Tacos y wraps','🌮',11,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `emoji` = VALUES(`emoji`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `niveles_picante` (`id`, `nombre`, `chilis`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('infierno','Infierno',4,'Sin vuelta atrás',5,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `chilis` = VALUES(`chilis`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `niveles_picante` (`id`, `nombre`, `chilis`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('medio','Medio',1,'Un toque que se nota',2,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `chilis` = VALUES(`chilis`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `niveles_picante` (`id`, `nombre`, `chilis`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('muy-picante','Muy picante',3,'Para los que la buscan',4,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `chilis` = VALUES(`chilis`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `niveles_picante` (`id`, `nombre`, `chilis`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('picante','Picante',2,'Marcado y aromático',3,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `chilis` = VALUES(`chilis`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `niveles_picante` (`id`, `nombre`, `chilis`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('suave','Suave',0,'Para todos los paladares',1,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `chilis` = VALUES(`chilis`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `estados_pedido` (`id`, `nombre`, `tono`, `orden`, `activo`, `es_final`, `created_at`, `updated_at`) VALUES ('cancelado','Cancelado','rojo',5,1,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `tono` = VALUES(`tono`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `es_final` = VALUES(`es_final`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `estados_pedido` (`id`, `nombre`, `tono`, `orden`, `activo`, `es_final`, `created_at`, `updated_at`) VALUES ('confirmado','Confirmado','verde',2,1,0,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `tono` = VALUES(`tono`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `es_final` = VALUES(`es_final`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `estados_pedido` (`id`, `nombre`, `tono`, `orden`, `activo`, `es_final`, `created_at`, `updated_at`) VALUES ('entregado','Entregado','crema',4,1,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `tono` = VALUES(`tono`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `es_final` = VALUES(`es_final`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `estados_pedido` (`id`, `nombre`, `tono`, `orden`, `activo`, `es_final`, `created_at`, `updated_at`) VALUES ('nuevo','Nuevo','dorado',1,1,0,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `tono` = VALUES(`tono`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `es_final` = VALUES(`es_final`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `estados_pedido` (`id`, `nombre`, `tono`, `orden`, `activo`, `es_final`, `created_at`, `updated_at`) VALUES ('preparando','Preparando','dorado',3,1,0,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `tono` = VALUES(`tono`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `es_final` = VALUES(`es_final`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `tipos_promocion` (`id`, `nombre`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('combo','Combo','Varios productos a un precio conjunto',2,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `tipos_promocion` (`id`, `nombre`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('limitado','Cantidad limitada','Disponible hasta agotar el stock',4,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `tipos_promocion` (`id`, `nombre`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('oferta','Oferta','Precio rebajado sobre un producto',1,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
INSERT INTO `tipos_promocion` (`id`, `nombre`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES ('temporada','Temporada','Promocion de fecha o temporada',3,1,NULL,'2026-09-28 00:27:27')
ON DUPLICATE KEY UPDATE
  `nombre` = VALUES(`nombre`),
  `descripcion` = VALUES(`descripcion`),
  `orden` = VALUES(`orden`),
  `activo` = VALUES(`activo`),
  `created_at` = VALUES(`created_at`),
  `updated_at` = VALUES(`updated_at`);
-- ---------------------------------------------------------------------------
-- Paleta de cada familia. Solo tiene efecto si la categoria ya existe.
-- ---------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 1;
UPDATE `categorias` SET `tono` = '{"fondo":"#E2E9DE","contenido":"#5E8C4E","acento":"#2D5439","tapa":"#C89B3C"}' WHERE `slug` = 'encurtidos';
UPDATE `categorias` SET `tono` = '{"fondo":"#F2E2CB","contenido":"#C8452F","acento":"#8E2A1B","tapa":"#1F3D2B"}' WHERE `slug` = 'escabechos';
UPDATE `categorias` SET `tono` = '{"fondo":"#F0DFC4","contenido":"#D9741F","acento":"#A4500F","tapa":"#2D5439"}' WHERE `slug` = 'picantes';
UPDATE `categorias` SET `tono` = '{"fondo":"#EDE6D2","contenido":"#E5D6A8","acento":"#B49A5A","tapa":"#1F3D2B"}' WHERE `slug` = 'ajos';
UPDATE `categorias` SET `tono` = '{"fondo":"#E9E0CE","contenido":"#B4623A","acento":"#7A3A1E","tapa":"#1F3D2B"}' WHERE `slug` = 'combos';

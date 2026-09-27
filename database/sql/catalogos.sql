-- ===========================================================================
--  DISFRUTA - Catalogos editables + paletas por familia   (archivo autonomo)
--  Generado: 2026-09-27 17:09
--
--  QUE HACE
--    Crea las tablas de platos, niveles de picante, estados de pedido y
--    tipos de promocion, le agrega la paleta a la familia, y carga los datos.
--    No necesita que la base este migrada.
--
--  COMO USARLO
--    En DBeaver: boton derecho sobre la base -> Tools / Execute SQL Script
--    (elegi el archivo y dale Run)
--    O por consola:
--        mysql -u USUARIO -p NOMBRE_BD < catalogos_autonomo.sql
--
--  ES SEGURO
--    - Se puede correr las veces que quieras: no duplica ni pisa lo editado.
--    - No toca productos, pedidos, clientes, lotes, promociones ni resenas.
--    - Crea lo que falta y deja intacto lo que ya existe.
--
--  POR QUE REGISTRA LAS MIGRACIONES
--    Al final anota en la tabla migrations que las dos migraciones ya
--    corrieron. Si no lo hiciera, el proximo php artisan migrate del deploy
--    intentaria crear tablas que este archivo ya creo, y el deploy se caeria.
--
--  PALETAS
--    La paleta vive en la FAMILIA, no en el producto. Los frascos que ya
--    tienen otro color NO cambian solos recien cuando se pulsa
--    "Aplicar a todos" en admin/categorias.
-- ===========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
-- ---------------------------------------------------------------------------
-- 1) Tablas. CREATE TABLE IF NOT EXISTS: si ya existen, no se tocan.
--    El DDL es identico al de database/migrations/2026_09_27_202233.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `platos` (
  `id` varchar(40) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `emoji` varchar(16) DEFAULT NULL,
  `orden` smallint unsigned NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `niveles_picante` (
  `id` varchar(40) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `chilis` tinyint unsigned NOT NULL DEFAULT '0',
  `descripcion` varchar(160) DEFAULT NULL,
  `orden` smallint unsigned NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `estados_pedido` (
  `id` varchar(40) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `tono` varchar(20) NOT NULL DEFAULT 'dorado',
  `orden` smallint unsigned NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `es_final` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tipos_promocion` (
  `id` varchar(40) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(160) DEFAULT NULL,
  `orden` smallint unsigned NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 2) La paleta pasa a ser de la familia.
--    MySQL 8 no tiene ADD COLUMN IF NOT EXISTS, asi que se mira
--    information_schema y se agrega solo si falta. Asi no rompe ni si la columna
--    ya esta ni si la tabla categorias todavia no existe.
-- ---------------------------------------------------------------------------

SET @hay_categorias := (SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categorias');

SET @hay_tono := (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categorias' AND COLUMN_NAME = 'tono');

SET @sql := IF(@hay_categorias = 0,
  'SELECT ''No existe la tabla categorias: se omite el tono''',
  IF(@hay_tono > 0,
    'SELECT ''La columna categorias.tono ya existe: se deja como esta''',
    'ALTER TABLE `categorias` ADD COLUMN `tono` json DEFAULT NULL'
  )
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
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
  `updated_at` = VALUES(`updated_at`);-- ---------------------------------------------------------------------------
-- 3) Paleta de cada familia.
--    Va por 'slug' (la clave estable), no por nombre. Cada una va en su propio
--    bloque por si se necesita saltear alguna.
-- ---------------------------------------------------------------------------

SET @sql1 := IF(@hay_categorias > 0,
  'UPDATE `categorias` SET `tono` = ''{"fondo":"#E2E9DE","contenido":"#5E8C4E","acento":"#2D5439","tapa":"#C89B3C"}'' WHERE `slug` = ''encurtidos''',
  'DO 0'
);
PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SET @sql2 := IF(@hay_categorias > 0,
  'UPDATE `categorias` SET `tono` = ''{"fondo":"#F2E2CB","contenido":"#C8452F","acento":"#8E2A1B","tapa":"#1F3D2B"}'' WHERE `slug` = ''escabechos''',
  'DO 0'
);
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

SET @sql3 := IF(@hay_categorias > 0,
  'UPDATE `categorias` SET `tono` = ''{"fondo":"#F0DFC4","contenido":"#D9741F","acento":"#A4500F","tapa":"#2D5439"}'' WHERE `slug` = ''picantes''',
  'DO 0'
);
PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

SET @sql4 := IF(@hay_categorias > 0,
  'UPDATE `categorias` SET `tono` = ''{"fondo":"#EDE6D2","contenido":"#E5D6A8","acento":"#B49A5A","tapa":"#1F3D2B"}'' WHERE `slug` = ''ajos''',
  'DO 0'
);
PREPARE stmt4 FROM @sql4;
EXECUTE stmt4;
DEALLOCATE PREPARE stmt4;

SET @sql5 := IF(@hay_categorias > 0,
  'UPDATE `categorias` SET `tono` = ''{"fondo":"#E9E0CE","contenido":"#B4623A","acento":"#7A3A1E","tapa":"#1F3D2B"}'' WHERE `slug` = ''combos''',
  'DO 0'
);
PREPARE stmt5 FROM @sql5;
EXECUTE stmt5;
DEALLOCATE PREPARE stmt5;
-- ---------------------------------------------------------------------------
-- 4) Anotar las migraciones como aplicadas.
--
--    Esto evita que el proximo `php artisan migrate` del deploy intente crear
--    tablas que este archivo ya creo y falle. Los nombres tienen que coincidir
--    con los de database/migrations/.
--
--    Si preferis que las corras vos, comenta este bloque: pero en ese caso
--    importalo SOLO sobre una base ya migrada.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Solo se anota cada migracion si su efecto quedo REALMENTE aplicado. Asi el
-- archivo jamas le miente al registro: si la tabla categorias no existia, la
-- columna tono no se agrego, la migracion queda pendiente y un
-- php artisan migrate posterior la aplica bien. Sin esto, importar este
-- archivo sobre una base vacia dejaba la app sin la columna para siempre.

INSERT IGNORE INTO `migrations` (`migration`, `batch`)
SELECT '2026_09_27_202233_crear_catalagos_de_la_base', 1
WHERE (SELECT COUNT(*) FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME IN ('platos','niveles_picante','estados_pedido','tipos_promocion')) = 4;

INSERT IGNORE INTO `migrations` (`migration`, `batch`)
SELECT '2026_09_27_202234_agrega_el_tono_a_las_categorias', 1
WHERE (SELECT COUNT(*) FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'categorias'
         AND COLUMN_NAME = 'tono') > 0;

SET FOREIGN_KEY_CHECKS = 1;
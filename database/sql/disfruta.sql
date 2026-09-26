-- DISFRUTA · esquema y datos para MySQL 8 / MariaDB 10.6
-- Generado con: php artisan db:dump-mysql
-- IMPORTANTE: credenciales de base de datos NO se incluyen en este archivo.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================================
-- ESQUEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS `ajustes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `clave` varchar(255),
  `valor` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `ajustes` ADD UNIQUE INDEX `ajustes_clave_unique` (`clave`);


CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255),
  `nombre` varchar(255),
  `descripcion` varchar(255) DEFAULT NULL,
  `orden` int unsigned DEFAULT '0',
  `activo` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `categorias` ADD UNIQUE INDEX `categorias_slug_unique` (`slug`);


CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255),
  `telefono` varchar(255),
  `zona` varchar(255) DEFAULT NULL,
  `notas` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `clientes` ADD INDEX `clientes_telefono_index` (`telefono`);


CREATE TABLE IF NOT EXISTS `imagenes_producto` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` int unsigned,
  `ruta` varchar(255),
  `alt` varchar(255) DEFAULT NULL,
  `orden` int unsigned DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `imagenes_producto` ADD CONSTRAINT `fk_imagenes_producto_productos_producto_id`
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `lotes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` int unsigned,
  `codigo` varchar(255),
  `fecha_elaboracion` date,
  `fecha_consumo_recomendado` date,
  `cantidad` int unsigned,
  `restante` int unsigned,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `lotes` ADD INDEX `lotes_producto_id_restante_index` (`producto_id`, `restante`);
ALTER TABLE `lotes` ADD CONSTRAINT `fk_lotes_productos_producto_id`
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `pedido_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pedido_id` int unsigned,
  `producto_id` int unsigned DEFAULT NULL,
  `nombre` varchar(255),
  `precio` text,
  `cantidad` int unsigned,
  `reserva` tinyint(1) DEFAULT '0',
  `subtotal` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `pedido_items` ADD INDEX `pedido_items_pedido_id_index` (`pedido_id`);
ALTER TABLE `pedido_items` ADD CONSTRAINT `fk_pedido_items_productos_producto_id`
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
  ON DELETE SET NULL
  ON UPDATE RESTRICT;
ALTER TABLE `pedido_items` ADD CONSTRAINT `fk_pedido_items_pedidos_pedido_id`
  FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` int unsigned DEFAULT NULL,
  `cliente_nombre` varchar(255),
  `telefono` varchar(255),
  `zona` varchar(255) DEFAULT NULL,
  `notas` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT 'nuevo',
  `total` text DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `pedidos` ADD INDEX `pedidos_creado_index` (``);
ALTER TABLE `pedidos` ADD INDEX `pedidos_estado_index` (`estado`);
ALTER TABLE `pedidos` ADD CONSTRAINT `fk_pedidos_clientes_cliente_id`
  FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
  ON DELETE SET NULL
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `productos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `categoria_id` int unsigned,
  `nombre` varchar(255),
  `slug` varchar(255),
  `descripcion_corta` varchar(255),
  `descripcion` varchar(255),
  `precio` text,
  `precio_antes` text DEFAULT NULL,
  `presentacion` varchar(255),
  `nivel_picante` varchar(255) DEFAULT 'suave',
  `stock` int unsigned DEFAULT '0',
  `stock_minimo` int unsigned DEFAULT '0',
  `peso` int unsigned DEFAULT '0',
  `ingredientes` varchar(255) DEFAULT NULL,
  `platos_recomendados` varchar(255) DEFAULT NULL,
  `tono` varchar(255) DEFAULT NULL,
  `recomendacion_consumo` varchar(255) DEFAULT NULL,
  `conservacion` varchar(255) DEFAULT NULL,
  `insignia` varchar(255) DEFAULT NULL,
  `limitado` tinyint(1) DEFAULT '0',
  `temporada` tinyint(1) DEFAULT '0',
  `combo` tinyint(1) DEFAULT '0',
  `destacado` tinyint(1) DEFAULT '0',
  `activo` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `productos` ADD UNIQUE INDEX `productos_slug_unique` (`slug`);
ALTER TABLE `productos` ADD INDEX `productos_precio_index` (`precio`);
ALTER TABLE `productos` ADD INDEX `productos_activo_destacado_index` (`activo`, `destacado`);
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_categorias_categoria_id`
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `promocion_producto` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `promocion_id` int unsigned,
  `producto_id` int unsigned,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `promocion_producto` ADD UNIQUE INDEX `promocion_producto_promocion_id_producto_id_unique` (`promocion_id`, `producto_id`);
ALTER TABLE `promocion_producto` ADD CONSTRAINT `fk_promocion_producto_productos_producto_id`
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;
ALTER TABLE `promocion_producto` ADD CONSTRAINT `fk_promocion_producto_promociones_promocion_id`
  FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `promociones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255),
  `slug` varchar(255),
  `descripcion` varchar(255),
  `tipo` varchar(255) DEFAULT 'oferta',
  `descuento` int unsigned DEFAULT '0',
  `activa` tinyint(1) DEFAULT '1',
  `vigente_desde` date DEFAULT NULL,
  `vigente_hasta` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `promociones` ADD UNIQUE INDEX `promociones_slug_unique` (`slug`);


CREATE TABLE IF NOT EXISTS `resenas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` int unsigned,
  `autor` varchar(255),
  `estrellas` int unsigned,
  `texto` varchar(255),
  `visible` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `resenas` ADD INDEX `resenas_producto_id_visible_index` (`producto_id`, `visible`);
ALTER TABLE `resenas` ADD CONSTRAINT `fk_resenas_productos_producto_id`
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;


CREATE TABLE IF NOT EXISTS `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255),
  `email` varchar(255),
  `email_verified_at` datetime DEFAULT NULL,
  `password` varchar(255),
  `remember_token` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `users` ADD UNIQUE INDEX `users_email_unique` (`email`);


-- ============================================================
-- DATOS
-- ============================================================

INSERT INTO `ajustes` (`id`, `clave`, `valor`, `created_at`, `updated_at`) VALUES
  (1, 'whatsapp', 59170000000, NULL, NULL),
  (2, 'zonas_entrega', 'Sopocachi|Zona Sur|San Miguel|Achocalla|Cotocolma|Villa Fatima', NULL, NULL),
  (3, 'horario_atencion', 'Lunes a sábado de 9:00 a 19:00', NULL, NULL),
  (4, 'banco', NULL, NULL, NULL);

INSERT INTO `categorias` (`id`, `slug`, `nombre`, `descripcion`, `orden`, `activo`, `created_at`, `updated_at`) VALUES
  (1, 'encurtidos', 'Encurtidos', 'Cebollas, ajos y verduras en vinagre.', 0, 1, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (2, 'escabechos', 'Escabechos', 'Conservas en vinagre, aceite y especias.', 1, 1, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (3, 'picantes', 'Picantes', 'Del suave al que deja memoria.', 2, 1, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (4, 'ajos', 'Ajos', 'Ajo encurtido y en aceite de oliva.', 3, 1, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (5, 'combos', 'Combos', 'Packs de assorted para compartir.', 4, 1, '2026-09-26 01:00:18', '2026-09-26 01:00:18');

INSERT INTO `clientes` (`id`, `nombre`, `telefono`, `zona`, `notas`, `created_at`, `updated_at`) VALUES
  (1, 'Valentina Rojas', '+591 70111222', 'Sopocachi', 'Entregar por la tarde.', '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (2, 'Marcelo Salinas', '+591 71233445', 'Zona Sur', NULL, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (3, 'Camila Ferrufino', '+591 68455667', 'Achocalla', 'Sin cebolla en el combo.', '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (4, 'Diego Mamani', '+591 77688990', 'San Miguel', 'Reserva para el próximo lote.', '2026-09-26 01:00:18', '2026-09-26 01:00:18');

INSERT INTO `lotes` (`id`, `producto_id`, `codigo`, `fecha_elaboracion`, `fecha_consumo_recomendado`, `cantidad`, `restante`, `created_at`, `updated_at`) VALUES
  (1, 1, 'CM-2609-A', '2026-09-02 00:00:00', '2026-12-02 00:00:00', 20, 14, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (2, 1, 'CM-2609-B', '2026-09-16 00:00:00', '2026-12-16 00:00:00', 18, 10, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (3, 2, 'JE-2608-D', '2026-08-28 00:00:00', '2026-11-28 00:00:00', 16, 5, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (4, 2, 'JE-2609-A', '2026-09-12 00:00:00', '2026-12-12 00:00:00', 14, 13, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (5, 3, 'UE-2608-A', '2026-08-15 00:00:00', '2026-11-15 00:00:00', 20, 0, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (6, 4, 'HA-2609-L', '2026-09-05 00:00:00', '2026-12-05 00:00:00', 12, 7, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (7, 5, 'AE-2608-B', '2026-08-30 00:00:00', '2026-11-30 00:00:00', 15, 12, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (8, 6, 'PM-2607-C', '2026-07-20 00:00:00', '2026-10-20 00:00:00', 14, 3, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (9, 7, 'PQ-2609-A', '2026-09-10 00:00:00', '2026-12-10 00:00:00', 18, 15, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (10, 8, 'CPR-2609-A', '2026-09-12 00:00:00', '2026-12-12 00:00:00', 12, 9, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (11, 9, 'AV-2609-B', '2026-09-01 00:00:00', '2026-12-01 00:00:00', 18, 18, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (12, 10, 'PA-2607-A', '2026-07-28 00:00:00', '2026-10-28 00:00:00', 16, 0, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (13, 11, 'RT-2609-A', '2026-09-08 00:00:00', '2026-11-08 00:00:00', 16, 14, '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (14, 12, 'MP-2608-A', '2026-08-20 00:00:00', '2026-11-20 00:00:00', 12, 0, '2026-09-26 01:00:18', '2026-09-26 01:00:18');

INSERT INTO `pedido_items` (`id`, `pedido_id`, `producto_id`, `nombre`, `precio`, `cantidad`, `reserva`, `subtotal`) VALUES
  (1, 1, 3, 'Uchus en Escabeche Suave', 35, 2, 1, 70),
  (2, 1, 11, 'Relish de Tomate con Ajo', 34, 1, 0, 34),
  (3, 2, 9, 'Aceitunas Verdes con Mejorana', 32, 2, 0, 64),
  (4, 2, 1, 'Cebolla Morada Encurtida', 28, 3, 0, 84),
  (5, 2, 3, 'Uchus en Escabeche Suave', 35, 1, 1, 35),
  (6, 3, 12, 'Maíz Dulce con Chile Suave', 27, 3, 0, 81),
  (7, 3, 7, 'Escabeche para Pique Macho', 55, 3, 1, 165),
  (8, 4, 4, 'Habanero Ahumado', 38, 3, 0, 114),
  (9, 4, 12, 'Maíz Dulce con Chile Suave', 27, 1, 1, 27),
  (10, 4, 2, 'Jalapeños en Escabeche', 32, 3, 1, 96);

INSERT INTO `pedidos` (`id`, `cliente_id`, `cliente_nombre`, `telefono`, `zona`, `notas`, `estado`, `total`, `created_at`, `updated_at`) VALUES
  (1, 1, 'Valentina Rojas', '+591 70111222', 'Sopocachi', 'Entregar por la tarde.', 'entregado', 104, '2026-09-14 10:00:00', '2026-09-26 01:00:18'),
  (2, 2, 'Marcelo Salinas', '+591 71233445', 'Zona Sur', NULL, 'confirmado', 183, '2026-09-22 10:07:00', '2026-09-26 01:00:18'),
  (3, 3, 'Camila Ferrufino', '+591 68455667', 'Achocalla', 'Sin cebolla en el combo.', 'preparando', 246, '2026-09-24 10:14:00', '2026-09-26 01:00:18'),
  (4, 4, 'Diego Mamani', '+591 77688990', 'San Miguel', 'Reserva para el próximo lote.', 'nuevo', 237, '2026-09-26 10:21:00', '2026-09-26 01:00:18');

INSERT INTO `productos` (`id`, `categoria_id`, `nombre`, `slug`, `descripcion_corta`, `descripcion`, `precio`, `precio_antes`, `presentacion`, `nivel_picante`, `stock`, `stock_minimo`, `peso`, `ingredientes`, `platos_recomendados`, `tono`, `recomendacion_consumo`, `conservacion`, `insignia`, `limitado`, `temporada`, `combo`, `destacado`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES
  (1, 1, 'Cebolla Morada Encurtida', 'p-cebolla-morada', 'Crujiente, agridulce y rosada. La reina de la parrilla.', 'Cebolla morada cortada en pétalos finos y encurtida lentamente en vinagre de alcohol con sal marina, laurel y granos de pimienta. El resultado es una cebolla que mantiene el crocante, con un dulzor ácido muy equilibrado que se lleva perfecto la grasa de la carne a la parrilla.', 28, NULL, 'Frasco 350 g', 'suave', 24, 6, 350, '["Cebolla morada fresca","Vinagre de alcohol","Agua","Sal marina","Laurel","Pimienta en grano","Semillas de coriander"]', '["parrillada","choripan","carnes","hamburguesas","empanadas"]', '{"fondo":"#EFE3CC","contenido":"#C9A0D6","acento":"#8E4FA8","tapa":"#1F3D2B"}', 'Ideal para acompañar la carne asada y los choripanes. Untalo sobre el pan caliente apenas salido de la parrilla.', 'Conservar en lugar fresco y seco. Una vez abierto, refrigerar. Agitar antes de usar.', 'Más vendido', 0, 0, 0, 1, 1, '2026-01-15 09:00:00', '2026-09-26 01:00:18', NULL),
  (2, 2, 'Jalapeños en Escabeche', 'p-jalapeno-escabeche', 'Clásicos, con la semilla y ese punto justo de picante.', 'Jalapeños enteros sin semillas, escalados a vapor y conservados en escabeche de vinagre, aceite de oliva, ajo, orégano y chile guajillo. Textura firme, brillo aceitoso y ese picante medio que se va abriendo de a poco.', 32, NULL, 'Frasco 350 g', 'medio', 18, 5, 350, '["Jalape\\u00f1os frescos","Vinagre de alcohol","Aceite de oliva virgen extra","Ajo","Or\\u00e9gano","Chile guajillo","Sal marina"]', '["parrillada","tacos","hamburguesas","queso","pizzas"]', '{"fondo":"#F2E2CB","contenido":"#C8452F","acento":"#8E2A1B","tapa":"#1F3D2B"}', 'Para acompañar la parrilla, completar unos tacos o servirlo como entrada con queso y galletitas.', 'Guardar en lugar seco y fresco. Una vez abierto, refrigerar y consumir en 30 días.', 'Favorito de la casa', 0, 0, 0, 1, 1, '2026-01-15 09:00:00', '2026-09-26 01:00:18', NULL),
  (3, 3, 'Uchus en Escabeche Suave', 'p-uchu-escabeche', 'Picante redondo y de fondo que mancha, pero vale la pena.', 'Uchu amarillo entero y sin semillas, en escabeche de vinagre con ajo, cebolla y un toque de chile suave. Morderlo es un viaje: primero el dulzor del escabeche, después el ardor que crece y queda memoria de la comida entera.', 35, 40, 'Frasco 350 g', 'picante', 0, 4, 350, '["Uchu amarillo","Vinagre de alcohol","Agua","Ajo","Cebolla","Chili en polvo suave","Sal marina"]', '["parrillada","choripan","tacos","pique-macho","empanadas"]', '{"fondo":"#F0DFC4","contenido":"#D9741F","acento":"#A4500F","tapa":"#2D5439"}', 'Para los que quieren que la comida tenga un cambio de nivel. Cortalo en diagonal para que libere más picante.', 'Refrigerar una vez abierto. Agitar bien antes de servir.', 'Sin stock', 0, 0, 0, 1, 1, '2026-02-02 09:00:00', '2026-09-26 01:00:18', NULL),
  (4, 3, 'Habanero Ahumado', 'p-picante-habanero', 'Edición de temporada. Ahumado suave, picante de verdad.', 'Habaneros de huerta cepillados con humo de leña y luego encurtidos en vinagre con achiote suave y miel de caña. Es la edición más aguardada del año: limitada, aromática y con un picante que llega a temperatura.', 38, NULL, 'Frasco 220 g', 'muy-picante', 7, 4, 220, '["Habanero fresco","Vinagre de alcohol","Achiote","Miel de ca\\u00f1a","Ajo","Piment\\u00f3n ahumado","Sal marina"]', '["tacos","pique-macho","parrillada","pizzas","carnes"]', '{"fondo":"#F5DEC9","contenido":"#B23434","acento":"#7E1F1F","tapa":"#1F3D2B"}', 'Usalo en cantidades pequeñas al principio y siempre acompañado: la idea es que suba el calor de a poco.', 'Refrigeración permanente. Agitar antes de usar.', 'Edición limitada', 1, 1, 0, 0, 1, '2026-06-10 09:00:00', '2026-09-26 01:00:18', NULL),
  (5, 4, 'Ajo Encurtido Suave', 'p-ajo-encurtido', 'Dientes enteros y tiernos, para la carne o el pan.', 'Dientes de ajo nuevo enteros, escalados y encurtidos en vinagre con laurel, tomillo y un toque de pimentón dulce. Quedan tiernos y con un sabor suave que no pica. Imprescindible en la mesa.', 26, NULL, 'Frasco 220 g', 'suave', 12, 5, 220, '["Ajo nuevo","Vinagre de alcohol","Agua","Sal marina","Laurel","Tomillo","Piment\\u00f3n dulce"]', '["carnes","parrillada","pastas","papas","pizzas"]', '{"fondo":"#EDE6D2","contenido":"#E5D6A8","acento":"#B49A5A","tapa":"#1F3D2B"}', 'Acompañá la carne asada, las milanesas o las pastas. También va muy bien con queso fresco.', 'Lugar seco y fresco. Refrigerar una vez abierto.', NULL, 0, 0, 0, 1, 1, '2026-01-20 09:00:00', '2026-09-26 01:00:18', NULL),
  (6, 1, 'Pepinos con Semillas de Mostaza', 'p-pepino-queso', 'Crocentes, aromáticos, el clásico que nunca falla.', 'Pepinos encurtidos en vinagre con sal, dill, laurel y semillas de mostaza que les dan un perfume particular. Es el clásico de la mesa: crocante, ácido y perfecto para cortar la grasitud.', 30, NULL, 'Frasco 500 g', 'suave', 3, 5, 500, '["Pepino","Vinagre de alcohol","Agua","Sal marina","Semillas de mostaza","Dill","Laurel"]', '["choripan","parrillada","empanadas","queso","carnes"]', '{"fondo":"#E2E9DE","contenido":"#5E8C4E","acento":"#2D5439","tapa":"#C89B3C"}', 'El acompañante de la parrilla por excelencia. Agrégalos a la plancha final para que se calienten apenas.', 'Refrigerar después de abierto. Consumir en 30 días.', 'Últimos frascos', 0, 0, 0, 0, 1, '2026-01-25 09:00:00', '2026-09-26 01:00:18', NULL),
  (7, 5, 'Escabeche para Pique Macho', 'p-pique-macho', 'Ají, cebolla y morrón. Listo para el pique.', 'Nuestro escabeche más intenso: ají colorado, cebolla morada, morrón asado, ajo y orégano, todo en aceite y vinagre. Pensado y testeado para el pique macho: le da el picante justo y el aroma que la carne necesita.', 55, 65, 'Frasco 500 g', 'picante', 15, 5, 500, '["Aj\\u00ed colorado","Cebolla morada","Morr\\u00f3n asado","Ajo","Or\\u00e9gano","Vinagre","Aceite de oliva","Sal marina"]', '["pique-macho","carnes","parrillada","choripan","empanadas"]', '{"fondo":"#E9E0CE","contenido":"#B4623A","acento":"#7A3A1E","tapa":"#1F3D2B"}', 'Directo sobre la carne servida en la fuente. También perfecto para marinar pollo antes de la parrilla.', 'Refrigerar una vez abierto. Agitar antes de servir.', 'Para la parrilla', 0, 0, 0, 1, 1, '2026-03-05 09:00:00', '2026-09-26 01:00:18', NULL),
  (8, 5, 'Combo Parrillera DISFRUTA', 'p-combo-parrillada', 'Cebolla morada + escabeche para pique + jalapeños. Listo para la parrilla.', 'La caja con todo lo que no puede faltar el finde de la parrilla: Cebolla Morada Encurtida, Jalapeños en Escabeche y Escabeche para Pique Macho. Tres frascos, tres sabores, cero excusas para arrancar el asado bien.', 95, 120, 'Pack x3', 'medio', 9, 3, 1200, '["Cebolla morada encurtida 350 g","Jalape\\u00f1os en escabeche 350 g","Escabeche para pique macho 500 g"]', '["parrillada","pique-macho","choripan","carnes"]', '{"fondo":"#E9E0CE","contenido":"#B4623A","acento":"#7A3A1E","tapa":"#1F3D2B"}', 'Pensado para compartir entre 4 y 6 personas en un asado. Aguantan perfecto el viaje hasta la parrilla.', 'Cada frasco se conserva por separado, según su etiqueta. Guardar en lugar seco y fresco.', 'Ahorrás Bs 25', 0, 0, 1, 1, 1, '2026-04-01 09:00:00', '2026-09-26 01:00:18', NULL),
  (9, 1, 'Aceitunas Verdes con Mejorana', 'p-aceituna-verde', 'Suaves, saladas, con el toque de la mejorana.', 'Aceitunas verdes curadas en salmuera y luego encurtidas con vinagre, ajo, laurel y mejorana. Carnosas y nada amargas. La guarnición que le da un toque gourmet a toda la mesa.', 32, NULL, 'Frasco 350 g', 'suave', 21, 6, 350, '["Aceitunas verdes","Vinagre de alcohol","Agua","Sal marina","Ajo","Laurel","Mejorana"]', '["queso","carnes","parrillada","pizzas","pastas"]', '{"fondo":"#E2E9DE","contenido":"#5E8C4E","acento":"#2D5439","tapa":"#C89B3C"}', 'En la tabla de quesos, con una copa de tinto. Y como guarnición, junto a la carne asada.', 'Refrigerar una vez abierto. Conservar siempre sumergidas.', NULL, 0, 0, 0, 0, 1, '2026-02-18 09:00:00', '2026-09-26 01:00:18', NULL),
  (10, 2, 'Pimientos Asados al Escabeche', 'p-pimiento-aspado', 'Dulces, asados, en aceite y vinagre. La guarnición elegante.', 'Pimientos rojos y amarillos asados a la llama, pelados a mano y luego puestos en escabeche con ajo, laurel y aceite de oliva. Dulces, aromáticos, sin acidez pesada. Guarnecen cualquier plato.', 38, NULL, 'Frasco 350 g', 'suave', 0, 5, 350, '["Pimientos rojos","Pimientos amarillos","Vinagre de alcohol","Aceite de oliva","Ajo","Laurel","Az\\u00facar para balancear"]', '["carnes","parrillada","pastas","pizzas","queso"]', '{"fondo":"#F2E2CB","contenido":"#C8452F","acento":"#8E2A1B","tapa":"#1F3D2B"}', 'Como guarnición de la carne o de las pastas. Combinado con queso y pan casero.', 'Refrigerar una vez abierto. Agitar con cuidado.', 'Temporada · sin stock', 0, 1, 0, 0, 1, '2026-05-12 09:00:00', '2026-09-26 01:00:18', NULL),
  (11, 5, 'Relish de Tomate con Ajo', 'p-relish-tomate', 'El condimento que cambia todos los sánguches.', 'Tomates maduros licuados y reducidos lentamente con cebolla, ajo, pimentón ahumado, orégano y un toque de vinagre de manzana. Se conserva con aceite, como un buen relish casero. Ideal para hamburguesas y sánguches.', 34, NULL, 'Frasco 220 g', 'suave', 14, 5, 220, '["Tomate perita maduro","Cebolla","Ajo","Piment\\u00f3n ahumado","Or\\u00e9gano","Vinagre de manzana","Aceite de oliva"]', '["hamburguesas","choripan","pizzas","queso","empanadas"]', '{"fondo":"#E9E0CE","contenido":"#B4623A","acento":"#7A3A1E","tapa":"#1F3D2B"}', 'Una pintita sobre la carne de la hamburguesa o el pan de un sándwich. Cambia por completo el plato.', 'Refrigerado. Consumir en 20 días una vez abierto.', NULL, 0, 0, 0, 1, 1, '2026-03-20 09:00:00', '2026-09-26 01:00:18', NULL),
  (12, 3, 'Maíz Dulce con Chile Suave', 'p-maiz-picante', 'Dulce con un latigazo suave. Sorprende a todos.', 'Maíz dulce seleccionado y encurtido en vinagre con pimentón dulce, ajo y un toque de chile suave. El contraste dulce, ácido y picante lo convierte en el acompañamiento más PEDIDO del catálogo.', 27, NULL, 'Frasco 350 g', 'medio', 0, 4, 350, '["Ma\\u00edz dulce","Vinagre de alcohol","Agua","Sal marina","Piment\\u00f3n dulce","Ajo","Chile suave"]', '["parrillada","carnes","empanadas","pique-macho","tacos"]', '{"fondo":"#F4EAD4","contenido":"#E0B869","acento":"#A87A22","tapa":"#1F3D2B"}', 'Sumalo a la parrilla como guarnición sorpresa. También va bien en un guiso o una tortilla.', 'Refrigerar una vez abierto. Agitar antes de usar.', 'Sin stock · reservar', 0, 1, 0, 0, 1, '2026-07-01 09:00:00', '2026-09-26 01:00:18', NULL);

INSERT INTO `promocion_producto` (`id`, `promocion_id`, `producto_id`) VALUES
  (1, 1, 3),
  (2, 2, 8),
  (3, 3, 4),
  (4, 4, 6),
  (5, 5, 7);

INSERT INTO `promociones` (`id`, `titulo`, `slug`, `descripcion`, `tipo`, `descuento`, `activa`, `vigente_desde`, `vigente_hasta`, `created_at`, `updated_at`) VALUES
  (1, 'Oferta · Uchus en Escabeche', 'oferta-uchus-en-escabeche', 'Picante redondo con precio especial. Aprovechando el próximo lote: encargá el tuyo y lo tenés fresco en dos semanas.', 'oferta', 15, 1, NULL, '2026-10-15 00:00:00', '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (2, 'Combo Parrillera · Ahorro Bs 25', 'combo-parrillera-ahorro-bs-25', 'Cebolla morada, jalapeños y escabeche para pique macho. Todo lo que necesitás para arrancar la parrilla bien.', 'combo', 18, 1, NULL, '2026-12-31 00:00:00', '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (3, 'Temporada · Habanero Ahumado', 'temporada-habanero-ahumado', 'Edición limitada elaborada con habaneros de huerta. Poca producción, sabor muy nuestro.', 'temporada', 0, 1, NULL, '2026-11-30 00:00:00', '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (4, 'Últimos frascos · Pepinos con Mostaza', 'ultimos-frascos-pepinos-con-mostaza', 'Quedan 3 frascos del lote de julio. Cuando terminen, la producción se reinicia en octubre.', 'limitado', 10, 1, NULL, '2026-10-05 00:00:00', '2026-09-26 01:00:18', '2026-09-26 01:00:18'),
  (5, 'Oferta · Escabeche para Pique Macho', 'oferta-escabeche-para-pique-macho', 'Escabeche de ají colorado, cebolla morada y morrón asado. El condimento que estaba faltando en tu asado.', 'oferta', 12, 1, NULL, '2026-10-31 00:00:00', '2026-09-26 01:00:18', '2026-09-26 01:00:18');

INSERT INTO `resenas` (`id`, `producto_id`, `autor`, `estrellas`, `texto`, `visible`, `created_at`, `updated_at`) VALUES
  (1, 1, 'Valentina R.', 5, 'La cebolla va tremenda con la parrilla. Se nota que es casera de verdad, nada de sabor raro como los industrializados.', 1, '2026-09-18 12:00:00', '2026-09-26 01:00:18'),
  (2, 1, 'Marcos G.', 5, 'Le pongo a todas las hamburguesas que hago. La textura es increíble, sigue crocante.', 1, '2026-09-11 12:00:00', '2026-09-26 01:00:18'),
  (3, 2, 'Sofía A.', 4, 'Excelente escabeche, tiene buen picor. Lo usé para unos tacos y quedaron bárbaros.', 1, '2026-09-14 12:00:00', '2026-09-26 01:00:18'),
  (4, 3, 'Damián L.', 5, 'Ojo que pica en serio. Si te gusta el picante, este es el que tenés que llevar a la parrilla.', 1, '2026-09-06 12:00:00', '2026-09-26 01:00:18'),
  (5, 8, 'Familia Torres', 5, 'Compramos el combo para el asado del domingo y fue un éxito. Se nos terminó en dos horas.', 1, '2026-09-20 12:00:00', '2026-09-26 01:00:18'),
  (6, 11, 'Laura M.', 5, 'El relish cambió mis hamburguesas. Sabor a casero, te juro.', 1, '2026-09-09 12:00:00', '2026-09-26 01:00:18'),
  (7, 5, 'Andrés P.', 4, 'Muy bueno, tierno y sin picar. Ideal para la carne asada.', 1, '2026-08-30 12:00:00', '2026-09-26 01:00:18'),
  (8, 4, 'Carla B.', 5, 'De lo mejor que probé. La edición limitada vale la pena.', 1, '2026-09-21 12:00:00', '2026-09-26 01:00:18'),
  (9, 7, 'Nico V.', 5, 'Justo lo que buscaba para el pique. El morrón asado le da una vuelta tremenda.', 1, '2026-09-15 12:00:00', '2026-09-26 01:00:18'),
  (10, 6, 'Rocío S.', 4, 'Los pepinos de siempre, muy buenos. Ojalá hagan más seguido.', 1, '2026-08-25 12:00:00', '2026-09-26 01:00:18');

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `is_admin`) VALUES
  (1, 'Administrador', 'admin@disfruta.bo', NULL, '$2y$12$JGO/iuHK08ltmHv1eZcNSeo.9IcqinfBWcl0noepHY1uZ3P4AcgvW', NULL, '2026-09-26 01:00:18', '2026-09-26 01:00:18', 1);

-- ============================================================
-- FIN DEL DUMP
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;

-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: disfruta
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ajustes`
--

DROP TABLE IF EXISTS `ajustes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ajustes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `clave` varchar(255) NOT NULL,
  `valor` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ajustes_clave_unique` (`clave`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ajustes`
--

LOCK TABLES `ajustes` WRITE;
/*!40000 ALTER TABLE `ajustes` DISABLE KEYS */;
INSERT INTO `ajustes` VALUES (1,'whatsapp','59170000000',NULL,NULL),(2,'zonas_entrega','Sopocachi|Zona Sur|San Miguel|Achocalla|Cotocolma|Villa Fatima',NULL,NULL),(3,'horario_atencion','Lunes a s├íbado de 9:00 a 19:00',NULL,NULL),(4,'banco',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ajustes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `orden` smallint(5) unsigned NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categorias_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'encurtidos','Encurtidos','Cebollas, ajos y verduras en vinagre.',0,1,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(2,'escabechos','Escabechos','Conservas en vinagre, aceite y especias.',1,1,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(3,'picantes','Picantes','Del suave al que deja memoria.',2,1,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(4,'ajos','Ajos','Ajo encurtido y en aceite de oliva.',3,1,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(5,'combos','Combos','Packs de assorted para compartir.',4,1,'2026-09-26 18:48:48','2026-09-26 18:48:48');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(40) NOT NULL,
  `zona` varchar(80) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clientes_telefono_index` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Valentina Rojas','+591 70111222','Sopocachi','Entregar por la tarde.','2026-09-26 18:48:48','2026-09-26 18:48:48'),(2,'Marcelo Salinas','+591 71233445','Zona Sur',NULL,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(3,'Camila Ferrufino','+591 68455667','Achocalla','Sin cebolla en el combo.','2026-09-26 18:48:48','2026-09-26 18:48:48'),(4,'Diego Mamani','+591 77688990','San Miguel','Reserva para el pr├│ximo lote.','2026-09-26 18:48:48','2026-09-26 18:48:48');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes_producto`
--

DROP TABLE IF EXISTS `imagenes_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `imagenes_producto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `alt` varchar(160) DEFAULT NULL,
  `orden` smallint(5) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `imagenes_producto_producto_id_foreign` (`producto_id`),
  CONSTRAINT `imagenes_producto_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes_producto`
--

LOCK TABLES `imagenes_producto` WRITE;
/*!40000 ALTER TABLE `imagenes_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagenes_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lotes`
--

DROP TABLE IF EXISTS `lotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lotes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `codigo` varchar(40) NOT NULL,
  `fecha_elaboracion` date NOT NULL,
  `fecha_consumo_recomendado` date NOT NULL,
  `cantidad` int(10) unsigned NOT NULL,
  `restante` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lotes_producto_id_restante_index` (`producto_id`,`restante`),
  CONSTRAINT `lotes_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lotes`
--

LOCK TABLES `lotes` WRITE;
/*!40000 ALTER TABLE `lotes` DISABLE KEYS */;
INSERT INTO `lotes` VALUES (1,1,'CM-2609-A','2026-09-02','2026-12-02',20,14,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(2,1,'CM-2609-B','2026-09-16','2026-12-16',18,10,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(3,2,'JE-2608-D','2026-08-28','2026-11-28',16,5,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(4,2,'JE-2609-A','2026-09-12','2026-12-12',14,13,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(5,3,'UE-2608-A','2026-08-15','2026-11-15',20,0,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(6,4,'HA-2609-L','2026-09-05','2026-12-05',12,7,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(7,5,'AE-2608-B','2026-08-30','2026-11-30',15,12,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(8,6,'PM-2607-C','2026-07-20','2026-10-20',14,3,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(9,7,'PQ-2609-A','2026-09-10','2026-12-10',18,15,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(10,8,'CPR-2609-A','2026-09-12','2026-12-12',12,9,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(11,9,'AV-2609-B','2026-09-01','2026-12-01',18,18,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(12,10,'PA-2607-A','2026-07-28','2026-10-28',16,0,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(13,11,'RT-2609-A','2026-09-08','2026-11-08',16,14,'2026-09-26 18:48:48','2026-09-26 18:48:48'),(14,12,'MP-2608-A','2026-08-20','2026-11-20',12,0,'2026-09-26 18:48:48','2026-09-26 18:48:48');
/*!40000 ALTER TABLE `lotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_items`
--

DROP TABLE IF EXISTS `pedido_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint(20) unsigned NOT NULL,
  `producto_id` bigint(20) unsigned DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `cantidad` int(10) unsigned NOT NULL,
  `reserva` tinyint(1) NOT NULL DEFAULT 0,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_items_producto_id_foreign` (`producto_id`),
  KEY `pedido_items_pedido_id_index` (`pedido_id`),
  CONSTRAINT `pedido_items_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedido_items_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_items`
--

LOCK TABLES `pedido_items` WRITE;
/*!40000 ALTER TABLE `pedido_items` DISABLE KEYS */;
INSERT INTO `pedido_items` VALUES (1,1,2,'Jalape├▒os en Escabeche',32.00,2,0,64.00),(2,1,4,'Habanero Ahumado',38.00,1,1,38.00),(3,1,6,'Pepinos con Semillas de Mostaza',30.00,1,0,30.00),(4,2,6,'Pepinos con Semillas de Mostaza',30.00,3,0,90.00),(5,2,12,'Ma├¡z Dulce con Chile Suave',27.00,1,0,27.00),(6,3,3,'Uchus en Escabeche Suave',35.00,2,0,70.00),(7,3,4,'Habanero Ahumado',38.00,2,0,76.00),(8,3,6,'Pepinos con Semillas de Mostaza',30.00,3,1,90.00),(9,4,5,'Ajo Encurtido Suave',26.00,1,0,26.00),(10,4,10,'Pimientos Asados al Escabeche',38.00,1,1,38.00);
/*!40000 ALTER TABLE `pedido_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedidos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) unsigned DEFAULT NULL,
  `cliente_nombre` varchar(255) NOT NULL,
  `telefono` varchar(40) NOT NULL,
  `zona` varchar(80) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'nuevo',
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidos_cliente_id_foreign` (`cliente_id`),
  KEY `pedidos_estado_index` (`estado`),
  KEY `pedidos_created_at_index` (`created_at`),
  CONSTRAINT `pedidos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,'Valentina Rojas','+591 70111222','Sopocachi','Entregar por la tarde.','entregado',132.00,'2026-09-14 14:00:00','2026-09-26 18:48:48'),(2,2,'Marcelo Salinas','+591 71233445','Zona Sur',NULL,'confirmado',117.00,'2026-09-22 14:07:00','2026-09-26 18:48:48'),(3,3,'Camila Ferrufino','+591 68455667','Achocalla','Sin cebolla en el combo.','preparando',236.00,'2026-09-24 14:14:00','2026-09-26 18:48:48'),(4,4,'Diego Mamani','+591 77688990','San Miguel','Reserva para el pr├│ximo lote.','nuevo',64.00,'2026-09-26 14:21:00','2026-09-26 18:48:48');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `categoria_id` bigint(20) unsigned NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion_corta` varchar(300) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `precio_antes` decimal(10,2) DEFAULT NULL,
  `presentacion` varchar(60) NOT NULL,
  `nivel_picante` varchar(20) NOT NULL DEFAULT 'suave',
  `stock` int(10) unsigned NOT NULL DEFAULT 0,
  `stock_minimo` int(10) unsigned NOT NULL DEFAULT 0,
  `peso` int(10) unsigned NOT NULL DEFAULT 0,
  `ingredientes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ingredientes`)),
  `platos_recomendados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`platos_recomendados`)),
  `tono` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tono`)),
  `recomendacion_consumo` text DEFAULT NULL,
  `conservacion` text DEFAULT NULL,
  `insignia` varchar(40) DEFAULT NULL,
  `limitado` tinyint(1) NOT NULL DEFAULT 0,
  `temporada` tinyint(1) NOT NULL DEFAULT 0,
  `combo` tinyint(1) NOT NULL DEFAULT 0,
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `productos_slug_unique` (`slug`),
  KEY `productos_categoria_id_foreign` (`categoria_id`),
  KEY `productos_activo_destacado_index` (`activo`,`destacado`),
  KEY `productos_precio_index` (`precio`),
  CONSTRAINT `productos_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,'Cebolla Morada Encurtida','p-cebolla-morada','Crujiente, agridulce y rosada. La reina de la parrilla.','Cebolla morada cortada en p├®talos finos y encurtida lentamente en vinagre de alcohol con sal marina, laurel y granos de pimienta. El resultado es una cebolla que mantiene el crocante, con un dulzor ├ícido muy equilibrado que se lleva perfecto la grasa de la carne a la parrilla.',28.00,NULL,'Frasco 350 g','suave',24,6,350,'[\"Cebolla morada fresca\",\"Vinagre de alcohol\",\"Agua\",\"Sal marina\",\"Laurel\",\"Pimienta en grano\",\"Semillas de coriander\"]','[\"parrillada\",\"choripan\",\"carnes\",\"hamburguesas\",\"empanadas\"]','{\"fondo\":\"#EFE3CC\",\"contenido\":\"#C9A0D6\",\"acento\":\"#8E4FA8\",\"tapa\":\"#1F3D2B\"}','Ideal para acompa├▒ar la carne asada y los choripanes. Untalo sobre el pan caliente apenas salido de la parrilla.','Conservar en lugar fresco y seco. Una vez abierto, refrigerar. Agitar antes de usar.','M├ís vendido',0,0,0,1,1,'2026-01-15 13:00:00','2026-09-26 18:48:48',NULL),(2,2,'Jalape├▒os en Escabeche','p-jalapeno-escabeche','Cl├ísicos, con la semilla y ese punto justo de picante.','Jalape├▒os enteros sin semillas, escalados a vapor y conservados en escabeche de vinagre, aceite de oliva, ajo, or├®gano y chile guajillo. Textura firme, brillo aceitoso y ese picante medio que se va abriendo de a poco.',32.00,NULL,'Frasco 350 g','medio',18,5,350,'[\"Jalape\\u00f1os frescos\",\"Vinagre de alcohol\",\"Aceite de oliva virgen extra\",\"Ajo\",\"Or\\u00e9gano\",\"Chile guajillo\",\"Sal marina\"]','[\"parrillada\",\"tacos\",\"hamburguesas\",\"queso\",\"pizzas\"]','{\"fondo\":\"#F2E2CB\",\"contenido\":\"#C8452F\",\"acento\":\"#8E2A1B\",\"tapa\":\"#1F3D2B\"}','Para acompa├▒ar la parrilla, completar unos tacos o servirlo como entrada con queso y galletitas.','Guardar en lugar seco y fresco. Una vez abierto, refrigerar y consumir en 30 d├¡as.','Favorito de la casa',0,0,0,1,1,'2026-01-15 13:00:00','2026-09-26 18:48:48',NULL),(3,3,'Uchus en Escabeche Suave','p-uchu-escabeche','Picante redondo y de fondo que mancha, pero vale la pena.','Uchu amarillo entero y sin semillas, en escabeche de vinagre con ajo, cebolla y un toque de chile suave. Morderlo es un viaje: primero el dulzor del escabeche, despu├®s el ardor que crece y queda memoria de la comida entera.',35.00,40.00,'Frasco 350 g','picante',0,4,350,'[\"Uchu amarillo\",\"Vinagre de alcohol\",\"Agua\",\"Ajo\",\"Cebolla\",\"Chili en polvo suave\",\"Sal marina\"]','[\"parrillada\",\"choripan\",\"tacos\",\"pique-macho\",\"empanadas\"]','{\"fondo\":\"#F0DFC4\",\"contenido\":\"#D9741F\",\"acento\":\"#A4500F\",\"tapa\":\"#2D5439\"}','Para los que quieren que la comida tenga un cambio de nivel. Cortalo en diagonal para que libere m├ís picante.','Refrigerar una vez abierto. Agitar bien antes de servir.','Sin stock',0,0,0,1,1,'2026-02-02 13:00:00','2026-09-26 18:48:48',NULL),(4,3,'Habanero Ahumado','p-picante-habanero','Edici├│n de temporada. Ahumado suave, picante de verdad.','Habaneros de huerta cepillados con humo de le├▒a y luego encurtidos en vinagre con achiote suave y miel de ca├▒a. Es la edici├│n m├ís aguardada del a├▒o: limitada, arom├ítica y con un picante que llega a temperatura.',38.00,NULL,'Frasco 220 g','muy-picante',7,4,220,'[\"Habanero fresco\",\"Vinagre de alcohol\",\"Achiote\",\"Miel de ca\\u00f1a\",\"Ajo\",\"Piment\\u00f3n ahumado\",\"Sal marina\"]','[\"tacos\",\"pique-macho\",\"parrillada\",\"pizzas\",\"carnes\"]','{\"fondo\":\"#F5DEC9\",\"contenido\":\"#B23434\",\"acento\":\"#7E1F1F\",\"tapa\":\"#1F3D2B\"}','Usalo en cantidades peque├▒as al principio y siempre acompa├▒ado: la idea es que suba el calor de a poco.','Refrigeraci├│n permanente. Agitar antes de usar.','Edici├│n limitada',1,1,0,0,1,'2026-06-10 13:00:00','2026-09-26 18:48:48',NULL),(5,4,'Ajo Encurtido Suave','p-ajo-encurtido','Dientes enteros y tiernos, para la carne o el pan.','Dientes de ajo nuevo enteros, escalados y encurtidos en vinagre con laurel, tomillo y un toque de piment├│n dulce. Quedan tiernos y con un sabor suave que no pica. Imprescindible en la mesa.',26.00,NULL,'Frasco 220 g','suave',12,5,220,'[\"Ajo nuevo\",\"Vinagre de alcohol\",\"Agua\",\"Sal marina\",\"Laurel\",\"Tomillo\",\"Piment\\u00f3n dulce\"]','[\"carnes\",\"parrillada\",\"pastas\",\"papas\",\"pizzas\"]','{\"fondo\":\"#EDE6D2\",\"contenido\":\"#E5D6A8\",\"acento\":\"#B49A5A\",\"tapa\":\"#1F3D2B\"}','Acompa├▒├í la carne asada, las milanesas o las pastas. Tambi├®n va muy bien con queso fresco.','Lugar seco y fresco. Refrigerar una vez abierto.',NULL,0,0,0,1,1,'2026-01-20 13:00:00','2026-09-26 18:48:48',NULL),(6,1,'Pepinos con Semillas de Mostaza','p-pepino-queso','Crocentes, arom├íticos, el cl├ísico que nunca falla.','Pepinos encurtidos en vinagre con sal, dill, laurel y semillas de mostaza que les dan un perfume particular. Es el cl├ísico de la mesa: crocante, ├ícido y perfecto para cortar la grasitud.',30.00,NULL,'Frasco 500 g','suave',3,5,500,'[\"Pepino\",\"Vinagre de alcohol\",\"Agua\",\"Sal marina\",\"Semillas de mostaza\",\"Dill\",\"Laurel\"]','[\"choripan\",\"parrillada\",\"empanadas\",\"queso\",\"carnes\"]','{\"fondo\":\"#E2E9DE\",\"contenido\":\"#5E8C4E\",\"acento\":\"#2D5439\",\"tapa\":\"#C89B3C\"}','El acompa├▒ante de la parrilla por excelencia. Agr├®galos a la plancha final para que se calienten apenas.','Refrigerar despu├®s de abierto. Consumir en 30 d├¡as.','├Ültimos frascos',0,0,0,0,1,'2026-01-25 13:00:00','2026-09-26 18:48:48',NULL),(7,5,'Escabeche para Pique Macho','p-pique-macho','Aj├¡, cebolla y morr├│n. Listo para el pique.','Nuestro escabeche m├ís intenso: aj├¡ colorado, cebolla morada, morr├│n asado, ajo y or├®gano, todo en aceite y vinagre. Pensado y testeado para el pique macho: le da el picante justo y el aroma que la carne necesita.',55.00,65.00,'Frasco 500 g','picante',15,5,500,'[\"Aj\\u00ed colorado\",\"Cebolla morada\",\"Morr\\u00f3n asado\",\"Ajo\",\"Or\\u00e9gano\",\"Vinagre\",\"Aceite de oliva\",\"Sal marina\"]','[\"pique-macho\",\"carnes\",\"parrillada\",\"choripan\",\"empanadas\"]','{\"fondo\":\"#E9E0CE\",\"contenido\":\"#B4623A\",\"acento\":\"#7A3A1E\",\"tapa\":\"#1F3D2B\"}','Directo sobre la carne servida en la fuente. Tambi├®n perfecto para marinar pollo antes de la parrilla.','Refrigerar una vez abierto. Agitar antes de servir.','Para la parrilla',0,0,0,1,1,'2026-03-05 13:00:00','2026-09-26 18:48:48',NULL),(8,5,'Combo Parrillera DISFRUTA','p-combo-parrillada','Cebolla morada + escabeche para pique + jalape├▒os. Listo para la parrilla.','La caja con todo lo que no puede faltar el finde de la parrilla: Cebolla Morada Encurtida, Jalape├▒os en Escabeche y Escabeche para Pique Macho. Tres frascos, tres sabores, cero excusas para arrancar el asado bien.',95.00,120.00,'Pack x3','medio',9,3,1200,'[\"Cebolla morada encurtida 350 g\",\"Jalape\\u00f1os en escabeche 350 g\",\"Escabeche para pique macho 500 g\"]','[\"parrillada\",\"pique-macho\",\"choripan\",\"carnes\"]','{\"fondo\":\"#E9E0CE\",\"contenido\":\"#B4623A\",\"acento\":\"#7A3A1E\",\"tapa\":\"#1F3D2B\"}','Pensado para compartir entre 4 y 6 personas en un asado. Aguantan perfecto el viaje hasta la parrilla.','Cada frasco se conserva por separado, seg├║n su etiqueta. Guardar en lugar seco y fresco.','Ahorr├ís Bs 25',0,0,1,1,1,'2026-04-01 13:00:00','2026-09-26 18:48:48',NULL),(9,1,'Aceitunas Verdes con Mejorana','p-aceituna-verde','Suaves, saladas, con el toque de la mejorana.','Aceitunas verdes curadas en salmuera y luego encurtidas con vinagre, ajo, laurel y mejorana. Carnosas y nada amargas. La guarnici├│n que le da un toque gourmet a toda la mesa.',32.00,NULL,'Frasco 350 g','suave',18,6,350,'[\"Aceitunas verdes\",\"Vinagre de alcohol\",\"Agua\",\"Sal marina\",\"Ajo\",\"Laurel\",\"Mejorana\"]','[\"queso\",\"carnes\",\"parrillada\",\"pizzas\",\"pastas\"]','{\"fondo\":\"#E2E9DE\",\"contenido\":\"#5E8C4E\",\"acento\":\"#2D5439\",\"tapa\":\"#C89B3C\"}','En la tabla de quesos, con una copa de tinto. Y como guarnici├│n, junto a la carne asada.','Refrigerar una vez abierto. Conservar siempre sumergidas.',NULL,0,0,0,0,1,'2026-02-18 13:00:00','2026-09-26 18:48:48',NULL),(10,2,'Pimientos Asados al Escabeche','p-pimiento-aspado','Dulces, asados, en aceite y vinagre. La guarnici├│n elegante.','Pimientos rojos y amarillos asados a la llama, pelados a mano y luego puestos en escabeche con ajo, laurel y aceite de oliva. Dulces, arom├íticos, sin acidez pesada. Guarnecen cualquier plato.',38.00,NULL,'Frasco 350 g','suave',0,5,350,'[\"Pimientos rojos\",\"Pimientos amarillos\",\"Vinagre de alcohol\",\"Aceite de oliva\",\"Ajo\",\"Laurel\",\"Az\\u00facar para balancear\"]','[\"carnes\",\"parrillada\",\"pastas\",\"pizzas\",\"queso\"]','{\"fondo\":\"#F2E2CB\",\"contenido\":\"#C8452F\",\"acento\":\"#8E2A1B\",\"tapa\":\"#1F3D2B\"}','Como guarnici├│n de la carne o de las pastas. Combinado con queso y pan casero.','Refrigerar una vez abierto. Agitar con cuidado.','Temporada ┬À sin stock',0,1,0,0,1,'2026-05-12 13:00:00','2026-09-26 18:48:48',NULL),(11,5,'Relish de Tomate con Ajo','p-relish-tomate','El condimento que cambia todos los s├ínguches.','Tomates maduros licuados y reducidos lentamente con cebolla, ajo, piment├│n ahumado, or├®gano y un toque de vinagre de manzana. Se conserva con aceite, como un buen relish casero. Ideal para hamburguesas y s├ínguches.',34.00,NULL,'Frasco 220 g','suave',14,5,220,'[\"Tomate perita maduro\",\"Cebolla\",\"Ajo\",\"Piment\\u00f3n ahumado\",\"Or\\u00e9gano\",\"Vinagre de manzana\",\"Aceite de oliva\"]','[\"hamburguesas\",\"choripan\",\"pizzas\",\"queso\",\"empanadas\"]','{\"fondo\":\"#E9E0CE\",\"contenido\":\"#B4623A\",\"acento\":\"#7A3A1E\",\"tapa\":\"#1F3D2B\"}','Una pintita sobre la carne de la hamburguesa o el pan de un s├índwich. Cambia por completo el plato.','Refrigerado. Consumir en 20 d├¡as una vez abierto.',NULL,0,0,0,1,1,'2026-03-20 13:00:00','2026-09-26 18:48:48',NULL),(12,3,'Ma├¡z Dulce con Chile Suave','p-maiz-picante','Dulce con un latigazo suave. Sorprende a todos.','Ma├¡z dulce seleccionado y encurtido en vinagre con piment├│n dulce, ajo y un toque de chile suave. El contraste dulce, ├ícido y picante lo convierte en el acompa├▒amiento m├ís PEDIDO del cat├ílogo.',27.00,NULL,'Frasco 350 g','medio',0,4,350,'[\"Ma\\u00edz dulce\",\"Vinagre de alcohol\",\"Agua\",\"Sal marina\",\"Piment\\u00f3n dulce\",\"Ajo\",\"Chile suave\"]','[\"parrillada\",\"carnes\",\"empanadas\",\"pique-macho\",\"tacos\"]','{\"fondo\":\"#F4EAD4\",\"contenido\":\"#E0B869\",\"acento\":\"#A87A22\",\"tapa\":\"#1F3D2B\"}','Sumalo a la parrilla como guarnici├│n sorpresa. Tambi├®n va bien en un guiso o una tortilla.','Refrigerar una vez abierto. Agitar antes de usar.','Sin stock ┬À reservar',0,1,0,0,1,'2026-07-01 13:00:00','2026-09-26 18:48:48',NULL);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion_producto`
--

DROP TABLE IF EXISTS `promocion_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promocion_producto` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `promocion_id` bigint(20) unsigned NOT NULL,
  `producto_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promocion_producto_promocion_id_producto_id_unique` (`promocion_id`,`producto_id`),
  KEY `promocion_producto_producto_id_foreign` (`producto_id`),
  CONSTRAINT `promocion_producto_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promocion_producto_promocion_id_foreign` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion_producto`
--

LOCK TABLES `promocion_producto` WRITE;
/*!40000 ALTER TABLE `promocion_producto` DISABLE KEYS */;
INSERT INTO `promocion_producto` VALUES (1,1,3),(2,2,8),(3,3,4),(4,4,6),(5,5,7);
/*!40000 ALTER TABLE `promocion_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promociones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo` varchar(20) NOT NULL DEFAULT 'oferta',
  `descuento` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `vigente_desde` date DEFAULT NULL,
  `vigente_hasta` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promociones_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (1,'Oferta ┬À Uchus en Escabeche','oferta-uchus-en-escabeche','Picante redondo con precio especial. Aprovechando el pr├│ximo lote: encarg├í el tuyo y lo ten├®s fresco en dos semanas.','oferta',15,1,NULL,'2026-10-15','2026-09-26 18:48:48','2026-09-26 18:48:48'),(2,'Combo Parrillera ┬À Ahorro Bs 25','combo-parrillera-ahorro-bs-25','Cebolla morada, jalape├▒os y escabeche para pique macho. Todo lo que necesit├ís para arrancar la parrilla bien.','combo',18,1,NULL,'2026-12-31','2026-09-26 18:48:48','2026-09-26 18:48:48'),(3,'Temporada ┬À Habanero Ahumado','temporada-habanero-ahumado','Edici├│n limitada elaborada con habaneros de huerta. Poca producci├│n, sabor muy nuestro.','temporada',0,1,NULL,'2026-11-30','2026-09-26 18:48:48','2026-09-26 18:48:48'),(4,'├Ültimos frascos ┬À Pepinos con Mostaza','ultimos-frascos-pepinos-con-mostaza','Quedan 3 frascos del lote de julio. Cuando terminen, la producci├│n se reinicia en octubre.','limitado',10,1,NULL,'2026-10-05','2026-09-26 18:48:48','2026-09-26 18:48:48'),(5,'Oferta ┬À Escabeche para Pique Macho','oferta-escabeche-para-pique-macho','Escabeche de aj├¡ colorado, cebolla morada y morr├│n asado. El condimento que estaba faltando en tu asado.','oferta',12,1,NULL,'2026-10-31','2026-09-26 18:48:48','2026-09-26 18:48:48');
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resenas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `producto_id` bigint(20) unsigned NOT NULL,
  `autor` varchar(255) NOT NULL,
  `estrellas` tinyint(3) unsigned NOT NULL,
  `texto` text NOT NULL,
  `visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `resenas_producto_id_visible_index` (`producto_id`,`visible`),
  CONSTRAINT `resenas_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (1,1,'Valentina R.',5,'La cebolla va tremenda con la parrilla. Se nota que es casera de verdad, nada de sabor raro como los industrializados.',1,'2026-09-18 16:00:00','2026-09-26 18:48:48'),(2,1,'Marcos G.',5,'Le pongo a todas las hamburguesas que hago. La textura es incre├¡ble, sigue crocante.',1,'2026-09-11 16:00:00','2026-09-26 18:48:48'),(3,2,'Sof├¡a A.',4,'Excelente escabeche, tiene buen picor. Lo us├® para unos tacos y quedaron b├írbaros.',1,'2026-09-14 16:00:00','2026-09-26 18:48:48'),(4,3,'Dami├ín L.',5,'Ojo que pica en serio. Si te gusta el picante, este es el que ten├®s que llevar a la parrilla.',1,'2026-09-06 16:00:00','2026-09-26 18:48:48'),(5,8,'Familia Torres',5,'Compramos el combo para el asado del domingo y fue un ├®xito. Se nos termin├│ en dos horas.',1,'2026-09-20 16:00:00','2026-09-26 18:48:48'),(6,11,'Laura M.',5,'El relish cambi├│ mis hamburguesas. Sabor a casero, te juro.',1,'2026-09-09 16:00:00','2026-09-26 18:48:48'),(7,5,'Andr├®s P.',4,'Muy bueno, tierno y sin picar. Ideal para la carne asada.',1,'2026-08-30 16:00:00','2026-09-26 18:48:48'),(8,4,'Carla B.',5,'De lo mejor que prob├®. La edici├│n limitada vale la pena.',1,'2026-09-21 16:00:00','2026-09-26 18:48:48'),(9,7,'Nico V.',5,'Justo lo que buscaba para el pique. El morr├│n asado le da una vuelta tremenda.',1,'2026-09-15 16:00:00','2026-09-26 18:48:48'),(10,6,'Roc├¡o S.',4,'Los pepinos de siempre, muy buenos. Ojal├í hagan m├ís seguido.',1,'2026-08-25 16:00:00','2026-09-26 18:48:48');
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed

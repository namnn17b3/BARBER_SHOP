-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: barbershop_hair_color_service
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `color_image`
--

DROP TABLE IF EXISTS `color_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `hair_color_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfkx9wgricrdo5ydi52dju5fyd` (`hair_color_id`),
  CONSTRAINT `FKfkx9wgricrdo5ydi52dju5fyd` FOREIGN KEY (`hair_color_id`) REFERENCES `hair_color` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color_image`
--

LOCK TABLES `color_image` WRITE;
/*!40000 ALTER TABLE `color_image` DISABLE KEYS */;
INSERT INTO `color_image` VALUES (1,'2024-09-13 13:08:28.379000','2024-09-13 13:08:28.379000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_1.jpg',1),(2,'2024-09-13 13:08:28.383000','2024-09-13 13:08:28.383000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_2.jpg',1),(3,'2024-09-13 13:08:28.386000','2024-09-13 13:08:28.386000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_3.jpg',1),(4,'2024-09-13 13:08:28.388000','2024-09-13 13:08:28.388000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_4.jpg',1),(5,'2024-09-13 13:08:28.391000','2024-09-13 13:08:28.391000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_5.jpg',1),(6,'2024-09-13 13:08:28.394000','2024-09-13 13:08:28.394000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_6.jpg',1),(7,'2024-09-13 13:08:28.397000','2024-09-13 13:08:28.397000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_7.jpg',1),(8,'2024-09-13 13:08:28.399000','2024-09-13 13:08:28.399000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_8.jpg',1),(9,'2024-09-13 13:08:28.400000','2024-09-13 13:08:28.400000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_9.jpg',1),(10,'2024-09-13 13:08:28.402000','2024-09-13 13:08:28.402000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/red/red_10.jpg',1),(11,'2024-09-13 13:08:28.416000','2024-09-13 13:08:28.416000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_1.jpg',2),(12,'2024-09-13 13:08:28.417000','2024-09-13 13:08:28.417000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_2.jpg',2),(13,'2024-09-13 13:08:28.418000','2024-09-13 13:08:28.418000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_3.jpg',2),(14,'2024-09-13 13:08:28.421000','2024-09-13 13:08:28.421000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_4.jpg',2),(15,'2024-09-13 13:08:28.422000','2024-09-13 13:08:28.422000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_5.jpg',2),(16,'2024-09-13 13:08:28.424000','2024-09-13 13:08:28.424000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_6.jpg',2),(17,'2024-09-13 13:08:28.425000','2024-09-13 13:08:28.425000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_7.jpg',2),(18,'2024-09-13 13:08:28.427000','2024-09-13 13:08:28.427000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_8.jpg',2),(19,'2024-09-13 13:08:28.429000','2024-09-13 13:08:28.429000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_9.jpg',2),(20,'2024-09-13 13:08:28.431000','2024-09-13 13:08:28.431000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/blue/blue_10.jpg',2),(21,'2024-09-13 13:08:28.445000','2024-09-13 13:08:28.445000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_1.jpg',3),(22,'2024-09-13 13:08:28.447000','2024-09-13 13:08:28.447000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_2.jpg',3),(23,'2024-09-13 13:08:28.449000','2024-09-13 13:08:28.449000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_3.jpg',3),(24,'2024-09-13 13:08:28.450000','2024-09-13 13:08:28.450000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_4.jpg',3),(25,'2024-09-13 13:08:28.452000','2024-09-13 13:08:28.452000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_5.jpg',3),(26,'2024-09-13 13:08:28.453000','2024-09-13 13:08:28.453000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_6.jpg',3),(27,'2024-09-13 13:08:28.454000','2024-09-13 13:08:28.454000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_7.jpg',3),(28,'2024-09-13 13:08:28.455000','2024-09-13 13:08:28.455000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_8.jpg',3),(29,'2024-09-13 13:08:28.456000','2024-09-13 13:08:28.456000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_9.jpg',3),(30,'2024-09-13 13:08:28.458000','2024-09-13 13:08:28.458000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/green/green_10.jpg',3),(31,'2024-09-13 13:08:28.469000','2024-09-13 13:08:28.469000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_1.jpg',4),(32,'2024-09-13 13:08:28.470000','2024-09-13 13:08:28.470000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_2.jpg',4),(33,'2024-09-13 13:08:28.471000','2024-09-13 13:08:28.471000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_3.jpg',4),(34,'2024-09-13 13:08:28.473000','2024-09-13 13:08:28.473000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_4.jpg',4),(35,'2024-09-13 13:08:28.474000','2024-09-13 13:08:28.474000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_5.jpg',4),(36,'2024-09-13 13:08:28.475000','2024-09-13 13:08:28.475000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_6.jpg',4),(37,'2024-09-13 13:08:28.476000','2024-09-13 13:08:28.476000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_7.jpg',4),(38,'2024-09-13 13:08:28.477000','2024-09-13 13:08:28.477000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_8.jpg',4),(39,'2024-09-13 13:08:28.478000','2024-09-13 13:08:28.478000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_9.jpg',4),(40,'2024-09-13 13:08:28.480000','2024-09-13 13:08:28.480000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/yellow/yellow_10.jpg',4),(41,'2024-09-13 13:08:28.492000','2024-09-13 13:08:28.492000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_1.jpg',5),(42,'2024-09-13 13:08:28.493000','2024-09-13 13:08:28.493000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_2.jpg',5),(43,'2024-09-13 13:08:28.494000','2024-09-13 13:08:28.494000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_3.jpg',5),(44,'2024-09-13 13:08:28.496000','2024-09-13 13:08:28.496000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_4.jpg',5),(45,'2024-09-13 13:08:28.498000','2024-09-13 13:08:28.498000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_5.jpg',5),(46,'2024-09-13 13:08:28.499000','2024-09-13 13:08:28.499000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_6.jpg',5),(47,'2024-09-13 13:08:28.500000','2024-09-13 13:08:28.500000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_7.jpg',5),(48,'2024-09-13 13:08:28.501000','2024-09-13 13:08:28.501000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_8.jpg',5),(49,'2024-09-13 13:08:28.502000','2024-09-13 13:08:28.502000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_9.jpg',5),(50,'2024-09-13 13:08:28.503000','2024-09-13 13:08:28.503000','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/hair_color/purple/purple_10.jpg',5);
/*!40000 ALTER TABLE `color_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hair_color`
--

DROP TABLE IF EXISTS `hair_color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hair_color` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `active` bit(1) NOT NULL DEFAULT b'1',
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'red',
  `price` int NOT NULL,
  `color_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hair_color`
--

LOCK TABLES `hair_color` WRITE;
/*!40000 ALTER TABLE `hair_color` DISABLE KEYS */;
INSERT INTO `hair_color` VALUES (1,'2024-09-13 13:08:28.335000','2024-09-13 13:08:28.335000',_binary '','RED',20000,'#dc3545'),(2,'2024-09-13 13:08:28.409000','2024-09-13 13:08:28.409000',_binary '','BLUE',20000,'#007bff'),(3,'2024-09-13 13:08:28.439000','2024-09-13 13:08:28.439000',_binary '','GREEN',20000,'#28a745'),(4,'2024-09-13 13:08:28.464000','2024-09-13 13:08:28.464000',_binary '','YELLOW',20000,'#ffc107'),(5,'2024-09-13 13:08:28.486000','2024-09-13 13:08:28.486000',_binary '','PURPLE',20000,'#6f42c1'),(7,'2024-12-06 03:00:54.327000','2024-12-08 12:07:54.132000',_binary '\0','PINK',10000,'#be40c7');
/*!40000 ALTER TABLE `hair_color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'barbershop_hair_color_service'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-08  4:15:19

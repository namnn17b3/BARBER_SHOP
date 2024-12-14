-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: barbershop_barber_service
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.22.04.1

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
-- Table structure for table `barber`
--

DROP TABLE IF EXISTS `barber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barber` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `age` int NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL DEFAULT 'MALE',
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barber`
--

LOCK TABLES `barber` WRITE;
/*!40000 ALTER TABLE `barber` DISABLE KEYS */;
INSERT INTO `barber` VALUES (1,'2024-09-06 06:10:19','2024-11-30 19:47:11','Đỗ Văn Lộc',20,'geek, parent, leader 🤙🏿','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_1.jpg','MALE',1),(2,'2024-09-06 06:10:19','2024-09-06 06:52:39','Đỗ Trung Hiệp',31,'sport devotee  🪅','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_2.jpg','MALE',1),(3,'2024-09-06 06:10:19','2024-09-06 06:52:39','Đặng Trung Hùng',34,'friend','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_3.jpg','MALE',1),(4,'2024-09-06 06:10:19','2024-09-06 06:52:39','Trần Mạnh Nghĩa',28,'grad, parent','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_4.jpg','MALE',1),(5,'2024-09-06 06:10:19','2024-09-06 06:52:39','Lê Trung Thành',33,'bracelet lover, educator','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_5.jpg','MALE',1),(6,'2024-09-06 06:10:19','2024-09-06 06:52:39','Trần Tiến Lộc',28,'model, scientist, inventor 🍛','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_6.jpg','MALE',1),(7,'2024-09-06 06:10:19','2024-09-06 06:52:39','Đặng Trung Thành',19,'precedent lover, philosopher 🔪','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_7.jpg','MALE',1),(8,'2024-09-06 06:10:19','2024-09-06 06:52:39','Lê Trung Hiệp',37,'foodie, student, public speaker 🛠️','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_8.jpg','MALE',1),(9,'2024-09-06 06:10:19','2024-09-06 06:52:39','Đặng Tiến Hùng',19,'dish advocate, student','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_9.jpg','MALE',1),(10,'2024-09-06 06:10:19','2024-09-06 06:52:39','Trần Văn Hùng',25,'student, film lover','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_10.jpg','MALE',1),(11,'2024-09-06 06:10:19','2024-09-06 06:52:39','Trần Văn Hiệp',22,'photographer, model, business owner','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_11.jpg','MALE',1),(12,'2024-09-06 06:10:19','2024-09-06 06:52:39','Đặng Văn Nghĩa',18,'planula enthusiast  🎿','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_12.jpg','MALE',1),(13,'2024-09-06 06:10:19','2024-09-06 06:52:39','Đỗ Ngọc Thành',30,'bar advocate','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_13.jpg','MALE',1),(14,'2024-09-06 06:10:19','2024-09-06 06:52:39','Lê Ngọc Hiệp',28,'leader, person','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_14.jpg','MALE',1),(15,'2024-09-06 06:10:19','2024-09-06 06:52:39','Lê Trung Hùng',19,'philosopher, streamer','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_male_15.jpg','MALE',1),(16,'2024-09-06 06:10:19','2024-12-05 16:15:31','Trần Thị Thảo',32,'character advocate, photographer 🥓','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_female.jpg','MALE',1),(17,'2024-09-06 06:10:19','2024-09-06 06:37:12','Lê Thanh Thảo',26,'geek, person, photographer 🌠','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_female.jpg','MALE',1),(18,'2024-09-06 06:10:19','2024-09-06 06:37:12','Đỗ Thùy Trang',35,'breastplate lover  🙇🏿‍♀️','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_female.jpg','MALE',1),(19,'2024-09-06 06:10:19','2024-09-06 06:37:12','Đỗ Như My',25,'nerd, entrepreneur','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_female.jpg','MALE',1),(20,'2024-09-06 06:10:19','2024-09-06 06:37:12','Trần Phương My',23,'business owner, philosopher, film lover','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/barber_female.jpg','MALE',1),(21,'2024-11-30 10:02:19','2024-12-05 16:10:37','alo',22,'abfhslrjhklcjwsoldj','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/b5ba7a53-32dc-486e-bb9c-f4cdbd3d91d4.jpeg','MALE',0),(25,'2024-11-30 15:01:51','2024-12-01 12:10:36','nấm alo update',24,'abjdelkfklfsjewoeoksfdjdfsh','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/1f3722ac-ff0b-4adb-b6dd-929cbc5ddac6.jpeg','MALE',0),(26,'2024-12-01 03:59:58','2024-12-01 04:59:02','nam create new barber',18,'dfghmhngbfgdfjsfjfhhbhghfddfbdfb','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/25f5b849-7048-4a24-a95b-1ea8938584ce.jpg','MALE',0),(27,'2024-12-05 15:32:23','2024-12-05 17:27:41','Đan Nguyên',24,'Tôi nghe bài hát này đã mấy mươi năm, rất nhiều ca sĩ hát , nhưng chỉ có Quang Lê hát luyến láy , nhẹ nhàng , ngọt ngào hay sao mà hay','https://nambarbershop.s3.ap-southeast-1.amazonaws.com/barber/66412ee2-49c0-46e8-9ba7-193024c73d23.jpeg','MALE',0);
/*!40000 ALTER TABLE `barber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vietnamese_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vietnamese_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1725567550394,'InitModel1725567550394'),(7,1725592932498,'AddColumnGenderInTableBarber1725592932498'),(9,1726260098609,'AddColumnActiveInTableBarber1726260098609');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'barbershop_barber_service'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-13  9:54:53

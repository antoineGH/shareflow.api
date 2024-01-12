-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: shareflow
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

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
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
INSERT INTO `actions` VALUES (1,'download'),(2,'comments'),(3,'tags'),(4,'rename'),(5,'delete'),(6,'restore'),(7,'remove');
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `files_id` (`file_id`),
  KEY `activities_ibfk_2` (`user_id`),
  CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  CONSTRAINT `activities_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=564 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (411,'folder2 has been created','2024-01-11 11:43:09','2024-01-11 11:43:09',124,1),(412,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg has been created','2024-01-11 11:43:26','2024-01-11 11:43:26',125,1),(413,'Redux has been created','2024-01-11 11:43:26','2024-01-11 11:43:26',126,1),(414,'halterego.bikini_1576520938_2200339567459239594_9754066004.jpg has been created','2024-01-11 11:43:26','2024-01-11 11:43:26',127,1),(415,'414006757_18429115654034794_6431359949602669456_n.jpg has been created','2024-01-11 11:46:51','2024-01-11 11:46:51',128,1),(416,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg has been created','2024-01-11 11:51:25','2024-01-11 11:51:25',129,1),(417,'414231553_703297688229771_7236840753468704189_n.jpg has been created','2024-01-11 11:51:33','2024-01-11 11:51:33',130,1),(418,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg has been deleted','2024-01-11 11:53:38','2024-01-11 11:53:38',129,1),(419,'halterego.bikini_1576520938_2200339567459239594_9754066004.jpg has been updated.','2024-01-11 11:55:30','2024-01-11 11:55:30',127,1),(420,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg has been updated.','2024-01-11 11:55:30','2024-01-11 11:55:30',125,1),(421,'414231553_703297688229771_7236840753468704189_n.jpg has been updated.','2024-01-11 11:57:02','2024-01-11 11:57:02',130,1),(422,'414006757_18429115654034794_6431359949602669456_n.jpg has been updated.','2024-01-11 11:57:02','2024-01-11 11:57:02',128,1),(424,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg has been updated.','2024-01-11 12:02:04','2024-01-11 12:02:04',125,1),(425,'halterego.bikini_1576520938_2200339567459239594_9754066004.jpg has been updated.','2024-01-11 12:02:04','2024-01-11 12:02:04',127,1),(426,'414006757_18429115654034794_6431359949602669456_n.jpg has been updated.','2024-01-11 12:02:04','2024-01-11 12:02:04',128,1),(427,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg has been updated.','2024-01-11 12:02:04','2024-01-11 12:02:04',129,1),(428,'414231553_703297688229771_7236840753468704189_n.jpg has been updated.','2024-01-11 12:02:04','2024-01-11 12:02:04',130,1),(456,'folder3 has been created','2024-01-11 13:31:07','2024-01-11 13:31:07',141,1),(457,'Redux has been created','2024-01-11 13:31:20','2024-01-11 13:31:20',142,1),(563,'file_45.img has been created','2024-01-12 05:52:19','2024-01-12 05:52:19',197,1);
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `file_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `files_id` (`file_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `size` int DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_folder` tinyint NOT NULL,
  `local_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=198 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (124,'folder2',0,'/folder2',0,0,'2024-01-11 11:43:09','2024-01-11 11:43:09',1,NULL,123),(125,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg',99440,'storage/1/2024-01-11-22-43-26_halterego.bikini_1580929674_2237322730781801108_9754066004.jpg',0,0,'2024-01-11 11:43:26','2024-01-11 12:02:04',0,'storage/1/2024-01-11-22-43-26_halterego.bikini_1580929674_2237322730781801108_9754066004.jpg',123),(126,'Redux',1480,'storage/1/2024-01-11-22-43-26_Redux',0,0,'2024-01-11 11:43:26','2024-01-11 11:43:26',0,'storage/1/2024-01-11-22-43-26_Redux',123),(127,'halterego.bikini_1576520938_2200339567459239594_9754066004.jpg',78166,'storage/1/2024-01-11-22-43-26_halterego.bikini_1576520938_2200339567459239594_9754066004.jpg',0,0,'2024-01-11 11:43:26','2024-01-11 12:02:04',0,'storage/1/2024-01-11-22-43-26_halterego.bikini_1576520938_2200339567459239594_9754066004.jpg',123),(128,'414006757_18429115654034794_6431359949602669456_n.jpg',196291,'storage/1/2024-01-11-22-46-51_414006757_18429115654034794_6431359949602669456_n.jpg',0,0,'2024-01-11 11:46:51','2024-01-11 12:02:04',0,'storage/1/2024-01-11-22-46-51_414006757_18429115654034794_6431359949602669456_n.jpg',123),(129,'halterego.bikini_1580929674_2237322730781801108_9754066004.jpg',99440,'storage/1/2024-01-11-22-51-25_halterego.bikini_1580929674_2237322730781801108_9754066004.jpg',0,0,'2024-01-11 11:51:25','2024-01-11 12:02:04',0,'storage/1/2024-01-11-22-51-25_halterego.bikini_1580929674_2237322730781801108_9754066004.jpg',123),(130,'414231553_703297688229771_7236840753468704189_n.jpg',334285,'storage/1/2024-01-11-22-51-33_414231553_703297688229771_7236840753468704189_n.jpg',0,0,'2024-01-11 11:51:33','2024-01-11 12:02:04',0,'storage/1/2024-01-11-22-51-33_414231553_703297688229771_7236840753468704189_n.jpg',123),(141,'folder3',0,'/folder3',0,0,'2024-01-11 13:31:07','2024-01-11 13:31:07',1,NULL,122),(142,'Redux',1480,'storage/1/2024-01-12-00-31-20_Redux',0,0,'2024-01-11 13:31:20','2024-01-11 13:31:20',0,'storage/1/2024-01-12-00-31-20_Redux',141),(197,'file_45.img',47185920,'storage/1/2024-01-12-16-52-19_file_45.img',0,0,'2024-01-12 05:52:19','2024-01-12 05:52:19',0,'storage/1/2024-01-12-16-52-19_file_45.img',NULL);
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files_actions`
--

DROP TABLE IF EXISTS `files_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files_actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_id` int NOT NULL,
  `action_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `file_id` (`file_id`),
  KEY `action_id` (`action_id`),
  CONSTRAINT `files_actions_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  CONSTRAINT `files_actions_ibfk_2` FOREIGN KEY (`action_id`) REFERENCES `actions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1596 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_actions`
--

LOCK TABLES `files_actions` WRITE;
/*!40000 ALTER TABLE `files_actions` DISABLE KEYS */;
INSERT INTO `files_actions` VALUES (1040,124,2),(1041,124,3),(1042,124,4),(1043,124,5),(1046,126,2),(1048,126,3),(1050,126,4),(1052,126,5),(1053,126,1),(1089,125,2),(1090,125,3),(1091,125,4),(1092,125,5),(1093,125,1),(1094,127,2),(1095,127,3),(1096,127,4),(1097,127,5),(1098,127,1),(1099,128,2),(1100,128,3),(1101,128,4),(1102,128,5),(1103,128,1),(1104,129,2),(1105,129,3),(1106,129,4),(1107,129,5),(1108,129,1),(1109,130,2),(1110,130,3),(1111,130,4),(1112,130,5),(1113,130,1),(1210,141,2),(1211,141,3),(1212,141,4),(1213,141,5),(1214,142,2),(1215,142,3),(1216,142,4),(1217,142,5),(1218,142,1),(1591,197,2),(1592,197,3),(1593,197,4),(1594,197,5),(1595,197,1);
/*!40000 ALTER TABLE `files_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files_data`
--

DROP TABLE IF EXISTS `files_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `files_id` (`file_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `files_data_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`),
  CONSTRAINT `files_data_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_data`
--

LOCK TABLES `files_data` WRITE;
/*!40000 ALTER TABLE `files_data` DISABLE KEYS */;
INSERT INTO `files_data` VALUES (127,124,1),(128,125,1),(129,126,1),(130,127,1),(131,128,1),(132,129,1),(133,130,1),(144,141,1),(145,142,1),(200,197,1);
/*!40000 ALTER TABLE `files_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files_tags`
--

DROP TABLE IF EXISTS `files_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `files_id` int NOT NULL,
  `tags_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `files_id` (`files_id`),
  KEY `tags_id` (`tags_id`),
  CONSTRAINT `files_tags_ibfk_1` FOREIGN KEY (`files_id`) REFERENCES `files` (`id`),
  CONSTRAINT `files_tags_ibfk_2` FOREIGN KEY (`tags_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_tags`
--

LOCK TABLES `files_tags` WRITE;
/*!40000 ALTER TABLE `files_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `files_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `storage_used` int NOT NULL,
  `total_storage` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,47185920,52428800,1,'2023-12-31 04:57:08','2024-01-12 05:52:19');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Demo','demo@demo.au','https://gravatar.com/avatar/51b00b91786cb4c5a5484e65f084599b?s=600&d=robohash&r=pg','2023-12-31 04:48:13','2024-01-05 04:00:48','$2b$10$KJX7lBfYRMnLyol5D8D25u0PRitX6zgQpGKsnc3ZMTzjMWHDPa0I6');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-12 17:36:08

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
) ENGINE=InnoDB AUTO_INCREMENT=354 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (20,'Download has been created.','2024-01-01 13:21:31','2024-01-01 13:21:31',18,1),(21,'Download has been created.','2024-01-01 13:21:31','2024-01-01 13:21:31',18,1),(22,'Download has been updated.','2024-01-07 05:05:46','2024-01-07 05:05:46',18,1),(23,'Download has been updated.','2024-01-07 05:07:04','2024-01-07 05:07:04',18,1),(24,'Download has been updated.','2024-01-07 05:22:01','2024-01-07 05:22:01',18,1),(25,'Download has been updated.','2024-01-07 05:22:15','2024-01-07 05:22:15',18,1),(26,'Download has been updated.','2024-01-07 05:23:16','2024-01-07 05:23:16',18,1),(27,'Download has been updated.','2024-01-07 05:23:47','2024-01-07 05:23:47',18,1),(28,'Download has been updated.','2024-01-07 05:24:10','2024-01-07 05:24:10',18,1),(29,'Download has been updated.','2024-01-07 05:24:34','2024-01-07 05:24:34',18,1),(30,'Download has been updated.','2024-01-07 05:25:39','2024-01-07 05:25:39',18,1),(31,'Download has been updated.','2024-01-07 05:25:42','2024-01-07 05:25:42',18,1),(32,'Download has been updated.','2024-01-07 05:27:16','2024-01-07 05:27:16',18,1),(33,'Download has been updated.','2024-01-07 05:33:47','2024-01-07 05:33:47',18,1),(34,'Download has been updated.','2024-01-07 05:33:48','2024-01-07 05:33:48',18,1),(35,'Download has been updated.','2024-01-07 05:33:50','2024-01-07 05:33:50',18,1),(36,'Download has been updated.','2024-01-07 05:33:51','2024-01-07 05:33:51',18,1),(37,'Download has been updated.','2024-01-07 05:33:52','2024-01-07 05:33:52',18,1),(38,'Download has been updated.','2024-01-07 05:33:54','2024-01-07 05:33:54',18,1),(39,'Download has been updated.','2024-01-07 05:33:57','2024-01-07 05:33:57',18,1),(40,'Download has been updated.','2024-01-07 05:33:59','2024-01-07 05:33:59',18,1),(41,'Download has been updated.','2024-01-07 05:33:59','2024-01-07 05:33:59',18,1),(42,'Download has been updated.','2024-01-07 05:34:00','2024-01-07 05:34:00',18,1),(43,'Download has been updated.','2024-01-07 05:34:02','2024-01-07 05:34:02',18,1),(44,'Download has been updated.','2024-01-07 05:34:02','2024-01-07 05:34:02',18,1),(45,'Download has been updated.','2024-01-07 05:37:02','2024-01-07 05:37:02',18,1),(46,'Download has been updated.','2024-01-07 05:37:03','2024-01-07 05:37:03',18,1),(47,'Download has been updated.','2024-01-07 05:37:05','2024-01-07 05:37:05',18,1),(48,'Download has been updated.','2024-01-07 05:37:06','2024-01-07 05:37:06',18,1),(49,'Download has been updated.','2024-01-07 05:37:08','2024-01-07 05:37:08',18,1),(50,'Download has been updated.','2024-01-07 05:37:09','2024-01-07 05:37:09',18,1),(51,'Download has been updated.','2024-01-07 05:37:11','2024-01-07 05:37:11',18,1),(52,'Download has been updated.','2024-01-07 05:37:12','2024-01-07 05:37:12',18,1),(53,'Download has been updated.','2024-01-07 05:38:14','2024-01-07 05:38:14',18,1),(54,'Download has been updated.','2024-01-07 05:39:43','2024-01-07 05:39:43',18,1),(55,'Download has been updated.','2024-01-07 05:39:44','2024-01-07 05:39:44',18,1),(56,'Download has been updated.','2024-01-07 05:44:24','2024-01-07 05:44:24',18,1),(57,'Download has been updated.','2024-01-07 06:05:15','2024-01-07 06:05:15',18,1),(58,'Download has been updated.','2024-01-07 06:06:41','2024-01-07 06:06:41',18,1),(59,'Download has been updated.','2024-01-07 06:07:46','2024-01-07 06:07:46',18,1),(60,'Download has been updated.','2024-01-07 06:08:50','2024-01-07 06:08:50',18,1),(61,'Download has been updated.','2024-01-07 06:09:01','2024-01-07 06:09:01',18,1),(62,'Download has been updated.','2024-01-07 06:13:03','2024-01-07 06:13:03',18,1),(63,'Download has been updated.','2024-01-07 06:13:19','2024-01-07 06:13:19',18,1),(64,'Download has been updated.','2024-01-07 06:15:33','2024-01-07 06:15:33',18,1),(65,'Download has been updated.','2024-01-07 06:16:00','2024-01-07 06:16:00',18,1),(66,'Download has been updated.','2024-01-07 06:16:06','2024-01-07 06:16:06',18,1),(67,'Download has been updated.','2024-01-07 06:16:51','2024-01-07 06:16:51',18,1),(68,'Download has been updated.','2024-01-07 06:18:09','2024-01-07 06:18:09',18,1),(69,'Download has been updated.','2024-01-07 06:18:17','2024-01-07 06:18:17',18,1),(70,'Download has been updated.','2024-01-07 06:19:30','2024-01-07 06:19:30',18,1),(71,'Download has been updated.','2024-01-07 06:19:51','2024-01-07 06:19:51',18,1),(72,'Download has been updated.','2024-01-07 06:19:57','2024-01-07 06:19:57',18,1),(73,'Download has been updated.','2024-01-07 09:34:12','2024-01-07 09:34:12',18,1),(74,'Download has been updated.','2024-01-07 09:34:15','2024-01-07 09:34:15',18,1),(75,'Download has been updated.','2024-01-07 09:34:19','2024-01-07 09:34:19',18,1),(76,'Download has been updated.','2024-01-07 09:34:19','2024-01-07 09:34:19',18,1),(77,'Download has been updated.','2024-01-07 09:34:20','2024-01-07 09:34:20',18,1),(78,'Download has been updated.','2024-01-07 09:34:39','2024-01-07 09:34:39',18,1),(79,'Download has been updated.','2024-01-07 09:34:45','2024-01-07 09:34:45',18,1),(80,'Download has been updated.','2024-01-07 09:37:08','2024-01-07 09:37:08',18,1),(81,'Download has been updated.','2024-01-07 09:37:45','2024-01-07 09:37:45',18,1),(82,'Download has been updated.','2024-01-07 09:37:48','2024-01-07 09:37:48',18,1),(83,'Download has been updated.','2024-01-07 09:38:16','2024-01-07 09:38:16',18,1),(84,'Download has been updated.','2024-01-07 09:38:19','2024-01-07 09:38:19',18,1),(85,'Download has been updated.','2024-01-07 09:43:30','2024-01-07 09:43:30',18,1),(86,'Download has been updated.','2024-01-07 09:44:54','2024-01-07 09:44:54',18,1),(87,'Download has been updated.','2024-01-07 09:44:58','2024-01-07 09:44:58',18,1),(88,'Download has been updated.','2024-01-07 09:44:59','2024-01-07 09:44:59',18,1),(89,'Download has been updated.','2024-01-07 09:44:59','2024-01-07 09:44:59',18,1),(90,'Download has been updated.','2024-01-07 09:45:16','2024-01-07 09:45:16',18,1),(91,'Download has been updated.','2024-01-07 09:45:24','2024-01-07 09:45:24',18,1),(92,'Download has been updated.','2024-01-07 09:45:29','2024-01-07 09:45:29',18,1),(93,'Download has been updated.','2024-01-07 09:45:38','2024-01-07 09:45:38',18,1),(94,'Download has been updated.','2024-01-07 09:45:50','2024-01-07 09:45:50',18,1),(95,'Download has been updated.','2024-01-07 09:45:52','2024-01-07 09:45:52',18,1),(96,'Download has been updated.','2024-01-07 09:47:59','2024-01-07 09:47:59',18,1),(97,'Download has been updated.','2024-01-07 11:52:10','2024-01-07 11:52:10',18,1),(98,'Download has been updated.','2024-01-07 11:52:13','2024-01-07 11:52:13',18,1),(99,'Download has been updated.','2024-01-07 11:52:16','2024-01-07 11:52:16',18,1),(100,'Download has been updated.','2024-01-07 14:01:14','2024-01-07 14:01:14',18,1),(101,'Download has been updated.','2024-01-07 14:01:17','2024-01-07 14:01:17',18,1),(102,'Download has been updated.','2024-01-07 14:11:31','2024-01-07 14:11:31',18,1),(103,'Download has been updated.','2024-01-07 14:11:35','2024-01-07 14:11:35',18,1),(104,'Download has been updated.','2024-01-07 14:12:45','2024-01-07 14:12:45',18,1),(105,'Download has been updated.','2024-01-07 14:12:47','2024-01-07 14:12:47',18,1),(106,'Download has been updated.','2024-01-07 14:12:50','2024-01-07 14:12:50',18,1),(107,'Download has been updated.','2024-01-07 14:28:01','2024-01-07 14:28:01',18,1),(108,'Download has been updated.','2024-01-07 14:28:04','2024-01-07 14:28:04',18,1),(109,'Download has been updated.','2024-01-07 14:28:14','2024-01-07 14:28:14',18,1),(110,'Download has been updated.','2024-01-07 14:28:19','2024-01-07 14:28:19',18,1),(111,'Download has been updated.','2024-01-07 14:29:03','2024-01-07 14:29:03',18,1),(115,'Download has been updated.','2024-01-08 02:39:28','2024-01-08 02:39:28',18,1),(116,'Download has been updated.','2024-01-08 03:06:25','2024-01-08 03:06:25',18,1),(117,'Download has been updated.','2024-01-08 03:39:37','2024-01-08 03:39:37',18,1),(118,'Download 2 has been updated.','2024-01-08 03:44:57','2024-01-08 03:44:57',20,1),(119,'Download has been updated.','2024-01-08 05:36:02','2024-01-08 05:36:02',18,1),(120,'Download 2 has been updated.','2024-01-08 05:36:02','2024-01-08 05:36:02',20,1),(121,'Download 2 has been updated.','2024-01-08 05:39:03','2024-01-08 05:39:03',20,1),(122,'Download 2 has been updated.','2024-01-08 05:39:10','2024-01-08 05:39:10',20,1),(123,'Download has been updated.','2024-01-08 05:40:55','2024-01-08 05:40:55',18,1),(124,'Download 2 has been updated.','2024-01-08 05:40:55','2024-01-08 05:40:55',20,1),(125,'Download has been updated.','2024-01-08 05:41:50','2024-01-08 05:41:50',18,1),(126,'Download 2 has been updated.','2024-01-08 05:41:50','2024-01-08 05:41:50',20,1),(127,'Download 2 has been updated.','2024-01-08 05:41:53','2024-01-08 05:41:53',20,1),(128,'Download has been updated.','2024-01-08 05:41:56','2024-01-08 05:41:56',18,1),(129,'Download has been updated.','2024-01-08 05:42:00','2024-01-08 05:42:00',18,1),(130,'Download 2 has been updated.','2024-01-08 05:42:00','2024-01-08 05:42:00',20,1),(131,'Download has been updated.','2024-01-08 05:42:04','2024-01-08 05:42:04',18,1),(132,'Download 2 has been updated.','2024-01-08 05:42:04','2024-01-08 05:42:04',20,1),(133,'Download has been updated.','2024-01-08 06:26:09','2024-01-08 06:26:09',18,1),(134,'Download 2 has been updated.','2024-01-08 06:50:53','2024-01-08 06:50:53',20,1),(135,'myNewName has been updated.','2024-01-08 06:51:52','2024-01-08 06:51:52',20,1),(136,'Download has been updated.','2024-01-08 06:52:45','2024-01-08 06:52:45',18,1),(137,'Download has been updated.','2024-01-08 07:47:32','2024-01-08 07:47:32',18,1),(138,'Download has been updated.','2024-01-08 07:47:41','2024-01-08 07:47:41',18,1),(139,'Download2 has been updated.','2024-01-08 07:47:50','2024-01-08 07:47:50',20,1),(140,'Download2 has been updated.','2024-01-08 07:47:52','2024-01-08 07:47:52',20,1),(141,'Download2 has been updated.','2024-01-08 08:07:32','2024-01-08 08:07:32',20,1),(142,'File2 has been updated.','2024-01-08 08:07:39','2024-01-08 08:07:39',20,1),(143,'File3 has been updated.','2024-01-08 08:09:23','2024-01-08 08:09:23',20,1),(144,'File3 has been updated.','2024-01-08 08:09:27','2024-01-08 08:09:27',20,1),(145,'File3 has been updated.','2024-01-08 08:09:33','2024-01-08 08:09:33',20,1),(146,'File4 has been updated.','2024-01-08 08:09:53','2024-01-08 08:09:53',20,1),(147,'File4 has been updated.','2024-01-08 08:10:00','2024-01-08 08:10:00',20,1),(148,'File5 has been updated.','2024-01-08 08:10:06','2024-01-08 08:10:06',20,1),(149,'File5 has been updated.','2024-01-08 08:10:09','2024-01-08 08:10:09',20,1),(150,'File5 has been updated.','2024-01-08 08:10:12','2024-01-08 08:10:12',20,1),(151,'File5 has been updated.','2024-01-08 08:12:17','2024-01-08 08:12:17',20,1),(152,'1w has been updated.','2024-01-08 12:10:56','2024-01-08 12:10:56',20,1),(153,'Download2 has been add to favorite.','2024-01-08 12:17:08','2024-01-08 12:17:08',20,1),(154,'Download2 has been remove from favorite.','2024-01-08 12:17:09','2024-01-08 12:17:09',20,1),(155,'Download2 has been favorite.','2024-01-08 12:17:50','2024-01-08 12:17:50',20,1),(156,'Download2 has been unfavorite.','2024-01-08 12:17:51','2024-01-08 12:17:51',20,1),(157,'Download2 has been deleted.','2024-01-08 12:18:05','2024-01-08 12:18:05',20,1),(158,'Download2 has been restored.','2024-01-08 12:18:14','2024-01-08 12:18:14',20,1),(159,'Download2 has been favorite.','2024-01-08 13:07:13','2024-01-08 13:07:13',20,1),(160,'Download2 has been renamed.','2024-01-08 13:15:59','2024-01-08 13:15:59',20,1),(161,'Download22 has been unfavorite','2024-01-08 13:18:35','2024-01-08 13:18:35',20,1),(162,'Download22 has been favorite','2024-01-08 13:18:42','2024-01-08 13:18:42',20,1),(163,'Download22 has been renamed','2024-01-08 13:21:01','2024-01-08 13:21:01',20,1),(164,'Download has been favorite','2024-01-08 13:22:14','2024-01-08 13:22:14',18,1),(165,'Download has been unfavorite','2024-01-08 13:22:15','2024-01-08 13:22:15',18,1),(166,'Download has been favorite','2024-01-08 13:32:08','2024-01-08 13:32:08',18,1),(167,'Download has been unfavorite','2024-01-08 13:32:09','2024-01-08 13:32:09',18,1),(348,'layered-waves-bg.svg has been created','2024-01-09 12:59:38','2024-01-09 12:59:38',100,1),(349,'db.json has been created','2024-01-09 13:20:46','2024-01-09 13:20:46',101,1),(350,'db.json has been updated.','2024-01-09 13:24:18','2024-01-09 13:24:18',101,1),(351,'layered-waves-bg.svg has been updated.','2024-01-09 13:24:18','2024-01-09 13:24:18',100,1),(352,'shareflow.api.code-workspace has been created','2024-01-09 13:24:28','2024-01-09 13:24:28',102,1),(353,'shareflow_data.sql has been created','2024-01-09 13:24:28','2024-01-09 13:24:28',103,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (19,'newComment1','2024-01-01 13:46:07','2024-01-01 13:46:07',18,1),(20,'newComment1','2024-01-01 13:54:57','2024-01-01 13:54:57',18,1),(38,'That is interesting','2024-01-05 04:02:48','2024-01-05 04:02:48',18,2);
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
  `size` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_folder` tinyint NOT NULL,
  `local_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (4,'Images','9048 KB','/Images',0,0,'2024-01-01 13:21:31','2024-01-01 13:21:31',1,''),(18,'Download','2048 KB','/Download',0,0,'2024-01-01 13:21:31','2024-01-08 13:32:09',1,''),(20,'Download2','2048 KB','2',1,0,'2024-01-01 13:21:31','2024-01-08 13:21:01',1,''),(100,'layered-waves-bg.svg','3 KB','storage/1/2024-01-09-23-59-38_layered-waves-bg.svg',0,1,'2024-01-09 12:59:38','2024-01-09 13:24:18',0,'storage/1/2024-01-09-23-59-38_layered-waves-bg.svg'),(101,'db.json','2 KB','storage/1/2024-01-10-00-20-46_db.json',0,1,'2024-01-09 13:20:46','2024-01-09 13:24:18',0,'storage/1/2024-01-10-00-20-46_db.json'),(102,'shareflow.api.code-workspace','870 B','storage/1/2024-01-10-00-24-28_shareflow.api.code-workspace',0,0,'2024-01-09 13:24:28','2024-01-09 13:24:28',0,'storage/1/2024-01-10-00-24-28_shareflow.api.code-workspace'),(103,'shareflow_data.sql','15 KB','storage/1/2024-01-10-00-24-28_shareflow_data.sql',0,0,'2024-01-09 13:24:28','2024-01-09 13:24:28',0,'storage/1/2024-01-10-00-24-28_shareflow_data.sql');
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
) ENGINE=InnoDB AUTO_INCREMENT=908 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_actions`
--

LOCK TABLES `files_actions` WRITE;
/*!40000 ALTER TABLE `files_actions` DISABLE KEYS */;
INSERT INTO `files_actions` VALUES (245,18,2),(246,18,3),(247,18,4),(248,18,5),(249,18,1),(266,20,2),(267,20,3),(268,20,4),(269,20,5),(270,20,1),(894,101,6),(895,101,7),(896,100,6),(897,100,7),(898,102,2),(899,103,2),(900,102,3),(901,103,3),(902,102,4),(903,103,4),(904,102,5),(905,103,5),(906,102,1),(907,103,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_data`
--

LOCK TABLES `files_data` WRITE;
/*!40000 ALTER TABLE `files_data` DISABLE KEYS */;
INSERT INTO `files_data` VALUES (21,18,1),(23,20,1),(103,100,1),(104,101,1),(105,102,1),(106,103,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files_tags`
--

LOCK TABLES `files_tags` WRITE;
/*!40000 ALTER TABLE `files_tags` DISABLE KEYS */;
INSERT INTO `files_tags` VALUES (21,18,15),(22,18,16),(42,20,15),(43,20,16),(44,20,31);
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
INSERT INTO `settings` VALUES (1,5,15,1,'2023-12-31 04:57:08','2023-12-31 04:57:08');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (15,'tag1',1,'2024-01-02 12:50:04'),(16,'tag2',1,'2024-01-02 12:55:07'),(31,'tag3',1,'2024-01-08 13:14:12');
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
INSERT INTO `users` VALUES (1,'Demo','demo@demo.au','https://gravatar.com/avatar/51b00b91786cb4c5a5484e65f084599b?s=600&d=robohash&r=pg','2023-12-31 04:48:13','2024-01-05 04:00:48','$2b$10$KJX7lBfYRMnLyol5D8D25u0PRitX6zgQpGKsnc3ZMTzjMWHDPa0I6'),(2,'Antoine','antoine.ratat@gmail.com','https://gravatar.com/avatar/fea4329fe6ee5b4c37bd6b160927ca83?s=400&d=robohash&r=x','2024-01-05 04:02:20','2024-01-05 04:06:33','$2b$10$KJX7lBfYRMnLyol5D8D25u0PRitX6zgQpGKsnc3ZMTzjMWHDPa0I6');
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

-- Dump completed on 2024-01-10  1:20:49

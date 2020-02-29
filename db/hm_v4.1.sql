-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 29, 2020 at 11:05 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mphirschmann`
--

-- --------------------------------------------------------

--
-- Table structure for table `area`
--

CREATE TABLE `area` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `area`
--

INSERT INTO `area` (`id`, `title`, `position`) VALUES
(9, 'Area A', 1),
(10, 'Area BB', 2),
(12, 'Area D', 4);

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `id` int(11) NOT NULL,
  `destinationurl` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `name`) VALUES
(8, 'English'),
(9, 'German');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `caption` varchar(45) NOT NULL,
  `language_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `text_id` int(11) DEFAULT NULL,
  `station_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `caption`, `language_id`, `file_id`, `text_id`, `station_id`) VALUES
(81, '', 8, NULL, 88, 64),
(82, '', 8, NULL, 90, 64),
(83, '', 8, NULL, 87, 64),
(84, '', 8, NULL, 89, 64),
(85, '', 8, NULL, 91, 65),
(86, '', 9, NULL, 93, 65),
(87, '', 9, NULL, 92, 65),
(88, '', 9, NULL, 94, 65),
(89, '', 8, NULL, 95, 66),
(90, '', 8, NULL, 96, 66),
(91, '', 8, NULL, 97, 66),
(92, '', 8, NULL, 99, 67),
(93, '', 8, NULL, 98, 67),
(94, '', 8, NULL, 100, 67),
(95, '', 9, NULL, 102, 68),
(96, '', 9, NULL, 101, 68),
(97, '', 9, NULL, 104, 68),
(98, '', 9, NULL, 103, 68);

-- --------------------------------------------------------

--
-- Table structure for table `station`
--

CREATE TABLE `station` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `area_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `station`
--

INSERT INTO `station` (`id`, `name`, `area_id`) VALUES
(64, 'Standard Station', 9),
(65, 'Maschine A', 10),
(66, 'Maschine B', 9),
(67, 'Infostand', 12),
(68, 'Standard Station G', 9);

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE `template` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `template_has_station`
--

CREATE TABLE `template_has_station` (
  `station_id` int(11) NOT NULL,
  `template_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL,
  `ordernumber` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `text`
--

CREATE TABLE `text` (
  `id` int(11) NOT NULL,
  `text` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `text`
--

INSERT INTO `text` (`id`, `text`) VALUES
(87, 'Testest'),
(88, 'Testest'),
(89, 'Testest'),
(90, 'Testest'),
(91, 'Maschine'),
(92, 'Maschine'),
(93, 'Maschine'),
(94, 'Maschine'),
(95, 'Maschine B'),
(96, 'Maschine B'),
(97, 'Maschine B'),
(98, 'Infostand'),
(99, 'Infostand'),
(100, 'Infostand'),
(101, 'InfostandInfostandInfostandInfostandInfostand'),
(102, 'asdfasdfadsfas'),
(103, 'asdfasdfadsfas'),
(104, 'asdfasdfadsfas');

-- --------------------------------------------------------

--
-- Table structure for table `tour`
--

CREATE TABLE `tour` (
  `id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `reversible` tinyint(4) NOT NULL,
  `template_id` int(11) DEFAULT NULL,
  `guide` varchar(45) DEFAULT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tour`
--

INSERT INTO `tour` (`id`, `title`, `reversible`, `template_id`, `guide`, `date`) VALUES
(49, 'Schulklasse', 1, NULL, 'Max Mustermann', '2020-02-26 10:11:00'),
(50, 'Kunde', 0, NULL, 'asdfasdf', '2020-02-26 22:12:00');

-- --------------------------------------------------------

--
-- Table structure for table `tour_has_station`
--

CREATE TABLE `tour_has_station` (
  `tour_id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL,
  `ordernumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `area`
--
ALTER TABLE `area`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_media_language_idx` (`language_id`),
  ADD KEY `fk_media_file1_idx` (`file_id`),
  ADD KEY `fk_media_text1_idx` (`text_id`),
  ADD KEY `fk_media_station1_idx` (`station_id`);

--
-- Indexes for table `station`
--
ALTER TABLE `station`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_station_area1_idx` (`area_id`);

--
-- Indexes for table `template`
--
ALTER TABLE `template`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template_has_station`
--
ALTER TABLE `template_has_station`
  ADD PRIMARY KEY (`station_id`,`template_id`,`media_id`),
  ADD KEY `fk_station_has_template_template1_idx` (`template_id`),
  ADD KEY `fk_station_has_template_station1_idx` (`station_id`),
  ADD KEY `fk_station_has_template_media1_idx` (`media_id`);

--
-- Indexes for table `text`
--
ALTER TABLE `text`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tour`
--
ALTER TABLE `tour`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_route_targetgroup1_idx` (`template_id`);

--
-- Indexes for table `tour_has_station`
--
ALTER TABLE `tour_has_station`
  ADD PRIMARY KEY (`tour_id`,`station_id`,`media_id`),
  ADD KEY `fk_tour_has_station_station1_idx` (`station_id`),
  ADD KEY `fk_tour_has_station_tour1_idx` (`tour_id`),
  ADD KEY `fk_tour_has_station_media1_idx` (`media_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `area`
--
ALTER TABLE `area`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `language`
--
ALTER TABLE `language`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `station`
--
ALTER TABLE `station`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `template`
--
ALTER TABLE `template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `text`
--
ALTER TABLE `text`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `tour`
--
ALTER TABLE `tour`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `fk_media_file1` FOREIGN KEY (`file_id`) REFERENCES `file` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_media_language` FOREIGN KEY (`language_id`) REFERENCES `language` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_media_station1` FOREIGN KEY (`station_id`) REFERENCES `station` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_media_text1` FOREIGN KEY (`text_id`) REFERENCES `text` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `station`
--
ALTER TABLE `station`
  ADD CONSTRAINT `fk_station_area1` FOREIGN KEY (`area_id`) REFERENCES `area` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `template_has_station`
--
ALTER TABLE `template_has_station`
  ADD CONSTRAINT `fk_station_has_template_media1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_station_has_template_station1` FOREIGN KEY (`station_id`) REFERENCES `station` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_station_has_template_template1` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tour`
--
ALTER TABLE `tour`
  ADD CONSTRAINT `fk_route_template` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tour_has_station`
--
ALTER TABLE `tour_has_station`
  ADD CONSTRAINT `fk_tour_has_station_media1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_tour_has_station_station1` FOREIGN KEY (`station_id`) REFERENCES `station` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_tour_has_station_tour1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

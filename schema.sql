-- =========================================================================
-- CasparCG Client Next.js App - MySQL Database Schema & Initial Seed Data
-- Database Name: casparcg_db
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `casparcg_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `casparcg_db`;

-- -------------------------------------------------------------------------
-- Table Structure: lower_thirds
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `lower_thirds`;
CREATE TABLE `lower_thirds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '',
  `category` VARCHAR(50) DEFAULT 'General',
  `image_url` VARCHAR(500) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed lower_thirds
INSERT INTO `lower_thirds` (`name`, `title`, `subtitle`, `category`) VALUES
('Dr. Sarah Jenkins', 'Chief AI Research Scientist', 'Global Innovation Labs', 'Tech'),
('Michael Sterling', 'Senior Political Analyst', 'Capitol News Desk', 'Politics'),
('Elena Rostova', 'Managing Director & Economist', 'World Financial Forum', 'Business'),
('David Vance', 'Lead Broadcast Systems Engineer', 'CasparCG Development Team', 'Tech'),
('Samantha Reed', 'Climate & Environment Editor', 'Special Investigative Report', 'Environment');

-- -------------------------------------------------------------------------
-- Table Structure: news_tickers
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `news_tickers`;
CREATE TABLE `news_tickers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `headline` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'NEWS',
  `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') DEFAULT 'NORMAL',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed news_tickers
INSERT INTO `news_tickers` (`headline`, `category`, `priority`) VALUES
('GLOBAL MARKETS REACH RECORD HIGH AS TECH SECTOR SURGES ACROSS INTERNATIONAL EXCHANGES', 'BUSINESS', 'HIGH'),
('SPACE AGENCY CONFIRMS LUNAR BASE CONSTRUCTION TIMELINE FOR 2028', 'SCIENCE', 'NORMAL'),
('CYBERSECURITY SUMMIT ANNOUNCES NEW GLOBAL ENCRYPTION PROTOCOLS', 'TECH', 'HIGH'),
('RENEWABLE ENERGY GRIDS EXCEED 60% CAPACITY ACROSS EUROPE', 'WORLD', 'NORMAL');

-- -------------------------------------------------------------------------
-- Table Structure: breaking_news
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `breaking_news`;
CREATE TABLE `breaking_news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `badge` VARCHAR(50) DEFAULT 'BREAKING NEWS',
  `headline` TEXT NOT NULL,
  `location` VARCHAR(150) DEFAULT '',
  `reporter` VARCHAR(150) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed breaking_news
INSERT INTO `breaking_news` (`badge`, `headline`, `location`, `reporter`) VALUES
('BREAKING NEWS', 'INTERNATIONAL TREATY SIGNED ON ARTIFICIAL INTELLIGENCE SAFETY', 'GENEVA, SWITZERLAND', 'Marcus Brody'),
('SPECIAL REPORT', 'UNEXPECTED METEOR SHOWER VISIBLE ACROSS NORTH AMERICA TONIGHT', 'WASHINGTON D.C.', 'Clara Oswald'),
('DEVELOPING', 'CENTRAL BANK ANNOUNCES EMERGENCY INTEREST RATE DECISION', 'LONDON, UK', 'James Sterling');

-- -------------------------------------------------------------------------
-- Table Structure: scoreboards
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `scoreboards`;
CREATE TABLE `scoreboards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `match_name` VARCHAR(100) NOT NULL,
  `team_a` VARCHAR(50) NOT NULL,
  `score_a` VARCHAR(10) NOT NULL DEFAULT '0',
  `team_b` VARCHAR(50) NOT NULL,
  `score_b` VARCHAR(10) NOT NULL DEFAULT '0',
  `status` VARCHAR(50) DEFAULT 'LIVE',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed scoreboards
INSERT INTO `scoreboards` (`match_name`, `team_a`, `score_a`, `team_b`, `score_b`, `status`) VALUES
('CHAMPIONS LEAGUE FINAL', 'REAL MADRID', '2', 'MAN CITY', '1', '84\' 2ND HALF'),
('NBA FINALS - GAME 7', 'CELTICS', '104', 'LAKERS', '102', 'Q4 0:45'),
('WIMBLEDON MEN\'S FINAL', 'ALCARAZ', '3', 'DJOKOVIC', '2', 'FINAL SET');

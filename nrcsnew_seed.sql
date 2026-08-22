-- =========================================================================
-- phpMyAdmin Copy & Paste SQL Script for Database: nrcsnew
-- =========================================================================

USE `nrcsnew`;

-- -------------------------------------------------------------------------
-- Table 1: bulletin
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bulletin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `bulletinname` VARCHAR(255) NOT NULL,
  `bulletintime` TIME DEFAULT '09:00:00',
  `bulletintype` VARCHAR(100) DEFAULT 'News Bulletin',
  `status` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample bulletins
INSERT INTO `bulletin` (`bulletinname`, `bulletintime`, `bulletintype`, `status`) VALUES
('09:00 AM Morning News Bulletin', '09:00:00', 'News Bulletin', 1),
('01:00 PM Afternoon News Bulletin', '13:00:00', 'News Bulletin', 1),
('06:00 PM Evening Headlines Bulletin', '18:00:00', 'News Bulletin', 1),
('09:00 PM Prime Time News Bulletin', '21:00:00', 'News Bulletin', 1);

-- -------------------------------------------------------------------------
-- Table 2: newsid
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsid` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `SlugName` VARCHAR(255) DEFAULT 'headlines',
  `bulletinname` VARCHAR(255) NOT NULL,
  `bulletinedate` DATE DEFAULT CURRENT_DATE,
  `script` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample newsid records with SlugName = 'headlines'
INSERT INTO `newsid` (`title`, `SlugName`, `bulletinname`, `bulletinedate`, `script`) VALUES
('NATIONAL POLITICS & TAX REFORMS', 'headlines', '09:00 AM Morning News Bulletin', CURRENT_DATE(), 
'FINANCE MINISTER ANNOUNCES NEW TAX REFORMS FOR MIDDLE CLASS\nKEY TAX SLABS REDUCED TO 5 PERCENT EFFECTIVE NEXT FISCAL QUARTER\nPARLIAMENT DEBATE SCHEDULED FOR TOMORROW MORNING'),

('WORLD CUP CRICKET FINAL', 'headlines', '09:00 AM Morning News Bulletin', CURRENT_DATE(), 
'CRICKET WORLD CUP FINAL TICKETS SOLD OUT IN 10 MINUTES\nSTADIUM PREPARES FOR 90,000 FANS IN MUMBAI\nSECURITY ELEVATED TO HIGH ALERT ACROSS CITY'),

('WEATHER WARNING & ALERTS', 'headlines', '01:00 PM Afternoon News Bulletin', CURRENT_DATE(), 
'HEAVY RAINFALL PREDICTED ACROSS COASTAL REGIONS TONIGHT\nFISHERMEN ADVISED NOT TO VENTURE INTO SEA\nEMERGENCY HELPLINES ACTIVATED BY DISASTER MANAGEMENT');

-- -------------------------------------------------------------------------
-- Table 3: headlines
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `headlines` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `headline` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'NEWS',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `headlines` (`headline`, `category`) VALUES
('FINANCE MINISTER ANNOUNCES NEW TAX REFORMS FOR MIDDLE CLASS\nKEY TAX SLABS REDUCED TO 5 PERCENT\nIMPLEMENTATION EFFECTIVE NEXT FISCAL QUARTER', 'NATIONAL'),
('CRICKET WORLD CUP FINAL TICKETS SOLD OUT IN 10 MINUTES\nSTADIUM PREPARES FOR 90,000 FANS IN MUMBAI\nSECURITY ELEVATED TO HIGH ALERT', 'SPORTS'),
('HEAVY RAINFALL PREDICTED ACROSS COASTAL REGIONS TONIGHT\nFISHERMEN ADVISED NOT TO VENTURE INTO SEA\nEMERGENCY HELPLINES ACTIVATED', 'WEATHER');

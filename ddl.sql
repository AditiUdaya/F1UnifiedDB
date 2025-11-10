-- ======================================
-- DATABASE CREATION
-- ======================================
CREATE DATABASE IF NOT EXISTS f1UnifiedDB;
USE f1UnifiedDB;

-- ======================================
-- 1. TEAM TABLE
-- ======================================
CREATE TABLE TEAM (
    TeamID INT AUTO_INCREMENT PRIMARY KEY,
    TeamName VARCHAR(100) NOT NULL,
    BaseCountry VARCHAR(100) NOT NULL
);

-- ======================================
-- 2. DRIVER TABLE
-- ======================================
CREATE TABLE DRIVER (
    DriverID INT PRIMARY KEY,   -- Manual entry (no auto increment)
    TeamID INT,
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    Nationality VARCHAR(50),
    DOB DATE,
    Age INT,
    FOREIGN KEY (TeamID) REFERENCES TEAM(TeamID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- ======================================
-- 3. RACE TABLE
-- ======================================
CREATE TABLE RACE (
    RaceID INT PRIMARY KEY,   -- Manual entry (no auto increment)
    Circuit VARCHAR(100) NOT NULL,
    Date DATE NOT NULL,
    Weather VARCHAR(50)
);

-- ======================================
-- 4. LAP TABLE
-- ======================================
CREATE TABLE LAP (
    LapID INT AUTO_INCREMENT PRIMARY KEY,
    LapNo INT NOT NULL,
    Laptime DECIMAL(6,3),
    Position INT,
    DriverID INT NOT NULL,
    RaceID INT NOT NULL,
    FOREIGN KEY (DriverID) REFERENCES DRIVER(DriverID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (RaceID) REFERENCES RACE(RaceID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ======================================
-- 5. PITSTOP TABLE
-- ======================================
CREATE TABLE PITSTOP (
    PitstopID INT AUTO_INCREMENT PRIMARY KEY,
    TyreCompound VARCHAR(50),
    Duration DECIMAL(5,3),
    LapNo INT,
    DriverID INT NOT NULL,
    RaceID INT NOT NULL,
    FOREIGN KEY (DriverID) REFERENCES DRIVER(DriverID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (RaceID) REFERENCES RACE(RaceID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ======================================
-- 6. TELEMETRY TABLE
-- ======================================
CREATE TABLE TELEMETRY (
    TelemetryID INT AUTO_INCREMENT PRIMARY KEY,
    Speed DECIMAL(6,2),
    Throttle DECIMAL(5,2),
    Brake DECIMAL(5,2),
    Gear INT,
    RPM INT,
    Timestamp DATETIME,
    LapID INT NOT NULL,
    FOREIGN KEY (LapID) REFERENCES LAP(LapID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ======================================
-- VERIFICATION COMMANDS
-- ======================================
SHOW TABLES;

DESCRIBE TEAM;
DESCRIBE DRIVER;
DESCRIBE RACE;
DESCRIBE LAP;
DESCRIBE PITSTOP;
DESCRIBE TELEMETRY;

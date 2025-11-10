-- ======================================
-- DML: INSERT (CREATE)
-- ======================================

-- TEAM
INSERT INTO TEAM (TeamName, BaseCountry)
VALUES 
('Red Bull Racing', 'United Kingdom'),
('Ferrari', 'Italy'),
('Mercedes AMG', 'Germany');

-- DRIVER
INSERT INTO DRIVER (DriverID, TeamID, FName, LName, Nationality, DOB, Age)
VALUES
(1, 1, 'Max', 'Verstappen', 'Dutch', '1997-09-30', 27),
(2, 1, 'Sergio', 'Perez', 'Mexican', '1990-01-26', 35),
(3, 3, 'Lewis', 'Hamilton', 'British', '1985-01-07', 40);

-- RACE
INSERT INTO RACE (RaceID, Circuit, Date, Weather)
VALUES
(101, 'Monaco Circuit', '2025-05-25', 'Sunny'),
(102, 'Silverstone', '2025-07-06', 'Cloudy');

-- LAP
INSERT INTO LAP (LapNo, Laptime, Position, DriverID, RaceID)
VALUES
(1, 78.352, 1, 1, 102),
(2, 78.497, 2, 3, 102);

-- PITSTOP
INSERT INTO PITSTOP (TyreCompound, Duration, LapNo, DriverID, RaceID)
VALUES
('Soft', 2.345, 20, 1, 102),
('Medium', 3.120, 24, 3, 102);

-- TELEMETRY
INSERT INTO TELEMETRY (Speed, Throttle, Brake, Gear, RPM, Timestamp, LapID)
VALUES
(310.55, 0.95, 0.00, 8, 12500, '2025-07-06 14:22:10', 1),
(305.30, 0.92, 0.01, 7, 12480, '2025-07-06 14:22:11', 1);

-- ======================================
-- DML: READ (SELECT)
-- ======================================
SELECT * FROM TEAM;
SELECT * FROM DRIVER;
SELECT * FROM RACE;
SELECT * FROM LAP;
SELECT * FROM PITSTOP;
SELECT * FROM TELEMETRY;

-- ======================================
-- DML: UPDATE
-- ======================================
UPDATE TEAM SET BaseCountry = 'Austria' WHERE TeamName = 'Red Bull Racing';
UPDATE DRIVER SET Age = 41 WHERE LName = 'Hamilton';
UPDATE RACE SET Weather = 'Rainy' WHERE Circuit = 'Silverstone';
UPDATE LAP SET Position = 3 WHERE LapNo = 2 AND DriverID = 3;
UPDATE PITSTOP SET TyreCompound = 'Hard' WHERE DriverID = 3 AND RaceID = 102;
UPDATE TELEMETRY SET Speed = 312.00 WHERE TelemetryID = 1;

-- ======================================
-- DML: DELETE
-- ======================================
DELETE FROM PITSTOP WHERE Duration > 3;
DELETE FROM LAP WHERE LapNo = 1;
DELETE FROM DRIVER WHERE LName = 'Perez';

-- ======================================
-- JOINS & VERIFICATION
-- ======================================

-- 1. Show drivers with their team names
SELECT D.FName, D.LName, T.TeamName
FROM DRIVER D
JOIN TEAM T ON D.TeamID = T.TeamID;

-- 2. Show lap performance per driver and race
SELECT D.FName, D.LName, R.Circuit, L.LapNo, L.Laptime
FROM LAP L
JOIN DRIVER D ON L.DriverID = D.DriverID
JOIN RACE R ON L.RaceID = R.RaceID;

-- 3. Verify all remaining data
SHOW TABLES;
SELECT * FROM TEAM;
SELECT * FROM DRIVER;
SELECT * FROM RACE;
SELECT * FROM LAP;
SELECT * FROM PITSTOP;
SELECT * FROM TELEMETRY;



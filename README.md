# F1 Unified Dashboard  
### SQL Features and Use Cases Documentation  

This project demonstrates the integration of **SQL database features** with a **Node.js (Express.js)** backend to manage and analyze Formula 1 data.  
The system covers CRUD operations, analytics, joins, stored procedures, and views — each mapped to a real-world F1 management scenario.

---

## Overview  

The **F1 Unified Dashboard** connects multiple entities — Drivers, Teams, Races, Laps, Pitstops, and Telemetry — through MySQL queries and relationships.  
Each page in the application demonstrates a different SQL feature or concept, integrated into API routes for visualization in the frontend dashboard.

---

##  SQL Features Summary  

| Page / Module | SQL Feature | Description | Use Case in Formula 1 Context |
|----------------|--------------|--------------|-------------------------------|
| **Drivers Management** | CRUD Operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) | Basic database operations for managing driver information. | Used to add, update, view, or delete driver profiles such as name, nationality, and date of birth. |
|  | Auto-generated IDs & Age Calculation | DriverID auto-incremented manually and age auto-calculated from DOB. | Automates driver record creation and ensures consistent age tracking. |
| **Teams Management** | Aggregate Functions (`AVG`, `MIN`, `MAX`, `GROUP BY`) | Computes youngest, oldest, and overall average driver age per team. | Provides insights into team demographics and average experience. |
|  | Foreign Key Constraints | Prevents deleting a team that has assigned drivers. | Maintains referential integrity between `team` and `driver` tables. |
| **Races Management** | Aggregate Functions (`COUNT`, `MIN`, `MAX`) | Calculates total races, earliest race, and latest race. | Generates F1 season statistics for management dashboards. |
|  | Basic Select Queries | Retrieves all race information (location, date, weather). | Displays race schedules and event details. |
| **Laps Management** | Insert & Select Operations | Inserts new laps and retrieves existing lap data. | Tracks individual driver lap performance and timing. |
|  | Trigger-based Logging | Uses a log table (`lap_log`) to store insert activity automatically. | Records lap entries historically for analysis. |
| **Pitstops Tracking** | Joins (`INNER JOIN`, `RIGHT JOIN`, `CROSS JOIN`, `SELF JOIN`) | Demonstrates different join types using `driver` and `pitstop` tables. | Analyzes pitstop strategies, driver performance, and comparisons. |
|  | **Inner Join** | Combines pitstop and driver details for identity and tyre data. | Shows which driver performed which pitstop and under what conditions. |
|  | **Right Join** | Displays all drivers including those without pitstops. | Ensures all drivers are represented, even if they did not pit. |
|  | **Cross Join** | Creates combinations between all drivers and pitstops. | Simulates driver–pitstop pairing possibilities. |
|  | **Self Join** | Compares multiple pitstops made by the same driver. | Evaluates pitstop performance over different laps. |
| **Telemetry Data** | Simple Select Queries | Fetches telemetry data such as speed, throttle, gear, and RPM. | Visualizes real-time car performance metrics. |
| **Advanced SQL** | Stored Procedure (`CREATE PROCEDURE`, `CALL`) | Defines `GetLapsByDriver(IN driver_id INT)` to retrieve laps for a specific driver. | Simplifies repetitive queries and improves data retrieval efficiency. |
| **Logistics (3D View)** | SQL Views | Uses `DriverTeamView` to combine driver and team details into a virtual table. | Visualizes driver–team relationships through a 3D graph. |
|  | Virtual Table Concept | Aggregates related data from multiple tables. | Supports analytics and visualization without altering base tables. |
| **System Status** | Connection & Health Query (`SELECT 1`) | Confirms live database connection and server health. | Ensures backend and database are functioning properly. |

---

##  Key SQL Concepts Demonstrated  

1. **CRUD Operations** – Data manipulation for core entities (Drivers, Teams, Races, etc.)  
2. **Aggregate Functions** – Data summarization using `AVG`, `MIN`, `MAX`, and `COUNT`.  
3. **Joins** – Merging relational data across tables for analysis and visualization.  
4. **Views** – Creating reusable virtual tables to simplify complex queries.  
5. **Stored Procedures** – Encapsulating reusable SQL logic for driver-specific data.  
6. **Triggers and Logs** – Recording actions automatically when new laps are added.  
7. **Constraints** – Maintaining referential and logical consistency in data.  
8. **Database Health Checks** – Validating live connectivity between API and MySQL.  

---

##  Real-World Use Cases in F1  

- **Driver Table:** Manage driver profiles and nationalities for each team.  
- **Team Analytics:** Compare average driver ages to evaluate experience balance.  
- **Race Data:** Track upcoming and completed races with real-time date analysis.  
- **Lap Analysis:** Record and monitor lap times and performance improvements.  
- **Pitstop Comparisons:** Use joins to analyze pit strategies and efficiency.  
- **Telemetry Dashboard:** Display speed, RPM, and throttle readings for race telemetry.  
- **Stored Procedures:** Retrieve all laps for a specific driver dynamically.  
- **3D Logistics View:** Visualize driver-to-team mapping using SQL views for data linking.  

---

##  Database Schema Overview  

**Primary Tables:**  
- `driver(DriverID, FName, LName, TeamID, Nationality, DOB, Age)`  
- `team(TeamID, TeamName, BaseCountry)`  
- `F1_RACES(RaceID, RaceName, Date, Weather)`  
- `lap(LapNo, LapTime, Position, DriverID, RaceID)`  
- `pitstop(PitstopID, TyreCompound, Duration, LapNo, DriverID, RaceID)`  
- `telemetry(ID, Speed, Throttle, Brake, Gear, RPM, Timestamp, LapID)`  

**Derived Tables / Views:**  
- `DriverTeamView` — Combines driver and team data for visualization.  
- `lap_log` — Maintains insertion history for laps via triggers.  

---

##  Technologies Used  

- **Backend:** Node.js (Express.js)  
- **Database:** MySQL  
- **Frontend Dashboard:** HTML, CSS, JavaScript  
- **Libraries:** mysql2, cors, express  
- **Visualization:** Chart.js, 3D Graph for SQL View  

---

##  Example Analytical Queries  

```sql
-- Average driver age per team
SELECT TeamID, AVG(Age) AS AvgAge FROM driver GROUP BY TeamID;

-- Youngest and oldest team averages
SELECT MIN(avg_age) AS Youngest, MAX(avg_age) AS Oldest 
FROM (SELECT AVG(Age) AS avg_age FROM driver GROUP BY TeamID) AS sub;

-- Race analytics
SELECT COUNT(*) AS TotalRaces, MIN(Date) AS Earliest, MAX(Date) AS Latest FROM F1_RACES;

-- Stored Procedure: Fetch laps by driver
CALL GetLapsByDriver(1);

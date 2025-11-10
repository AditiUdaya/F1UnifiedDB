import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "xxx",
  database: "f1unifiedDB",
});

/* -------------------- helpers -------------------- */
// convert '1985-01-06T18:30:00.000Z' -> '1985-01-06'
const toYMD = (val) => (val && typeof val === "string" ? val.split("T")[0] : null);

// compute age (in whole years) from 'YYYY-MM-DD'
const calcAgeFromYMD = (ymd) => {
  if (!ymd) return null;
  const dob = new Date(`${ymd}T00:00:00`);
  if (isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};
/* ------------------------------------------------- */

app.get("/drivers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM driver;");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});


// ✅ FIXED ADD DRIVER (AUTO ID + AUTO AGE)
// ✅ Add Driver (Auto-generate next DriverID manually)
app.post("/drivers", async (req, res) => {
  const { FName, LName, TeamID, Nationality, DOB, Age } = req.body;
  console.log("🟢 Received new driver:", req.body);

  // Convert date + auto age
  const cleanDOB = toYMD(DOB);
  const computedAge = cleanDOB ? calcAgeFromYMD(cleanDOB) : (Age ?? null);

  try {
    // ✅ Get next available DriverID
    const [rows] = await pool.query("SELECT MAX(DriverID) AS maxId FROM driver");
    const nextDriverID = (rows[0].maxId || 0) + 1;

    // ✅ Insert manually with that ID
    const [result] = await pool.query(
      "INSERT INTO driver (DriverID, FName, LName, TeamID, Nationality, DOB, Age) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nextDriverID, FName, LName, TeamID || null, Nationality || null, cleanDOB || null, computedAge]
    );

    console.log("✅ Driver inserted:", nextDriverID);
    res.status(201).json({
      DriverID: nextDriverID,
      message: "Driver added successfully ✅",
    });
  } catch (err) {
    console.error("❌ Error inserting driver:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a driver
app.put("/drivers/:id", async (req, res) => {
  const { id } = req.params;
  const { FName, LName, TeamID, Nationality, DOB, Age } = req.body;

  console.log(`🟡 Updating driver ${id}:`, req.body);

  const cleanDOB = toYMD(DOB);
  const computedAge = cleanDOB ? calcAgeFromYMD(cleanDOB) : (Age ?? null);

  try {
    const [result] = await pool.query(
      "UPDATE driver SET FName = ?, LName = ?, TeamID = ?, Nationality = ?, DOB = ?, Age = ? WHERE DriverID = ?",
      [FName, LName, TeamID || null, Nationality || null, cleanDOB || null, computedAge, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Driver not found" });

    console.log("✅ Driver updated:", id);
    res.json({ message: "Driver updated successfully ✅" });
  } catch (err) {
    console.error("❌ Error updating driver:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Delete a driver
app.delete("/drivers/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deleting driver ${id}`);

  try {
    const [result] = await pool.query("DELETE FROM driver WHERE DriverID = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Driver not found" });

    console.log("✅ Driver deleted:", id);
    res.json({ message: "Driver deleted successfully ✅" });
  } catch (err) {
    console.error("❌ Error deleting driver:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/teams", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM team;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching teams:", err);
    res.status(500).json({ error: "Database query failed (teams)" });
  }
});
// ✅ Delete a team
app.delete("/teams/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deleting team ${id}`);

  try {
    // Try deleting the team
    const [result] = await pool.query("DELETE FROM team WHERE TeamID = ?", [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Team not found" });

    console.log("✅ Team deleted:", id);
    res.json({ message: "Team deleted successfully ✅" });
  } catch (err) {
    console.error("❌ Error deleting team:", err);

    // Handle foreign key constraint (if drivers reference this team)
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      res.status(400).json({
        error: "Cannot delete team — drivers or records still linked to it 🚫",
      });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// ✅ Analytics route — computes youngest, oldest, and overall average team driver age
app.get("/teams/analytics", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        MIN(avg_age) AS YoungestTeamAvg,
        MAX(avg_age) AS OldestTeamAvg,
        ROUND(AVG(avg_age), 2) AS OverallAvg
      FROM (
        SELECT AVG(Age) AS avg_age
        FROM driver
        WHERE TeamID IS NOT NULL
        GROUP BY TeamID
      ) sub;
    `);

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error computing analytics:", err);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});



// Races
app.get("/races", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM F1_RACES;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching races:", err);
    res.status(500).json({ error: "Database query failed (races)" });
  }
});

// ✅ Race analytics: total races, earliest & latest dates
app.get("/races/analytics", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS TotalRaces,
        MIN(Date) AS EarliestRace,
        MAX(Date) AS LatestRace
      FROM F1_RACES;
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error computing race analytics:", err);
    res.status(500).json({ error: "Failed to compute race analytics" });
  }
});


// Laps
app.get("/laps", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lap;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching laps:", err);
    res.status(500).json({ error: "Database query failed (laps)" });
  }
});

// Pitstops
app.get("/pitstops", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pitstop;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching pitstops:", err);
    res.status(500).json({ error: "Database query failed (pitstops)" });
  }
});

// Telemetry
app.get("/telemetries", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM telemetry;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching telemetries:", err);
    res.status(500).json({ error: "Database query failed (telemetries)" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("F1 Unified API is running ");
});

// ✅ Health check route
app.get("/status", async (req, res) => {
  try {
    await pool.query("SELECT 1;");
    res.json({
      connected: true,
      database: "f1unifiedDB",
      message: "Database connection OK ✅",
    });
  } catch (err) {
    console.error("❌ Database not reachable:", err);
    res.status(500).json({
      connected: false,
      database: "f1unifiedDB",
      message: "Database connection failed ❌",
    });
  }
});

//joins
app.get("/join/inner", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.PitstopID, p.TyreCompound, p.Duration, p.LapNo, p.RaceID,
             d.DriverID, d.FName, d.LName, d.Nationality
      FROM pitstop p
      INNER JOIN driver d ON p.DriverID = d.DriverID;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Inner join failed" });
  }
});

app.get("/join/right", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.DriverID, d.FName, d.LName, d.TeamID, d.Nationality,
             p.PitstopID, p.Duration, p.TyreCompound
      FROM pitstop p
      RIGHT JOIN driver d ON p.DriverID = d.DriverID;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Right join failed" });
  }
});

app.get("/join/cross", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.DriverID, d.FName, d.LName,
             p.PitstopID, p.TyreCompound, p.Duration
      FROM driver d
      CROSS JOIN pitstop p;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Cross join failed" });
  }
});

app.get("/join/self", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.DriverID,
             a.PitstopID AS StopA_ID, a.Duration AS StopA_Duration, a.LapNo AS StopA_Lap,
             b.PitstopID AS StopB_ID, b.Duration AS StopB_Duration, b.LapNo AS StopB_Lap
      FROM pitstop a
      JOIN pitstop b
        ON a.DriverID = b.DriverID AND a.LapNo < b.LapNo;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Self join failed" });
  }
});

//view
app.get("/views/drivers-teams", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM DriverTeamView;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching view:", err);
    res.status(500).json({ error: "Failed to fetch view data" });
  }
});

// ✅ Add this before app.listen(...)
app.get("/procedure/laps/:driverId", async (req, res) => {
  const { driverId } = req.params;
  try {
    // optional: ensure DB selected
    await pool.query("USE f1UnifiedDB");

    // optional: create the procedure if missing
    await pool.query(`
      CREATE PROCEDURE IF NOT EXISTS GetLapsByDriver(IN driver_id INT)
      BEGIN
        SELECT LapNo, LapTime, Position, RaceID
        FROM lap
        WHERE DriverID = driver_id;
      END;
    `);

    // ✅ call procedure
    const [rows] = await pool.query("CALL GetLapsByDriver(?)", [driverId]);
    res.json(rows[0]); // return JSON data
  } catch (err) {
    console.error(" Error running procedure:", err);
    res.status(500).json({ error: err.message });
  }
});
// ✅ Fetch all lap logs
app.get("/lap_log", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lap_log ORDER BY LogTime DESC;");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching lap logs:", err);
    res.status(500).json({ error: "Failed to fetch lap logs" });
  }
});

// ✅ Add a new lap
app.post("/laps", async (req, res) => {
  try {
    const { LapNo, Laptime, Position, DriverID, RaceID } = req.body;

    if (!LapNo || !Laptime || !DriverID || !RaceID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert the new lap into the lap table
    const [result] = await pool.query(
      "INSERT INTO lap (LapNo, Laptime, Position, DriverID, RaceID) VALUES (?, ?, ?, ?, ?)",
      [LapNo, Laptime, Position || null, DriverID, RaceID]
    );

    console.log("✅ New lap added:", LapNo);

    // Respond with success + info
    res.status(201).json({
      message: "Lap added successfully ✅",
      LapNo,
      insertId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error adding lap:", err);
    res.status(500).json({ error: "Failed to insert lap" });
  }
});



app.listen(5000, () => console.log("Server running on http://localhost:5000"));

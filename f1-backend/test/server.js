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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

// server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "replace",
  database: "f1unifiedDB",
});

// Helper function to fetch all rows
async function getAllFromTable(res, tableName) {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${tableName};`);
    res.json(rows);
  } catch (err) {
    console.error(`Error fetching from ${tableName}:`, err);
    res.status(500).json({ error: `Database query failed for ${tableName}` });
  }
}

// ===================== ROUTES ===================== //

// 1️ DRIVERS
app.get("/drivers", async (req, res) => getAllFromTable(res, "driver"));

app.post("/drivers", async (req, res) => {
  const { name, nationality, team_id, number } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO driver (name, nationality, team_id, number) VALUES (?, ?, ?, ?)",
      [name, nationality, team_id, number]
    );
    res.status(201).json({ message: "Driver added", id: result.insertId });
  } catch (err) {
    console.error("Error adding driver:", err);
    res.status(500).json({ error: "Failed to add driver" });
  }
});

// 2️ TEAMS
app.get("/teams", async (req, res) => getAllFromTable(res, "team"));

app.post("/teams", async (req, res) => {
  const { name, base, principal } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO team (name, base, principal) VALUES (?, ?, ?)",
      [name, base, principal]
    );
    res.status(201).json({ message: "Team added", id: result.insertId });
  } catch (err) {
    console.error("Error adding team:", err);
    res.status(500).json({ error: "Failed to add team" });
  }
});


// 3️ PITSTOPS
app.get("/pitstops", async (req, res) => getAllFromTable(res, "pitstop"));

app.post("/pitstops", async (req, res) => {
  const { TyreCompound, Duration, LapNo, DriverID, RaceID } = req.body;

  try {
    console.log("📩 Incoming pitstop data:", req.body);

    const [result] = await pool.query(
      `INSERT INTO PITSTOP (TyreCompound, Duration, LapNo, DriverID, RaceID)
       VALUES (?, ?, ?, ?, ?)`,
      [TyreCompound, Duration, LapNo, DriverID, RaceID]
    );

    console.log("✅ Pitstop inserted successfully:", result);
    res.status(201).json({ message: "Pitstop added", id: result.insertId });

  } catch (err) {
    console.error("❌ Error adding pitstop:", err.sqlMessage || err.message || err);
    res.status(500).json({ error: err.sqlMessage || "Failed to add pitstop" });
  }
});







// 4️ RACES
app.get("/races", async (req, res) => getAllFromTable(res, "race"));

app.post("/races", async (req, res) => {
  const { name, location, date } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO race (name, location, date) VALUES (?, ?, ?)",
      [name, location, date]
    );
    res.status(201).json({ message: "Race added", id: result.insertId });
  } catch (err) {
    console.error("Error adding race:", err);
    res.status(500).json({ error: "Failed to add race" });
  }
});

// 5️ LAPS
app.get("/laps", async (req, res) => getAllFromTable(res, "lap"));

app.post("/laps", async (req, res) => {
  const { driver_id, race_id, lap_number, lap_time } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO lap (driver_id, race_id, lap_number, lap_time) VALUES (?, ?, ?, ?)",
      [driver_id, race_id, lap_number, lap_time]
    );
    res.status(201).json({ message: "Lap added", id: result.insertId });
  } catch (err) {
    console.error("Error adding lap:", err);
    res.status(500).json({ error: "Failed to add lap" });
  }
});

// 6️ TELEMETRY
app.get("/telemetries", async (req, res) => getAllFromTable(res, "telemetry"));

app.post("/telemetries", async (req, res) => {
  const { driver_id, race_id, speed, gear, rpm } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO telemetry (driver_id, race_id, speed, gear, rpm) VALUES (?, ?, ?, ?, ?)",
      [driver_id, race_id, speed, gear, rpm]
    );
    res.status(201).json({ message: "Telemetry added", id: result.insertId });
  } catch (err) {
    console.error("Error adding telemetry:", err);
    res.status(500).json({ error: "Failed to add telemetry" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("F1 Unified API is running 🚦");
});

// Start server
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

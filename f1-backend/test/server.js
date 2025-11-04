import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "replace",
  database: "f1unifiedDB",
});

app.get("/drivers", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM driver;");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
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
    const [rows] = await pool.query("SELECT * FROM race;");
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

//  Telemetry
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

// ✅ Health check route — tells frontend if backend + DB are connected
app.get("/status", async (req, res) => {
  try {
    // Run a small test query to check DB connection
    await pool.query("SELECT 1;");
    res.json({
      connected: true,
      database: "f1UnifiedDB",
      message: "Database connection OK ✅",
    });
  } catch (err) {
    console.error("❌ Database not reachable:", err);
    res.status(500).json({
      connected: false,
      database: "f1UnifiedDB",
      message: "Database connection failed ❌",
    });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

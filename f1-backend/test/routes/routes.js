// server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

//  MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "replace",
  database: "f1unifiedDB",
});

// Helper function to fetch data from any table
async function getAllFromTable(res, tableName) {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${tableName};`);
    res.json(rows);
  } catch (err) {
    console.error(`Error fetching from ${tableName}:`, err);
    res.status(500).json({ error: `Database query failed for ${tableName}` });
  }
}

//  ROUTES

// 1️ Drivers
app.get("/drivers", async (req, res) => getAllFromTable(res, "driver"));

// 2️ Teams
app.get("/teams", async (req, res) => getAllFromTable(res, "team"));

// 3️ Pitstops
app.get("/pitstops", async (req, res) => getAllFromTable(res, "pitstop"));

// 4️ Races
app.get("/races", async (req, res) => getAllFromTable(res, "race"));

// 5️ laps
app.get("/laps", async (req, res) => getAllFromTable(res, "lap"));

// 6️ Constructors
app.get("/telemetries", async (req, res) => getAllFromTable(res, "telemetry"));

// Default route
app.get("/", (req, res) => {
  res.send("F1 Unified API is running ");
});

//  Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));

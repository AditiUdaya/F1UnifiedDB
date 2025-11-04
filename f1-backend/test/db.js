import mysql from "mysql2/promise";

// Create MySQL connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "replace", // replace with your MySQL root password
  database: "f1unifieddb"
});

// Test connection
async function testConnection() {
  try {
    const [rows] = await pool.query("SHOW TABLES;");
    console.log(" MySQL Connected Successfully!");
    console.log("Tables:", rows.map(r => Object.values(r)[0]));
  } catch (err) {
    console.error(" Database connection failed:", err.message);
  } finally {
    process.exit();
  }
}

testConnection();

const path = require("path");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();


const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "employee_directory",
});


pool.on("connect", () => {
  console.log("Successfully Connected to PostgreSQL database");
});


pool.on("error", (err) => {
  console.error("Unexpected error on PostgreSQL:", err.message);
});


const query = (text, params) => pool.query(text, params);


const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connection successful at:", res.rows[0].now);
    return true;
    
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection,
};

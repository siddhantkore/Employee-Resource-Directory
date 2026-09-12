const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./src/routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "Employee Resource Directory is running!" });
});

app.use("/api/employees", employeeRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
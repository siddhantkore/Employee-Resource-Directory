require("dotenv").config();
const app = require("./app");
const { testConnection } = require("./src/config/dbConfig");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await testConnection();
});
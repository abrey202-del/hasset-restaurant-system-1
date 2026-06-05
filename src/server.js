const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const orderRoutes = require("./routes/orderRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Hasset Restaurant Backend Running",
    version: "1.0.0",
  });
});

const PORT = process.env.PORT || 5000;
app.get("/create-tables", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        table_number VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        item_name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL
      );
    `);

    res.json({
      success: true,
      message: "Tables created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
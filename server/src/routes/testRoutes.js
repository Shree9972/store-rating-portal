const express = require("express");
const { db } = require("../config/database");

const router = express.Router();

router.get("/database", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS userCount FROM users"
    );

    res.status(200).json({
      success: true,
      message: "Database query successful",
      data: rows[0],
    });
  } catch (error) {
    console.error("Database test error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database query failed",
    });
  }
});

module.exports = router;
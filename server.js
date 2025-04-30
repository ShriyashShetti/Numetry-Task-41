const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shriyash27@",
  database: "fitness_app",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Add Workout Route
app.post("/addWorkout", (req, res) => {
  const {
    user_id,
    type,
    exercise_name,
    sets,
    reps,
    weight,
    duration,
    calories,
    notes,
    date,
  } = req.body;

  console.log("📥 Received workout data:", req.body);

  // Debugging: Log the insert query and values
  const q = `
    INSERT INTO workouts
    (user_id, type, exercise_name, sets, reps, weight, duration, calories, notes, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  console.log("📥 Insert query:", q);
  console.log("📥 Values:", [user_id, type, exercise_name, sets, reps, weight, duration, calories, notes, date]);

  db.query(
    q,
    [user_id, type, exercise_name, sets, reps, weight, duration, calories, notes, date],
    (err, result) => {
      if (err) {
        console.error("❌ SQL INSERT ERROR:");
        console.error("👉 Error message:", err.message);
        console.error("👉 Full error object:", err);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
      }

      console.log("✅ Workout added successfully:", result);
      return res.status(200).json({ message: "Workout added", result });
    }
  );
});

// Start server
app.listen(8081, () => {
  console.log("🚀 Server running on http://localhost:8081");
});

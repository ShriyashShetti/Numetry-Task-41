import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchHistory();
  }, []);

  const [form, setForm] = useState({
    user_id: 1,
    type: "strength",
    exercise_name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    calories: "",
    notes: "",
    date: "",
  });

  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [fitnessGoal, setFitnessGoal] = useState(200); // Default goal set to 200 minutes
  const [customGoal, setCustomGoal] = useState(fitnessGoal); // To store custom goal input

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoalChange = (e) => {
    setCustomGoal(Number(e.target.value));
  };

  const fetchHistory = async () => {
    try {
      const randomHistory = Array.from({ length: 5 }, (_, i) => ({
        date: `2025-04-${25 + i}`,
        exercise_name: ["Pushups", "Jogging", "Squats", "Planks", "Cycling"][i],
        type: ["strength", "cardio", "strength", "flexibility", "cardio"][i],
        sets: Math.floor(Math.random() * 5) + 1,
        reps: Math.floor(Math.random() * 15) + 5,
        weight: Math.floor(Math.random() * 40),
        duration: Math.floor(Math.random() * 15) + 5,
        calories: Math.floor(Math.random() * 100) + 50,
      }));
      setWorkoutHistory(randomHistory);
    } catch (err) {
      console.error("❌ Fetch History Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/addWorkout", {
        ...form,
        sets: Number(form.sets || 0),
        reps: Number(form.reps || 0),
        weight: Number(form.weight || 0),
        duration: Number(form.duration || 0),
        calories: Number(form.calories || 0),
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      fetchHistory();
    } catch (err) {
      console.error("❌ Axios Error:", err);
      alert("Failed to add workout.");
    }
  };

  // Weekly Goal Logic
  const totalDuration = workoutHistory.reduce(
    (sum, w) => sum + Number(w.duration || 0),
    0
  );
  const goalProgress = Math.min((totalDuration / customGoal) * 100, 100);

  const chartData = {
    labels: ["Sets", "Reps", "Weight", "Duration", "Calories"],
    datasets: [
      {
        label: "Workout Input Stats",
        backgroundColor: "#f3e800", // Light Yellow
        data: [
          Number(form.sets || 0),
          Number(form.reps || 0),
          Number(form.weight || 0),
          Number(form.duration || 0),
          Number(form.calories || 0),
        ],
      },
    ],
  };

  return (
    <div
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(to bottom right, #1e3d58, #a8c8d4)", // Modern muted gradient colors
      }}
    >
      <div className="container">
        <div className="text-center mb-4" data-aos="fade-down">
          <h2 className="fw-bold text-white">🏋️ Workout Logger</h2>
          <p className="text-light">Log your workouts and track your weekly progress</p>
        </div>

        {/* Set Fitness Goal */}
        <div className="card mx-auto border-0 shadow" style={{ maxWidth: "700px" }} data-aos="zoom-in">
          <div className="card-body p-4" style={{ backgroundColor: "#f5f5f5" }}>
            <h5 className="text-center text-info">🎯 Set Your Fitness Goal</h5>
            <div className="row g-3">
              <div className="col-8">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter your weekly fitness goal (minutes)"
                  value={customGoal}
                  onChange={handleGoalChange}
                />
              </div>
              <div className="col-4">
                <button
                  className="btn btn-info w-100"
                  onClick={() => setFitnessGoal(customGoal)}
                >
                  Set Goal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Form */}
        <div className="card mx-auto border-0 shadow" style={{ maxWidth: "700px" }} data-aos="zoom-in">
          <div className="card-body p-4" style={{ backgroundColor: "#f5f5f5" }}>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Exercise</label>
                <input type="text" name="exercise_name" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Type</label>
                <select name="type" className="form-select" onChange={handleChange} required>
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Date</label>
                <input type="date" name="date" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label">Duration (min)</label>
                <input type="number" name="duration" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-4">
                <label className="form-label">Sets</label>
                <input type="number" name="sets" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-4">
                <label className="form-label">Reps</label>
                <input type="number" name="reps" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-4">
                <label className="form-label">Weight (kg)</label>
                <input type="number" name="weight" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Calories</label>
                <input type="number" name="calories" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-6">
                <label className="form-label">Notes</label>
                <input type="text" name="notes" className="form-control" onChange={handleChange} />
              </div>
              <div className="col-12">
                <button className="btn btn-warning w-100 fw-bold">➕ Add Workout</button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Chart */}
        <div className="card mt-4 shadow-sm" data-aos="fade-up">
          <div className="card-body" style={{ backgroundColor: "#f5f5f5" }}>
            <h5 className="text-center text-info mb-3">📊 Workout Input Summary</h5>
            <Bar data={chartData} />
          </div>
        </div>

        {/* Goal Progress */}
        <div className="card mt-4 shadow-sm" data-aos="fade-up">
          <div className="card-body" style={{ backgroundColor: "#f5f5f5" }}>
            <h5 className="text-success text-center mb-2">🎯 Weekly Goal Progress</h5>
            <p className="text-center mb-1">{totalDuration} / {customGoal} minutes</p>
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped bg-success"
                role="progressbar"
                style={{ width: `${goalProgress}%` }}
              >
                {goalProgress.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Workout History */}
        <div className="card mt-4 shadow-sm" data-aos="fade-up">
          <div className="card-body table-responsive" style={{ backgroundColor: "#f5f5f5" }}>
            <h5 className="text-center text-dark mb-3">📚 Workout History</h5>
            {workoutHistory.length === 0 ? (
              <p className="text-center text-muted">No workouts yet.</p>
            ) : (
              <table className="table table-hover table-bordered text-center">
                <thead className="table-primary">
                  <tr>
                    <th>Date</th>
                    <th>Exercise</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutHistory.map((w, idx) => (
                    <tr key={idx}>
                      <td>{w.date}</td>
                      <td>{w.exercise_name}</td>
                      <td>{w.type}</td>
                      <td>{w.duration} min</td>
                      <td>{w.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="toast show position-fixed bottom-0 end-0 m-3 bg-success text-white" role="alert">
            <div className="toast-body">✅ Workout logged successfully!</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

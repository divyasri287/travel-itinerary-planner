const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Travel Itinerary Planner API is running" });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
// Phase 2+ will add: /api/trips, /api/trips/:tripId/itinerary,
// /api/trips/:tripId/accommodation, /api/trips/:tripId/transportation,
// /api/trips/:tripId/expenses, /api/ai

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;

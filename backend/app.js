const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const transportationRoutes = require("./routes/transportationRoutes");
const { tripExpenseRouter, expenseByIdRouter } = require("./routes/expenseRoutes");
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
app.use("/api/trips", tripRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trips/:tripId/itinerary", itineraryRoutes);
app.use("/api/trips/:tripId/accommodation", accommodationRoutes);
app.use("/api/trips/:tripId/transportation", transportationRoutes);
app.use("/api/trips/:tripId/expenses", tripExpenseRouter);
app.use("/api/expenses", expenseByIdRouter);
// Later phases will add: /api/ai

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;

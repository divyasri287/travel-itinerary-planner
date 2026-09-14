const express = require("express");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");
const { loadTripAndVerifyOwnership } = require("../middleware/tripOwnership");
const { loadExpenseAndVerifyOwnership } = require("../middleware/expenseOwnership");
const { validateExpense } = require("../middleware/validateRequest");

// --- Nested router: mounted at /api/trips/:tripId/expenses ---
// mergeParams lets this router read :tripId from the parent mount path.
// Matches the Itinerary/Accommodation/Transportation pattern for
// listing and creating expenses under a specific trip.
const tripExpenseRouter = express.Router({ mergeParams: true });

tripExpenseRouter.use(protect);
tripExpenseRouter.use(loadTripAndVerifyOwnership);

tripExpenseRouter.get("/", getExpenses);
tripExpenseRouter.post("/", validateExpense(true), createExpense);

// --- Flat router: mounted at /api/expenses ---
// PUT/DELETE operate directly on an expense by its own :id, with no
// :tripId in the URL, so ownership is verified via
// loadExpenseAndVerifyOwnership instead of loadTripAndVerifyOwnership.
const expenseByIdRouter = express.Router();

expenseByIdRouter.use(protect);

expenseByIdRouter
  .route("/:id")
  .put(loadExpenseAndVerifyOwnership, validateExpense(false), updateExpense)
  .delete(loadExpenseAndVerifyOwnership, deleteExpense);

module.exports = { tripExpenseRouter, expenseByIdRouter };

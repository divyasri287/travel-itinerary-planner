const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Loads the Expense referenced by :id and verifies its parent trip belongs
 * to the authenticated user. Unlike Itinerary/Accommodation/Transportation,
 * the flat /api/expenses/:id routes have no :tripId in the URL, so trip
 * ownership can't be checked by loadTripAndVerifyOwnership beforehand -
 * this middleware looks up the expense's tripId and verifies ownership
 * itself. Attaches the loaded document to req.expense so downstream
 * controllers don't need to re-fetch it.
 */
const loadExpenseAndVerifyOwnership = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const expense = await Expense.findById(id);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  const trip = await Trip.findById(expense.tripId);

  if (!trip || trip.userId.toString() !== req.userId) {
    return res.status(403).json({ message: "You do not have access to this expense" });
  }

  req.expense = expense;
  next();
});

module.exports = { loadExpenseAndVerifyOwnership };

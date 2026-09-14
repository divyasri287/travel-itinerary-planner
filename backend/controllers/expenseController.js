const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   GET /api/trips/:tripId/expenses
 * @desc    List all expenses for a trip (ownership already verified by
 *          loadTripAndVerifyOwnership), sorted by date so the UI can
 *          display them in chronological order.
 * @access  Private
 */
const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ tripId: req.trip._id }).sort({ date: 1 });

  res.status(200).json({ expenses });
});

/**
 * @route   POST /api/trips/:tripId/expenses
 * @desc    Create a new expense under the given trip
 * @access  Private
 */
const createExpense = asyncHandler(async (req, res) => {
  const { category, description, amount, date } = req.body;

  const expense = await Expense.create({
    tripId: req.trip._id,
    category,
    description: description.trim(),
    amount,
    date,
  });

  res.status(201).json({ message: "Expense created successfully", expense });
});

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update an expense (ownership already verified by
 *          loadExpenseAndVerifyOwnership, since this route is not nested
 *          under a trip)
 * @access  Private
 */
const updateExpense = asyncHandler(async (req, res) => {
  const expense = req.expense;
  const { category, description, amount, date } = req.body;

  if (category !== undefined) expense.category = category;
  if (description !== undefined) expense.description = description.trim();
  if (amount !== undefined) expense.amount = amount;
  if (date !== undefined) expense.date = date;

  // expense.save() re-runs schema validation, including the category enum
  // check.
  const updatedExpense = await expense.save();

  res.status(200).json({ message: "Expense updated successfully", expense: updatedExpense });
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete a single expense (ownership already verified)
 * @access  Private
 */
const deleteExpense = asyncHandler(async (req, res) => {
  await req.expense.deleteOne();

  res.status(200).json({ message: "Expense deleted successfully" });
});

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};

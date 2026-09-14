const Transportation = require("../models/Transportation");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   GET /api/trips/:tripId/transportation
 * @desc    List all transportation entries for a trip (ownership already
 *          verified by loadTripAndVerifyOwnership), sorted by date then
 *          time so the UI can display legs in chronological order.
 * @access  Private
 */
const getTransportationEntries = asyncHandler(async (req, res) => {
  const entries = await Transportation.find({ tripId: req.trip._id }).sort({ date: 1, time: 1 });

  res.status(200).json({ entries });
});

/**
 * @route   POST /api/trips/:tripId/transportation
 * @desc    Create a new transportation entry under the given trip
 * @access  Private
 */
const createTransportationEntry = asyncHandler(async (req, res) => {
  const { type, from, to, date, time, cost } = req.body;

  const entry = await Transportation.create({
    tripId: req.trip._id,
    userId: req.userId,
    type,
    from: from.trim(),
    to: to.trim(),
    date,
    time,
    cost,
  });

  res.status(201).json({ message: "Transportation entry created successfully", entry });
});

/**
 * @route   PUT /api/trips/:tripId/transportation/:entryId
 * @desc    Update a transportation entry (ownership already verified by
 *          loadTripAndVerifyOwnership + loadTransportationAndVerifyOwnership)
 * @access  Private
 */
const updateTransportationEntry = asyncHandler(async (req, res) => {
  const entry = req.transportation;
  const { type, from, to, date, time, cost } = req.body;

  if (type !== undefined) entry.type = type;
  if (from !== undefined) entry.from = from.trim();
  if (to !== undefined) entry.to = to.trim();
  if (date !== undefined) entry.date = date;
  if (time !== undefined) entry.time = time;
  if (cost !== undefined) entry.cost = cost;

  // entry.save() re-runs schema validation, including the enum check on type.
  const updatedEntry = await entry.save();

  res.status(200).json({ message: "Transportation entry updated successfully", entry: updatedEntry });
});

/**
 * @route   DELETE /api/trips/:tripId/transportation/:entryId
 * @desc    Delete a single transportation entry (ownership already verified)
 * @access  Private
 */
const deleteTransportationEntry = asyncHandler(async (req, res) => {
  await req.transportation.deleteOne();

  res.status(200).json({ message: "Transportation entry deleted successfully" });
});

module.exports = {
  getTransportationEntries,
  createTransportationEntry,
  updateTransportationEntry,
  deleteTransportationEntry,
};

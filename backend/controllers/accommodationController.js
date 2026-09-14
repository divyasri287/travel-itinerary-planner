const Accommodation = require("../models/Accommodation");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   GET /api/trips/:tripId/accommodation
 * @desc    List all accommodation entries for a trip (ownership already
 *          verified by loadTripAndVerifyOwnership), sorted by check-in
 *          date so the UI can display stays in chronological order.
 * @access  Private
 */
const getAccommodationEntries = asyncHandler(async (req, res) => {
  const entries = await Accommodation.find({ tripId: req.trip._id }).sort({ checkIn: 1 });

  res.status(200).json({ entries });
});

/**
 * @route   POST /api/trips/:tripId/accommodation
 * @desc    Create a new accommodation entry under the given trip
 * @access  Private
 */
const createAccommodationEntry = asyncHandler(async (req, res) => {
  const { hotelName, address, checkIn, checkOut, cost } = req.body;

  const entry = await Accommodation.create({
    tripId: req.trip._id,
    userId: req.userId,
    hotelName: hotelName.trim(),
    address: address.trim(),
    checkIn,
    checkOut,
    cost,
  });

  res.status(201).json({ message: "Accommodation entry created successfully", entry });
});

/**
 * @route   PUT /api/trips/:tripId/accommodation/:entryId
 * @desc    Update an accommodation entry (ownership already verified by
 *          loadTripAndVerifyOwnership + loadAccommodationAndVerifyOwnership)
 * @access  Private
 */
const updateAccommodationEntry = asyncHandler(async (req, res) => {
  const entry = req.accommodation;
  const { hotelName, address, checkIn, checkOut, cost } = req.body;

  if (hotelName !== undefined) entry.hotelName = hotelName.trim();
  if (address !== undefined) entry.address = address.trim();
  if (checkIn !== undefined) entry.checkIn = checkIn;
  if (checkOut !== undefined) entry.checkOut = checkOut;
  if (cost !== undefined) entry.cost = cost;

  // entry.save() re-runs schema validation, including the pre('validate')
  // check-in/check-out ordering check.
  const updatedEntry = await entry.save();

  res.status(200).json({ message: "Accommodation entry updated successfully", entry: updatedEntry });
});

/**
 * @route   DELETE /api/trips/:tripId/accommodation/:entryId
 * @desc    Delete a single accommodation entry (ownership already verified)
 * @access  Private
 */
const deleteAccommodationEntry = asyncHandler(async (req, res) => {
  await req.accommodation.deleteOne();

  res.status(200).json({ message: "Accommodation entry deleted successfully" });
});

module.exports = {
  getAccommodationEntries,
  createAccommodationEntry,
  updateAccommodationEntry,
  deleteAccommodationEntry,
};

const Itinerary = require("../models/Itinerary");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   GET /api/trips/:tripId/itinerary
 * @desc    List all itinerary items for a trip (ownership already verified
 *          by loadTripAndVerifyOwnership), sorted by date then start time
 *          so the UI can group items into days in the correct order.
 * @access  Private
 */
const getItineraryItems = asyncHandler(async (req, res) => {
  const items = await Itinerary.find({ tripId: req.trip._id }).sort({ date: 1, startTime: 1 });

  res.status(200).json({ items });
});

/**
 * @route   POST /api/trips/:tripId/itinerary
 * @desc    Create a new itinerary item under the given trip
 * @access  Private
 */
const createItineraryItem = asyncHandler(async (req, res) => {
  const { date, place, activity, startTime, endTime, estimatedCost, notes } = req.body;

  const item = await Itinerary.create({
    tripId: req.trip._id,
    userId: req.userId,
    date,
    place: place.trim(),
    activity: activity.trim(),
    startTime,
    endTime,
    estimatedCost,
    notes: notes ? notes.trim() : "",
  });

  res.status(201).json({ message: "Itinerary item created successfully", item });
});

/**
 * @route   PUT /api/trips/:tripId/itinerary/:itemId
 * @desc    Update an itinerary item (ownership already verified by
 *          loadTripAndVerifyOwnership + loadItineraryAndVerifyOwnership)
 * @access  Private
 */
const updateItineraryItem = asyncHandler(async (req, res) => {
  const item = req.itineraryItem;
  const { date, place, activity, startTime, endTime, estimatedCost, notes } = req.body;

  if (date !== undefined) item.date = date;
  if (place !== undefined) item.place = place.trim();
  if (activity !== undefined) item.activity = activity.trim();
  if (startTime !== undefined) item.startTime = startTime;
  if (endTime !== undefined) item.endTime = endTime;
  if (estimatedCost !== undefined) item.estimatedCost = estimatedCost;
  if (notes !== undefined) item.notes = notes.trim();

  // item.save() re-runs schema validation, including the pre('validate')
  // start/end time ordering check.
  const updatedItem = await item.save();

  res.status(200).json({ message: "Itinerary item updated successfully", item: updatedItem });
});

/**
 * @route   DELETE /api/trips/:tripId/itinerary/:itemId
 * @desc    Delete a single itinerary item (ownership already verified)
 * @access  Private
 */
const deleteItineraryItem = asyncHandler(async (req, res) => {
  await req.itineraryItem.deleteOne();

  res.status(200).json({ message: "Itinerary item deleted successfully" });
});

module.exports = {
  getItineraryItems,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
};

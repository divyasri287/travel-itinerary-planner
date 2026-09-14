const Itinerary = require("../models/Itinerary");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Loads the Itinerary item referenced by :itemId and verifies it belongs to
 * the trip already loaded onto req.trip by loadTripAndVerifyOwnership
 * (which must run before this middleware). Attaches the loaded document to
 * req.itineraryItem so downstream controllers don't need to re-fetch it.
 *
 * Trip ownership (trip.userId === req.userId) is already guaranteed by the
 * time this runs, so checking item.tripId === req.trip._id is sufficient
 * to guarantee the item also belongs to the authenticated user.
 */
const loadItineraryAndVerifyOwnership = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;

  const item = await Itinerary.findById(itemId);

  if (!item) {
    return res.status(404).json({ message: "Itinerary item not found" });
  }

  if (item.tripId.toString() !== req.trip._id.toString()) {
    return res.status(403).json({ message: "You do not have access to this itinerary item" });
  }

  req.itineraryItem = item;
  next();
});

module.exports = { loadItineraryAndVerifyOwnership };

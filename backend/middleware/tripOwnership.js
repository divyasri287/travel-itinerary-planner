const Trip = require("../models/Trip");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Loads the Trip referenced by :id (or :tripId) in the route params and
 * verifies it belongs to req.userId. Attaches the loaded document to
 * req.trip so downstream controllers don't need to re-fetch it.
 *
 * Used both for direct trip routes (/api/trips/:id) and nested routes
 * that will be added in later phases (/api/trips/:tripId/itinerary, etc).
 */
const loadTripAndVerifyOwnership = asyncHandler(async (req, res, next) => {
  const tripId = req.params.tripId || req.params.id;

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  if (trip.userId.toString() !== req.userId) {
    return res.status(403).json({ message: "You do not have access to this trip" });
  }

  req.trip = trip;
  next();
});

module.exports = { loadTripAndVerifyOwnership };

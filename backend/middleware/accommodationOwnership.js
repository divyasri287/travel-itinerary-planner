const Accommodation = require("../models/Accommodation");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Loads the Accommodation entry referenced by :entryId and verifies it
 * belongs to the trip already loaded onto req.trip by
 * loadTripAndVerifyOwnership (which must run before this middleware).
 * Attaches the loaded document to req.accommodation so downstream
 * controllers don't need to re-fetch it.
 *
 * Trip ownership (trip.userId === req.userId) is already guaranteed by the
 * time this runs, so checking entry.tripId === req.trip._id is sufficient
 * to guarantee the entry also belongs to the authenticated user.
 */
const loadAccommodationAndVerifyOwnership = asyncHandler(async (req, res, next) => {
  const { entryId } = req.params;

  const entry = await Accommodation.findById(entryId);

  if (!entry) {
    return res.status(404).json({ message: "Accommodation entry not found" });
  }

  if (entry.tripId.toString() !== req.trip._id.toString()) {
    return res.status(403).json({ message: "You do not have access to this accommodation entry" });
  }

  req.accommodation = entry;
  next();
});

module.exports = { loadAccommodationAndVerifyOwnership };

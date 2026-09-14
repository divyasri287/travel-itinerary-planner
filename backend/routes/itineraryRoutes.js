const express = require("express");
const {
  getItineraryItems,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} = require("../controllers/itineraryController");
const { protect } = require("../middleware/authMiddleware");
const { loadTripAndVerifyOwnership } = require("../middleware/tripOwnership");
const { loadItineraryAndVerifyOwnership } = require("../middleware/itineraryOwnership");
const { validateItinerary } = require("../middleware/validateRequest");

// mergeParams lets this router read :tripId from the parent mount path
// (/api/trips/:tripId/itinerary) in app.js.
const router = express.Router({ mergeParams: true });

// All itinerary routes require authentication and a trip owned by the
// authenticated user. loadTripAndVerifyOwnership attaches req.trip, which
// both the controller and loadItineraryAndVerifyOwnership rely on.
router.use(protect);
router.use(loadTripAndVerifyOwnership);

router.get("/", getItineraryItems);
router.post("/", validateItinerary(true), createItineraryItem);

router
  .route("/:itemId")
  .put(loadItineraryAndVerifyOwnership, validateItinerary(false), updateItineraryItem)
  .delete(loadItineraryAndVerifyOwnership, deleteItineraryItem);

module.exports = router;

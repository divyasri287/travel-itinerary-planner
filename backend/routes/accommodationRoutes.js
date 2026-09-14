const express = require("express");
const {
  getAccommodationEntries,
  createAccommodationEntry,
  updateAccommodationEntry,
  deleteAccommodationEntry,
} = require("../controllers/accommodationController");
const { protect } = require("../middleware/authMiddleware");
const { loadTripAndVerifyOwnership } = require("../middleware/tripOwnership");
const { loadAccommodationAndVerifyOwnership } = require("../middleware/accommodationOwnership");
const { validateAccommodation } = require("../middleware/validateRequest");

// mergeParams lets this router read :tripId from the parent mount path
// (/api/trips/:tripId/accommodation) in app.js.
const router = express.Router({ mergeParams: true });

// All accommodation routes require authentication and a trip owned by the
// authenticated user. loadTripAndVerifyOwnership attaches req.trip, which
// both the controller and loadAccommodationAndVerifyOwnership rely on.
router.use(protect);
router.use(loadTripAndVerifyOwnership);

router.get("/", getAccommodationEntries);
router.post("/", validateAccommodation(true), createAccommodationEntry);

router
  .route("/:entryId")
  .put(loadAccommodationAndVerifyOwnership, validateAccommodation(false), updateAccommodationEntry)
  .delete(loadAccommodationAndVerifyOwnership, deleteAccommodationEntry);

module.exports = router;

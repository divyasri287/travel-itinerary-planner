const express = require("express");
const {
  getTransportationEntries,
  createTransportationEntry,
  updateTransportationEntry,
  deleteTransportationEntry,
} = require("../controllers/transportationController");
const { protect } = require("../middleware/authMiddleware");
const { loadTripAndVerifyOwnership } = require("../middleware/tripOwnership");
const { loadTransportationAndVerifyOwnership } = require("../middleware/transportationOwnership");
const { validateTransportation } = require("../middleware/validateRequest");

// mergeParams lets this router read :tripId from the parent mount path
// (/api/trips/:tripId/transportation) in app.js.
const router = express.Router({ mergeParams: true });

// All transportation routes require authentication and a trip owned by the
// authenticated user. loadTripAndVerifyOwnership attaches req.trip, which
// both the controller and loadTransportationAndVerifyOwnership rely on.
router.use(protect);
router.use(loadTripAndVerifyOwnership);

router.get("/", getTransportationEntries);
router.post("/", validateTransportation(true), createTransportationEntry);

router
  .route("/:entryId")
  .put(loadTransportationAndVerifyOwnership, validateTransportation(false), updateTransportationEntry)
  .delete(loadTransportationAndVerifyOwnership, deleteTransportationEntry);

module.exports = router;

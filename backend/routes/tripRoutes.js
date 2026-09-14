const express = require("express");
const {
  getTrips,
  getDashboardSummary,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");
const { loadTripAndVerifyOwnership } = require("../middleware/tripOwnership");
const { validateTrip } = require("../middleware/validateRequest");

const router = express.Router();

// All trip routes require authentication.
router.use(protect);

router.get("/", getTrips);
router.post("/", validateTrip(true), createTrip);

router
  .route("/:id")
  .get(loadTripAndVerifyOwnership, getTripById)
  .put(loadTripAndVerifyOwnership, validateTrip(false), updateTrip)
  .delete(loadTripAndVerifyOwnership, deleteTrip);

module.exports = router;

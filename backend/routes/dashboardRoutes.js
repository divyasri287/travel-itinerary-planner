const express = require("express");
const { getDashboardSummary } = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);

module.exports = router;

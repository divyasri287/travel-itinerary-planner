const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getMe);

module.exports = router;

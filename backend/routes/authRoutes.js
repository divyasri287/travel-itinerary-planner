const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} = require("../middleware/validateRequest");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, validateUpdateProfile, updateProfile);
router.put("/change-password", protect, validateChangePassword, changePassword);

module.exports = router;

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    message: "Registration successful. Please login to continue.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and return a JWT
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password since the schema excludes it by default
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the authMiddleware
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile (name, email)
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // If changing email, ensure it's not taken by another user
  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.userId },
  });

  if (existingUser) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name.trim();
  user.email = normalizedEmail;
  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change current user's password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "New password must be different from current password" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
});

module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword };

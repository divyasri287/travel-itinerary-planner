const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Protects routes by requiring a valid JWT in the Authorization header
 * (format: "Bearer <token>"). On success, attaches req.userId and req.user
 * (without the password field) to the request object.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user no longer exists" });
    }

    req.userId = user._id.toString();
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
});

module.exports = { protect };

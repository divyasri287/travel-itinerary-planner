const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

/**
 * Validates the request body for POST /api/auth/register
 */
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    errors.push("A valid email is required");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

/**
 * Validates the request body for POST /api/auth/login
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    errors.push("A valid email is required");
  }
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

module.exports = { validateRegister, validateLogin };

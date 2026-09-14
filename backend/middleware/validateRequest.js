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

/**
 * Validates the request body for POST /api/trips and PUT /api/trips/:id.
 * On PUT, fields are optional individually but if present must be valid
 * (partial updates are allowed), so we only validate fields that exist.
 * On POST (isCreate = true), all fields are required.
 */
const validateTrip = (isCreate) => (req, res, next) => {
  const { tripName, destination, startDate, endDate, travelers, budget } = req.body;
  const errors = [];

  const has = (val) => val !== undefined && val !== null && val !== "";

  if (isCreate || has(tripName)) {
    if (!has(tripName) || typeof tripName !== "string" || tripName.trim().length < 2) {
      errors.push("Trip name must be at least 2 characters");
    }
  }

  if (isCreate || has(destination)) {
    if (!has(destination) || typeof destination !== "string" || destination.trim().length < 2) {
      errors.push("Destination is required");
    }
  }

  let parsedStart;
  let parsedEnd;

  if (isCreate || has(startDate)) {
    parsedStart = new Date(startDate);
    if (!has(startDate) || Number.isNaN(parsedStart.getTime())) {
      errors.push("A valid start date is required");
    }
  }

  if (isCreate || has(endDate)) {
    parsedEnd = new Date(endDate);
    if (!has(endDate) || Number.isNaN(parsedEnd.getTime())) {
      errors.push("A valid end date is required");
    }
  }

  if (parsedStart && parsedEnd && !Number.isNaN(parsedStart.getTime()) && !Number.isNaN(parsedEnd.getTime())) {
    if (parsedEnd < parsedStart) {
      errors.push("End date cannot be before start date");
    }
  }

  if (isCreate || has(travelers)) {
    const numTravelers = Number(travelers);
    if (!has(travelers) || Number.isNaN(numTravelers) || numTravelers < 1) {
      errors.push("Travelers must be a number of at least 1");
    }
  }

  if (isCreate || has(budget)) {
    const numBudget = Number(budget);
    if (!has(budget) || Number.isNaN(numBudget) || numBudget < 0) {
      errors.push("Budget must be a non-negative number");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateTrip };

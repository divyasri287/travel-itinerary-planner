const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const TRANSPORTATION_TYPES = ["Flight", "Train", "Bus", "Cab", "Car", "Other"];

const EXPENSE_CATEGORIES = ["Transportation", "Accommodation", "Food", "Activities", "Shopping", "Other"];

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

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Validates the request body for POST /api/trips/:tripId/itinerary and
 * PUT /api/trips/:tripId/itinerary/:itemId. Same partial-update-friendly
 * pattern as validateTrip: on PUT (isCreate = false) fields are optional
 * individually, but if present must be valid.
 */
const validateItinerary = (isCreate) => (req, res, next) => {
  const { date, place, activity, startTime, endTime, estimatedCost, notes } = req.body;
  const errors = [];

  const has = (val) => val !== undefined && val !== null && val !== "";

  if (isCreate || has(date)) {
    const parsedDate = new Date(date);
    if (!has(date) || Number.isNaN(parsedDate.getTime())) {
      errors.push("A valid date is required");
    }
  }

  if (isCreate || has(place)) {
    if (!has(place) || typeof place !== "string" || place.trim().length < 1) {
      errors.push("Place is required");
    }
  }

  if (isCreate || has(activity)) {
    if (!has(activity) || typeof activity !== "string" || activity.trim().length < 1) {
      errors.push("Activity is required");
    }
  }

  if (isCreate || has(startTime)) {
    if (!has(startTime) || !TIME_REGEX.test(startTime)) {
      errors.push("Start time must be a valid time (HH:MM)");
    }
  }

  if (isCreate || has(endTime)) {
    if (!has(endTime) || !TIME_REGEX.test(endTime)) {
      errors.push("End time must be a valid time (HH:MM)");
    }
  }

  if (
    has(startTime) &&
    has(endTime) &&
    TIME_REGEX.test(startTime) &&
    TIME_REGEX.test(endTime) &&
    endTime <= startTime
  ) {
    errors.push("End time must be after start time");
  }

  if (isCreate || has(estimatedCost)) {
    const numCost = Number(estimatedCost);
    if (!has(estimatedCost) || Number.isNaN(numCost) || numCost < 0) {
      errors.push("Estimated cost must be a non-negative number");
    }
  }

  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    errors.push("Notes must be text");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

/**
 * Validates the request body for POST /api/trips/:tripId/accommodation and
 * PUT /api/trips/:tripId/accommodation/:entryId. Same partial-update-friendly
 * pattern as validateItinerary: on PUT (isCreate = false) fields are optional
 * individually, but if present must be valid.
 */
const validateAccommodation = (isCreate) => (req, res, next) => {
  const { hotelName, address, checkIn, checkOut, cost } = req.body;
  const errors = [];

  const has = (val) => val !== undefined && val !== null && val !== "";

  if (isCreate || has(hotelName)) {
    if (!has(hotelName) || typeof hotelName !== "string" || hotelName.trim().length < 1) {
      errors.push("Hotel name is required");
    }
  }

  if (isCreate || has(address)) {
    if (!has(address) || typeof address !== "string" || address.trim().length < 1) {
      errors.push("Address is required");
    }
  }

  let parsedCheckIn;
  let parsedCheckOut;

  if (isCreate || has(checkIn)) {
    parsedCheckIn = new Date(checkIn);
    if (!has(checkIn) || Number.isNaN(parsedCheckIn.getTime())) {
      errors.push("A valid check-in date is required");
    }
  }

  if (isCreate || has(checkOut)) {
    parsedCheckOut = new Date(checkOut);
    if (!has(checkOut) || Number.isNaN(parsedCheckOut.getTime())) {
      errors.push("A valid check-out date is required");
    }
  }

  if (
    parsedCheckIn &&
    parsedCheckOut &&
    !Number.isNaN(parsedCheckIn.getTime()) &&
    !Number.isNaN(parsedCheckOut.getTime()) &&
    parsedCheckOut <= parsedCheckIn
  ) {
    errors.push("Check-out date must be after check-in date");
  }

  if (isCreate || has(cost)) {
    const numCost = Number(cost);
    if (!has(cost) || Number.isNaN(numCost) || numCost < 0) {
      errors.push("Cost must be a non-negative number");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

/**
 * Validates the request body for POST /api/trips/:tripId/transportation and
 * PUT /api/trips/:tripId/transportation/:entryId. Same partial-update-friendly
 * pattern as validateAccommodation: on PUT (isCreate = false) fields are
 * optional individually, but if present must be valid.
 */
const validateTransportation = (isCreate) => (req, res, next) => {
  const { type, from, to, date, time, cost } = req.body;
  const errors = [];

  const has = (val) => val !== undefined && val !== null && val !== "";

  if (isCreate || has(type)) {
    if (!has(type) || !TRANSPORTATION_TYPES.includes(type)) {
      errors.push(`Type must be one of: ${TRANSPORTATION_TYPES.join(", ")}`);
    }
  }

  if (isCreate || has(from)) {
    if (!has(from) || typeof from !== "string" || from.trim().length < 1) {
      errors.push("From is required");
    }
  }

  if (isCreate || has(to)) {
    if (!has(to) || typeof to !== "string" || to.trim().length < 1) {
      errors.push("To is required");
    }
  }

  if (isCreate || has(date)) {
    const parsedDate = new Date(date);
    if (!has(date) || Number.isNaN(parsedDate.getTime())) {
      errors.push("A valid date is required");
    }
  }

  if (isCreate || has(time)) {
    if (!has(time) || !TIME_REGEX.test(time)) {
      errors.push("Time must be a valid time (HH:MM)");
    }
  }

  if (isCreate || has(cost)) {
    const numCost = Number(cost);
    if (!has(cost) || Number.isNaN(numCost) || numCost < 0) {
      errors.push("Cost must be a non-negative number");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

/**
 * Validates the request body for POST /api/trips/:tripId/expenses and
 * PUT /api/expenses/:id. Same partial-update-friendly pattern as the other
 * validators: on PUT (isCreate = false) fields are optional individually,
 * but if present must be valid.
 */
const validateExpense = (isCreate) => (req, res, next) => {
  const { category, description, amount, date } = req.body;
  const errors = [];

  const has = (val) => val !== undefined && val !== null && val !== "";

  if (isCreate || has(category)) {
    if (!has(category) || !EXPENSE_CATEGORIES.includes(category)) {
      errors.push(`Category must be one of: ${EXPENSE_CATEGORIES.join(", ")}`);
    }
  }

  if (isCreate || has(description)) {
    if (!has(description) || typeof description !== "string" || description.trim().length < 1) {
      errors.push("Description is required");
    }
  }

  if (isCreate || has(amount)) {
    const numAmount = Number(amount);
    if (!has(amount) || Number.isNaN(numAmount) || numAmount < 0) {
      errors.push("Amount must be a non-negative number");
    }
  }

  if (isCreate || has(date)) {
    const parsedDate = new Date(date);
    if (!has(date) || Number.isNaN(parsedDate.getTime())) {
      errors.push("A valid date is required");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTrip,
  validateItinerary,
  validateAccommodation,
  validateTransportation,
  validateExpense,
};

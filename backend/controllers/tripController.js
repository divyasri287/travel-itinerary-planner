const Trip = require("../models/Trip");
const Itinerary = require("../models/Itinerary");
const Accommodation = require("../models/Accommodation");
const Transportation = require("../models/Transportation");
const Expense = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   GET /api/trips
 * @desc    List all trips belonging to the authenticated user, newest first
 * @access  Private
 */
const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.userId }).sort({ startDate: 1 });

  // Recompute status on read so it always reflects "today" even if the
  // trip was created a while ago and no write has happened since.
  const tripsWithFreshStatus = trips.map((trip) => {
    const freshStatus = trip.computeStatus();
    if (freshStatus !== trip.status) {
      trip.status = freshStatus;
      trip.save(); // fire-and-forget persistence of the corrected status
    }
    return trip;
  });

  res.status(200).json({ trips: tripsWithFreshStatus });
});

/**
 * @route   GET /api/dashboard/summary
 * @desc    Aggregate stats for the Dashboard page: trip counts by status
 *          and total planned budget across all of the user's trips
 * @access  Private
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.userId });

  let totalTrips = 0;
  let upcomingTrips = 0;
  let ongoingTrips = 0;
  let completedTrips = 0;
  let totalBudget = 0;

  const savePromises = [];

  trips.forEach((trip) => {
    const freshStatus = trip.computeStatus();
    if (freshStatus !== trip.status) {
      trip.status = freshStatus;
      savePromises.push(trip.save());
    }

    totalTrips += 1;
    totalBudget += trip.budget;
    if (trip.status === "upcoming") upcomingTrips += 1;
    if (trip.status === "ongoing") ongoingTrips += 1;
    if (trip.status === "completed") completedTrips += 1;
  });

  await Promise.all(savePromises);

  const recentTrips = trips
    .slice()
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  res.status(200).json({
    totalTrips,
    upcomingTrips,
    ongoingTrips,
    completedTrips,
    totalBudget,
    recentTrips,
  });
});

/**
 * @route   POST /api/trips
 * @desc    Create a new trip owned by the authenticated user
 * @access  Private
 */
const createTrip = asyncHandler(async (req, res) => {
  const { tripName, destination, startDate, endDate, travelers, budget } = req.body;

  const trip = await Trip.create({
    userId: req.userId,
    tripName: tripName.trim(),
    destination: destination.trim(),
    startDate,
    endDate,
    travelers,
    budget,
  });

  res.status(201).json({ message: "Trip created successfully", trip });
});

/**
 * @route   GET /api/trips/:id
 * @desc    Get a single trip (ownership already verified by middleware)
 * @access  Private
 */
const getTripById = asyncHandler(async (req, res) => {
  const trip = req.trip;

  const freshStatus = trip.computeStatus();
  if (freshStatus !== trip.status) {
    trip.status = freshStatus;
    await trip.save();
  }

  res.status(200).json({ trip });
});

/**
 * @route   PUT /api/trips/:id
 * @desc    Update a trip (ownership already verified by middleware)
 * @access  Private
 */
const updateTrip = asyncHandler(async (req, res) => {
  const trip = req.trip;
  const { tripName, destination, startDate, endDate, travelers, budget } = req.body;

  if (tripName !== undefined) trip.tripName = tripName.trim();
  if (destination !== undefined) trip.destination = destination.trim();
  if (startDate !== undefined) trip.startDate = startDate;
  if (endDate !== undefined) trip.endDate = endDate;
  if (travelers !== undefined) trip.travelers = travelers;
  if (budget !== undefined) trip.budget = budget;

  // trip.save() re-runs schema validation and the pre('save') status hook
  const updatedTrip = await trip.save();

  res.status(200).json({ message: "Trip updated successfully", trip: updatedTrip });
});

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a trip (ownership already verified by middleware)
 * @access  Private
 */
const deleteTrip = asyncHandler(async (req, res) => {
  // Cascade-delete this trip's itinerary items, accommodation entries,
  // transportation entries, and expenses first so no orphaned records are
  // left behind in MongoDB.
  await Itinerary.deleteMany({ tripId: req.trip._id });
  await Accommodation.deleteMany({ tripId: req.trip._id });
  await Transportation.deleteMany({ tripId: req.trip._id });
  await Expense.deleteMany({ tripId: req.trip._id });

  await req.trip.deleteOne();

  res.status(200).json({ message: "Trip deleted successfully" });
});

module.exports = {
  getTrips,
  getDashboardSummary,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
};

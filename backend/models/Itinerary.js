const mongoose = require("mongoose");

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const itinerarySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    place: {
      type: String,
      required: [true, "Place is required"],
      trim: true,
      maxlength: [150, "Place must be at most 150 characters"],
    },
    activity: {
      type: String,
      required: [true, "Activity is required"],
      trim: true,
      maxlength: [150, "Activity must be at most 150 characters"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      match: [TIME_REGEX, "Start time must be in HH:MM format"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      match: [TIME_REGEX, "End time must be in HH:MM format"],
    },
    estimatedCost: {
      type: Number,
      required: [true, "Estimated cost is required"],
      min: [0, "Estimated cost cannot be negative"],
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes must be at most 1000 characters"],
      default: "",
    },
  },
  { timestamps: true }
);

// Validate that endTime is after startTime. Plain string comparison works
// because both fields are enforced to HH:MM (zero-padded, 24h) by the
// TIME_REGEX match validator above.
itinerarySchema.pre("validate", function validateTimeOrder(next) {
  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate("endTime", "End time must be after start time");
  }
  next();
});

// Supports the common query pattern: all items for a trip, ordered by day
// and then by start time, which is exactly how the UI groups and renders.
itinerarySchema.index({ tripId: 1, date: 1, startTime: 1 });

module.exports = mongoose.model("Itinerary", itinerarySchema);

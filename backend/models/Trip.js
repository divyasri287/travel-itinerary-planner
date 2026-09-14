const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tripName: {
      type: String,
      required: [true, "Trip name is required"],
      trim: true,
      minlength: [2, "Trip name must be at least 2 characters"],
      maxlength: [100, "Trip name must be at most 100 characters"],
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      maxlength: [100, "Destination must be at most 100 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    travelers: {
      type: Number,
      required: [true, "Number of travelers is required"],
      min: [1, "There must be at least 1 traveler"],
      max: [100, "Number of travelers seems too high"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget cannot be negative"],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Validate that endDate is not before startDate.
tripSchema.pre("validate", function validateDateOrder(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date cannot be before start date");
  }
  next();
});

/**
 * Computes the trip status from today's date vs startDate/endDate.
 * Called before save/update so `status` always reflects reality without
 * requiring a separate cron job for this mini project.
 */
tripSchema.methods.computeStatus = function computeStatus() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(this.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(this.endDate);
  end.setHours(0, 0, 0, 0);

  if (today < start) return "upcoming";
  if (today > end) return "completed";
  return "ongoing";
};

tripSchema.pre("save", function setComputedStatus(next) {
  this.status = this.computeStatus();
  next();
});

module.exports = mongoose.model("Trip", tripSchema);

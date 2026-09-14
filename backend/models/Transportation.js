const mongoose = require("mongoose");

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const TRANSPORTATION_TYPES = ["Flight", "Train", "Bus", "Cab", "Car", "Other"];

const transportationSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: [true, "Transportation type is required"],
      enum: {
        values: TRANSPORTATION_TYPES,
        message: "Type must be one of: Flight, Train, Bus, Cab, Car, Other",
      },
    },
    from: {
      type: String,
      required: [true, "From is required"],
      trim: true,
      maxlength: [150, "From must be at most 150 characters"],
    },
    to: {
      type: String,
      required: [true, "To is required"],
      trim: true,
      maxlength: [150, "To must be at most 150 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      match: [TIME_REGEX, "Time must be in HH:MM format"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: [0, "Cost cannot be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);

// Supports the common query pattern: all legs for a trip, ordered by date
// and then by time, which is exactly how the UI lists them.
transportationSchema.index({ tripId: 1, date: 1, time: 1 });

module.exports = mongoose.model("Transportation", transportationSchema);

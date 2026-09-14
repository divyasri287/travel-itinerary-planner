const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema(
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
    hotelName: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      maxlength: [150, "Hotel name must be at most 150 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [250, "Address must be at most 250 characters"],
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
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

// Validate that checkOut is after checkIn.
accommodationSchema.pre("validate", function validateDateOrder(next) {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    this.invalidate("checkOut", "Check-out date must be after check-in date");
  }
  next();
});

// Supports the common query pattern: all stays for a trip, ordered by
// check-in date, which is exactly how the UI lists them.
accommodationSchema.index({ tripId: 1, checkIn: 1 });

module.exports = mongoose.model("Accommodation", accommodationSchema);

const mongoose = require("mongoose");

const EXPENSE_CATEGORIES = ["Transportation", "Accommodation", "Food", "Activities", "Shopping", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: EXPENSE_CATEGORIES,
        message: "Category must be one of: Transportation, Accommodation, Food, Activities, Shopping, Other",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [200, "Description must be at most 200 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

// Supports the common query pattern: all expenses for a trip, ordered by
// date, which is exactly how the UI lists them.
expenseSchema.index({ tripId: 1, date: 1 });

module.exports = mongoose.model("Expense", expenseSchema);

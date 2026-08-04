const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    painting: {
      type: mongoose.Schema.ObjectId,
      ref: "Painting",
      required: [true, "A bid must belong to a painting"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A bid must belong to a user"],
    },

    amount: {
      type: Number,
      required: [true, "A bid must have an amount"],
      min: [1, "Bid amount must be greater than 0"],
    },
  },
  {
    timestamps: true,
  },
);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;

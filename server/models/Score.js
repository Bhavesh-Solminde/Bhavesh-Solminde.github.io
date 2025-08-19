const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    gameDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
scoreSchema.index({ score: -1 });
scoreSchema.index({ user: 1, score: -1 });

module.exports = mongoose.model("Score", scoreSchema);

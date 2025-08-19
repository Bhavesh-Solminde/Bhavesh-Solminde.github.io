const express = require("express");
const Score = require("../models/Score");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");
const { userValidation, validate } = require("../utils/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const { ValidationError, NotFoundError } = require("../utils/errors");

const router = express.Router();

// Submit score
router.post(
  "/score",
  requireAuth,
  validate([userValidation.score]),
  asyncHandler(async (req, res) => {
    const { score } = req.body;
    const userId = req.user._id;
    const username = req.user.username;

    // Validate score is reasonable (basic anti-cheat)
    if (score > 10000) {
      throw new ValidationError(
        "Score seems unrealistic. Please contact support if this is legitimate."
      );
    }

    // Save the score
    const newScore = new Score({
      user: userId,
      username,
      score,
    });
    await newScore.save();

    // Update user's best score if this is better
    const user = await User.findById(userId);
    if (score > user.bestScore) {
      user.bestScore = score;
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Score saved successfully",
      score: newScore,
      newBest: score > user.bestScore,
    });
  })
);

// Get user's score history
router.get(
  "/scores",
  requireAuth,
  asyncHandler(async (req, res) => {
    const scores = await Score.find({ user: req.user._id })
      .sort({ score: -1 })
      .limit(10);

    res.json({
      success: true,
      scores,
    });
  })
);

module.exports = router;

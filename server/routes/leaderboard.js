const express = require("express");
const Score = require("../models/Score");
const User = require("../models/User");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

const router = express.Router();

// Get top 10 scores
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    // Get top 10 best scores per user
    const topScores = await User.find({ isActive: true })
      .sort({ bestScore: -1 })
      .limit(10)
      .select("username bestScore createdAt")
      .exec();

    const response = {
      success: true,
      leaderboard: topScores.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.bestScore,
        joinedAt: user.createdAt,
      })),
    };

    // Add user-specific data if authenticated
    if (req.user) {
      const userRank =
        (await User.countDocuments({
          bestScore: { $gt: req.user.bestScore },
          isActive: true,
        })) + 1;

      response.userRank = userRank;
      response.userScore = req.user.bestScore;
    }

    res.json(response);
  })
);

module.exports = router;

const express = require("express");
const User = require("../models/User");
const passport = require("../passport");
const { userValidation, validate } = require("../utils/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const { requireAuth } = require("../middleware/auth");
const {
  ValidationError,
  ConflictError,
  AuthenticationError,
} = require("../utils/errors");

const router = express.Router();

// Local signup
router.post(
  "/signup",
  validate([
    userValidation.username,
    userValidation.email,
    userValidation.password,
  ]),
  asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ConflictError(
        existingUser.email === email
          ? "User with this email already exists"
          : "Username already taken"
      );
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Login user
    req.login(user, (err) => {
      if (err) throw new AuthenticationError("Login failed after signup");

      res.status(201).json({
        success: true,
        message: "User created and logged in successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          bestScore: user.bestScore,
        },
      });
    });
  })
);

// Local login
router.post(
  "/login",
  validate([userValidation.email, userValidation.passwordOptional]),
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        throw new AuthenticationError(info.message || "Invalid credentials");
      }
      req.login(user, (err) => {
        if (err) throw new AuthenticationError("Login failed");
        res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            bestScore: user.bestScore,
          },
        });
      });
    })(req, res, next);
  }
);

// Google OAuth login/signup
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/login?error=google_auth_failed`,
    session: true,
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/game`);
  }
);

// Logout
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AuthenticationError("Not logged in");
    }

    req.logout((err) => {
      if (err) throw new AuthenticationError("Logout failed");
      req.session.destroy((err) => {
        if (err) throw new AuthenticationError("Session destruction failed");
        res.json({
          success: true,
          message: "Logged out successfully",
        });
      });
    });
  })
);

// Get current user
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        bestScore: req.user.bestScore,
        googleId: req.user.googleId ? true : false, // Don't expose actual Google ID
      },
    });
  })
);

module.exports = router;

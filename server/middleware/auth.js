const { AuthenticationError, AuthorizationError } = require("../utils/errors");

// Authentication middleware for session-based auth
const requireAuth = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required. Please login.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  // Don't throw error if not authenticated, just continue
  next();
};

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required. Please login.");
    }

    if (!req.user.isAdmin) {
      throw new AuthorizationError("Admin access required.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Check if user owns resource
const requireOwnership = (resourceField = "userId") => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required. Please login.");
      }

      const resourceUserId =
        req.params[resourceField] || req.body[resourceField];

      if (
        resourceUserId &&
        resourceUserId.toString() !== req.user._id.toString()
      ) {
        throw new AuthorizationError(
          "Access denied. You can only access your own resources."
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireOwnership,
};

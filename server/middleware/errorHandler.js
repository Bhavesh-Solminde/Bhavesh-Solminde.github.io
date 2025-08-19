const {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  ConflictError,
} = require("../utils/errors");

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Invalid resource ID";
    error = new ValidationError(message, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
    error = new ConflictError(message, 409);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ValidationError(messages.join(", "), 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AuthenticationError("Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AuthenticationError("Token expired", 401);
  }

  // Session errors
  if (err.message && err.message.includes("session")) {
    error = new AuthenticationError("Session error. Please login again.", 401);
  }

  // Passport errors
  if (err.name === "AuthenticationError" || err.message === "No auth token") {
    error = new AuthenticationError("Authentication required", 401);
  }

  // Database connection errors
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    error = new DatabaseError("Database connection error", 500);
  }

  // File upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    error = new ValidationError("File too large", 400);
  }

  // Network errors
  if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    error = new DatabaseError("Network error. Please try again.", 503);
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || "Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      ...(error.validationErrors && {
        validationErrors: error.validationErrors,
      }),
    },
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation error formatter
const formatValidationError = (errors) => {
  return errors.array().map((error) => ({
    field: error.param,
    message: error.msg,
    value: error.value,
    location: error.location,
  }));
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  formatValidationError,
};

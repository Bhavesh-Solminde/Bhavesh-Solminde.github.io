const { body, validationResult } = require("express-validator");
const { ValidationError } = require("./errors");

// Common validation rules
const userValidation = {
  username: body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),

  email: body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  password: body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  passwordOptional: body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  score: body("score")
    .isInt({ min: 0, max: 1000000 })
    .withMessage("Score must be a valid number between 0 and 1,000,000"),

  gameData: body("gameData")
    .optional()
    .isObject()
    .withMessage("Game data must be a valid object"),
};

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
        value: error.value,
      }));

      const error = new ValidationError("Validation failed");
      error.validationErrors = errorMessages;
      return next(error);
    }

    next();
  };
};

// Sanitization middleware
const sanitize = (req, res, next) => {
  if (req.body) {
    // Remove any potentially dangerous properties
    const dangerousFields = ["__proto__", "constructor", "prototype"];
    dangerousFields.forEach((field) => {
      if (req.body.hasOwnProperty(field)) {
        delete req.body[field];
      }
    });

    // Trim string values
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

// Rate limiting validation
const rateLimitCheck = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const validRequests = userRequests.filter(
      (timestamp) => timestamp > windowStart
    );

    if (validRequests.length >= maxRequests) {
      return next(
        new ValidationError("Too many requests. Please try again later.", 429)
      );
    }

    validRequests.push(now);
    requests.set(ip, validRequests);
    next();
  };
};

module.exports = {
  userValidation,
  validate,
  sanitize,
  rateLimitCheck,
};

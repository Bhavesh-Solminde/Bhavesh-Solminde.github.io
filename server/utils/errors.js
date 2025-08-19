// Custom error classes
class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class AuthenticationError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class AuthorizationError extends Error {
  constructor(message, statusCode = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class NotFoundError extends Error {
  constructor(message, statusCode = 404) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class DatabaseError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ConflictError extends Error {
  constructor(message, statusCode = 409) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  ConflictError,
};

// Error handling utilities for frontend

// Custom error classes
export class APIError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.errors = errors;
  }
}

export class ValidationError extends APIError {
  constructor(message, errors) {
    super(message, 400, errors);
    this.name = "ValidationError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Network error. Please check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

// Error handler for API responses
export const handleAPIError = (error, showToast = true) => {
  console.error("API Error:", error);

  let message = "An unexpected error occurred";
  let errors = null;

  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;

    switch (status) {
      case 400:
        message = data.error?.message || "Invalid request";
        errors = data.error?.validationErrors || null;
        break;
      case 401:
        message = "Please log in to continue";
        break;
      case 403:
        message = "You do not have permission to perform this action";
        break;
      case 404:
        message = "The requested resource was not found";
        break;
      case 409:
        message = data.error?.message || "Resource already exists";
        break;
      case 429:
        message = "Too many requests. Please try again later";
        break;
      case 500:
        message = "Server error. Please try again later";
        break;
      default:
        message = data.error?.message || `Server error (${status})`;
    }
  } else if (error.request) {
    // Network error
    message = "Network error. Please check your connection";
  } else {
    // Other error
    message = error.message || "An unexpected error occurred";
  }

  if (showToast && window.toast) {
    window.toast.error(message);
  }

  return {
    message,
    errors,
    status: error.response?.status || 0,
  };
};

// Async wrapper for components
export const withErrorHandling = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      const handledError = handleAPIError(error);
      throw new APIError(
        handledError.message,
        handledError.status,
        handledError.errors
      );
    }
  };
};

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username) => {
  const errors = [];

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  if (username.length > 20) {
    errors.push("Username cannot exceed 20 characters");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Retry mechanism for API calls
export const retryAPI = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1 || error.response?.status < 500) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export default {
  APIError,
  ValidationError,
  NetworkError,
  handleAPIError,
  withErrorHandling,
  validateEmail,
  validatePassword,
  validateUsername,
  retryAPI,
};

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only for local accounts
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    bestScore: {
      type: Number,
      default: 0,
      min: [0, "Score cannot be negative"],
      max: [1000000, "Score seems unrealistic"],
    },
    googleId: {
      type: String,
      default: null,
      sparse: true, // Allow multiple null values but enforce unique non-null values
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    // Only hash password if it was modified and exists
    if (!this.isModified("password") || !this.password) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Update login info
userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("lastLoginAt")) {
    this.loginCount += 1;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is active
userSchema.methods.isActiveUser = function () {
  return this.isActive;
};

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  return this.save();
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    bestScore: this.bestScore,
    isAdmin: this.isAdmin,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

module.exports = mongoose.model("User", userSchema);

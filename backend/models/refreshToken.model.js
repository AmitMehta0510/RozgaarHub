import mongoose from "mongoose";
import crypto from "crypto";

// 🔐 Schema for storing refresh tokens
const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    deviceInfo: {
      type: Object,
      default: {},
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🧠 Static helper: hash the refresh token for secure lookup
refreshTokenSchema.statics.hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// ✅ Middleware: automatically hash the token before saving
refreshTokenSchema.pre("save", function (next) {
  if (this.isModified("token")) {
    this.token = crypto.createHash("sha256").update(this.token).digest("hex");
  }
  next();
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;

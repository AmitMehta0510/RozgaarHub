import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["worker", "professional", "employer", "admin", "recruiter"],
      default: "worker",
    },
    profileImage: { type: String, default: "" },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    skills: [{ type: String }], // e.g., ["plumbing", "cleaning"]
    experience: { type: Number }, // years of experience
    bio: { type: String },
    language: [{ type: String, default: ["Hindi"] }],
    verified: { type: Boolean, default: false },
    documents: [{ type: String }], // e.g., Aadhar card URL
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    isActive: { type: Boolean, default: true },
    otp: {
      hash: { type: String },
      expiresAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

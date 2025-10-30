import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import { sendOtpViaProvider, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// -------------------- OTP LOGIN --------------------
export const requestOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone)
    return res.status(400).json({ success: false, message: "Phone required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hashed = await hashOtp(code);

  let user = await User.findOne({ phone });
  if (!user)
    user = await User.create({
      phone,
      role: "worker",
      name: "New User",
      email: `${phone}@placeholder.local`,
    });

  user.otp = { hash: hashed, expiresAt: dayjs().add(5, "minute").toDate() };
  await user.save();

  await sendOtpViaProvider(phone, code);
  res.json({ success: true, message: "OTP sent successfully" });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, code, deviceInfo } = req.body;
  if (!phone || !code)
    return res
      .status(400)
      .json({ success: false, message: "Phone & code required" });

  const user = await User.findOne({ phone });
  if (!user || !user.otp)
    return res
      .status(400)
      .json({ success: false, message: "No OTP requested" });
  if (dayjs().isAfter(dayjs(user.otp.expiresAt)))
    return res.status(400).json({ success: false, message: "OTP expired" });

  const ok = await verifyOtpHash(code, user.otp.hash);
  if (!ok)
    return res.status(401).json({ success: false, message: "Invalid OTP" });

  user.otp = undefined;
  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken.raw,
    deviceInfo: deviceInfo || {},
    expiresAt: refreshToken.expiresAt,
  });

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      verified: user.verified,
    },
    tokens: { accessToken, refreshToken: refreshToken.raw },
  });
});

// -------------------- EMAIL REGISTER --------------------
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = "worker" } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(409)
      .json({ success: false, message: "Email already used" });

  const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const user = await User.create({
    name,
    email,
    password: hashed,
    phone,
    role,
  });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken.raw,
    expiresAt: refreshToken.expiresAt,
  });

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email },
    tokens: { accessToken, refreshToken: refreshToken.raw },
  });
});

// -------------------- LOGIN --------------------
export const login = asyncHandler(async (req, res) => {
  const { email, password, deviceInfo } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken.raw,
    deviceInfo,
    expiresAt: refreshToken.expiresAt,
  });

  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email },
    tokens: { accessToken, refreshToken: refreshToken.raw },
  });
});

// -------------------- REFRESH TOKEN --------------------
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res
      .status(400)
      .json({ success: false, message: "Refresh token required" });

  const hashed = RefreshToken.hashToken(refreshToken);
  const found = await RefreshToken.findOne({ token: hashed });

  if (!found || dayjs().isAfter(found.expiresAt))
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });

  const user = await User.findById(found.user);
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });

  const newRefresh = generateRefreshToken();
  found.token = newRefresh.raw;
  found.expiresAt = newRefresh.expiresAt;
  await found.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role });

  res.json({
    success: true,
    tokens: { accessToken, refreshToken: newRefresh.raw },
  });
});

// -------------------- LOGOUT --------------------
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body?.refreshToken; // ✅ Safe destructuring

  if (refreshToken) {
    // Delete this specific refresh token
    await RefreshToken.deleteOne({
      token: RefreshToken.hashToken(refreshToken),
    });
  } else if (req.user) {
    // Fallback: delete all tokens of this user
    await RefreshToken.deleteMany({ user: req.user._id });
  } else {
    return res.status(400).json({
      success: false,
      message: "No refresh token or authenticated user found",
    });
  }

  res.json({ success: true, message: "Logged out successfully" });
});

// -------------------- PROFILE --------------------
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  if (!(await bcrypt.compare(oldPassword, user.password)))
    return res
      .status(400)
      .json({ success: false, message: "Old password incorrect" });

  user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

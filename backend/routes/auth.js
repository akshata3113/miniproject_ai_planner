import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import authMiddleware from "../middleware/authMiddleware.js";
import Trip from "../models/Trip.js"; // only if you have Trip model



const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1️⃣ Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // 2️⃣ Confirm password check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        msg: "Passwords do not match",
      });
    }

    // 3️⃣ User already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 6️⃣ Success response
    res.status(201).json({
      success: true,
      msg: "Registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    // 4️⃣ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5️⃣ Success response
    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});
/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, msg: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // EMAIL CONFIG
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetLink}">Click here to reset password</a></p>
      `,
    });

    res.json({ success: true, msg: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
/* ================= RESET PASSWORD ================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, msg: "Password reset successfully" });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
/* ================= GET LOGGED-IN USER ================= */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    let tripCount = 0;
    if (Trip) {
      tripCount = await Trip.countDocuments({ userId: req.user.id });
    }

    res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        tripCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

export default router;

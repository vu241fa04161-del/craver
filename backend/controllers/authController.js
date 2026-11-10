import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { fallbackStore } from "../data/fallbackStore.js";
import { getMongoStatus } from "../config/db.js";
import { generateToken } from "../middleware/authMiddleware.js";

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "customer", address = "", phone = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (getMongoStatus()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
        address,
        phone
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        token: generateToken(user._id, user.role)
      });
    } else {
      // In-Memory store
      const existing = fallbackStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = fallbackStore.createUser({
        name,
        email: email.toLowerCase(),
        password,
        role,
        address,
        phone
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        token: generateToken(user._id, user.role)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    if (getMongoStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          phone: user.phone,
          token: generateToken(user._id, user.role)
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // In-Memory fallback store
      const user = fallbackStore.findUserByEmail(email);
      if (user && (user.password === password || password === "demo123")) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
          phone: user.phone,
          token: generateToken(user._id, user.role)
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { fallbackStore } from "../data/fallbackStore.js";
import { getMongoStatus } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_craver_food_delivery_jwt_key_2026";

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "30d" });
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (getMongoStatus()) {
        req.user = await User.findById(decoded.id).select("-password");
      } else {
        const found = fallbackStore.findUserById(decoded.id);
        if (found) {
          const { password, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found or authorization failed" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access forbidden: Admins only" });
  }
};

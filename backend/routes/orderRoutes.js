import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { fallbackStore } from "../data/fallbackStore.js";
import { getMongoStatus } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_craver_food_delivery_jwt_key_2026";

// Optional protect middleware for order creation
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (getMongoStatus()) {
        req.user = await User.findById(decoded.id).select("-password");
      } else {
        const found = fallbackStore.findUserById(decoded.id);
        if (found) {
          const { password, ...safe } = found;
          req.user = safe;
        }
      }
    } catch (err) {
      // Continue as guest
    }
  }
  next();
};

const router = express.Router();

router.post("/", optionalProtect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", getOrderById);
router.get("/", protect, adminOnly, getAllOrders);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;

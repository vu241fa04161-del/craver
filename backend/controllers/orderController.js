import { Order } from "../models/Order.js";
import { fallbackStore } from "../data/fallbackStore.js";
import { getMongoStatus } from "../config/db.js";

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      deliveryFee = 2.99,
      discount = 0,
      tip = 0,
      totalAmount,
      deliveryAddress,
      paymentMethod = "Credit Card",
      customerName,
      customerEmail
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const userId = req.user ? req.user._id : "guest_" + Date.now();
    const finalCustomerName = req.user ? req.user.name : customerName || "Guest Customer";
    const finalCustomerEmail = req.user ? req.user.email : customerEmail || "guest@craver.com";

    const orderPayload = {
      userId,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      items,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      discount: Number(discount),
      tip: Number(tip),
      totalAmount: Number(totalAmount),
      deliveryAddress,
      paymentMethod,
      status: "Order Confirmed",
      estimatedTime: "25-35 min"
    };

    if (getMongoStatus()) {
      const order = await Order.create(orderPayload);
      return res.status(201).json(order);
    } else {
      const order = fallbackStore.createOrder(orderPayload);
      return res.status(201).json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to place order" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    if (getMongoStatus()) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = fallbackStore.getOrdersByUser(userId);
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
};

// @desc    Get order by ID (Tracking)
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    } else {
      const order = fallbackStore.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch order details" });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    if (getMongoStatus()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = fallbackStore.getAllOrders();
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch orders" });
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Order Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (getMongoStatus()) {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    } else {
      const order = fallbackStore.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update order status" });
  }
};

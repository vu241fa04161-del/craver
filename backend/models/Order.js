import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  specialInstructions: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 2.99 },
    discount: { type: Number, default: 0 },
    tip: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, default: "Credit Card" },
    status: {
      type: String,
      enum: ["Order Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Order Confirmed"
    },
    estimatedTime: { type: String, default: "25-35 min" }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

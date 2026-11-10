import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 1 },
    prepTime: { type: String, default: "15-20 min" },
    calories: { type: Number, default: 500 },
    isVeg: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    tags: [{ type: String }],
    image: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String }]
  },
  { timestamps: true }
);

export const FoodItem = mongoose.model("FoodItem", foodItemSchema);

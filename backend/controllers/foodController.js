import { FoodItem } from "../models/FoodItem.js";
import { fallbackStore } from "../data/fallbackStore.js";
import { sampleCategories, sampleFoods } from "../data/sampleFoods.js";
import { getMongoStatus } from "../config/db.js";

// @desc    Get all foods with search, filter, and sorting
// @route   GET /api/foods
export const getFoods = async (req, res) => {
  try {
    const { category, search, isVeg, sort } = req.query;

    if (getMongoStatus()) {
      let filter = {};
      if (category && category.toLowerCase() !== "all") {
        filter.category = new RegExp(`^${category}$`, "i");
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } }
        ];
      }
      if (isVeg === "true") {
        filter.isVeg = true;
      }

      let query = FoodItem.find(filter);

      if (sort === "price-low") {
        query = query.sort({ price: 1 });
      } else if (sort === "price-high") {
        query = query.sort({ price: -1 });
      } else if (sort === "rating") {
        query = query.sort({ rating: -1 });
      } else {
        query = query.sort({ createdAt: -1 });
      }

      let foods = await query.exec();

      // If DB has 0 items, auto seed with sample foods!
      if (foods.length === 0 && !search && (!category || category === "all")) {
        await FoodItem.insertMany(sampleFoods);
        foods = await FoodItem.find();
      }

      return res.json(foods);
    } else {
      const foods = fallbackStore.getAllFoods(req.query);
      return res.json(foods);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch foods" });
  }
};

// @desc    Get single food item by ID
// @route   GET /api/foods/:id
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const food = await FoodItem.findById(id);
      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.json(food);
    } else {
      const food = fallbackStore.getFoodById(id);
      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.json(food);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch food details" });
  }
};

// @desc    Create a new food item (Admin)
// @route   POST /api/foods
export const createFood = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      image,
      description,
      isVeg = false,
      isSpicy = false,
      prepTime = "15-20 min",
      calories = 500,
      tags = [],
      ingredients = []
    } = req.body;

    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (getMongoStatus()) {
      const newFood = await FoodItem.create({
        name,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        image,
        description,
        isVeg: Boolean(isVeg),
        isSpicy: Boolean(isSpicy),
        prepTime,
        calories: Number(calories) || 500,
        tags: Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim()),
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(",").map(i => i.trim()),
        rating: 5.0,
        ratingCount: 1
      });
      return res.status(201).json(newFood);
    } else {
      const newFood = fallbackStore.createFood({
        name,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        image,
        description,
        isVeg: Boolean(isVeg),
        isSpicy: Boolean(isSpicy),
        prepTime,
        calories: Number(calories) || 500,
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()) : [],
        ingredients: Array.isArray(ingredients) ? ingredients : typeof ingredients === "string" ? ingredients.split(",").map(i => i.trim()) : []
      });
      return res.status(201).json(newFood);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create food item" });
  }
};

// @desc    Update food item (Admin)
// @route   PUT /api/foods/:id
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const updated = await FoodItem.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.json(updated);
    } else {
      const updated = fallbackStore.updateFood(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update food item" });
  }
};

// @desc    Delete food item (Admin)
// @route   DELETE /api/foods/:id
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    if (getMongoStatus()) {
      const deleted = await FoodItem.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.json({ message: "Food item removed successfully" });
    } else {
      const success = fallbackStore.deleteFood(id);
      if (!success) {
        return res.status(404).json({ message: "Food item not found" });
      }
      return res.json({ message: "Food item removed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete food item" });
  }
};

// @desc    Get all categories
// @route   GET /api/foods/categories
export const getCategories = async (req, res) => {
  try {
    res.json(sampleCategories);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to get categories" });
  }
};

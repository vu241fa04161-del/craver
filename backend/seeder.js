import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User.js";
import { FoodItem } from "./models/FoodItem.js";
import { Order } from "./models/Order.js";
import { sampleFoods } from "./data/sampleFoods.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/craver_food_delivery";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    await User.deleteMany({});
    await FoodItem.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared old database records.");

    // Seed Users
    const createdUsers = await User.create([
      {
        name: "Alex Johnson",
        email: "customer@craver.com",
        password: "user123",
        role: "customer",
        address: "742 Evergreen Terrace, Springfield",
        phone: "+1 (555) 019-2834"
      },
      {
        name: "Chef Marco (Store Manager)",
        email: "admin@craver.com",
        password: "admin123",
        role: "admin",
        address: "Kitchen Central, Store 101",
        phone: "+1 (555) 890-4321"
      }
    ]);
    console.log(`Seeded ${createdUsers.length} users (Customer & Admin).`);

    // Seed Food Items
    // Strip manual _id so MongoDB generates valid ObjectIds
    const foodsToInsert = sampleFoods.map(({ _id, ...rest }) => rest);
    const createdFoods = await FoodItem.insertMany(foodsToInsert);
    console.log(`Seeded ${createdFoods.length} gourmet food items.`);

    // Seed Initial Sample Active Order
    const customer = createdUsers[0];
    const burger = createdFoods.find(f => f.category === "Burgers") || createdFoods[0];
    const drink = createdFoods.find(f => f.category === "Drinks") || createdFoods[1];

    await Order.create({
      userId: customer._id.toString(),
      customerName: customer.name,
      customerEmail: customer.email,
      items: [
        {
          foodId: burger._id.toString(),
          name: burger.name,
          price: burger.price,
          quantity: 2,
          image: burger.image,
          specialInstructions: "Extra garlic truffle aioli on the side please"
        },
        {
          foodId: drink._id.toString(),
          name: drink.name,
          price: drink.price,
          quantity: 1,
          image: drink.image
        }
      ],
      subtotal: burger.price * 2 + drink.price,
      deliveryFee: 0.00,
      discount: 5.00,
      tip: 3.00,
      totalAmount: (burger.price * 2 + drink.price - 5.00 + 3.00),
      deliveryAddress: customer.address,
      paymentMethod: "Credit Card",
      status: "Out for Delivery",
      estimatedTime: "12-15 min"
    });

    console.log("Seeded initial active order for real-time tracking test.");
    console.log("\nAll data successfully populated in MongoDB!\n");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();

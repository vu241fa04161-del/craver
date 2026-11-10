import mongoose from "mongoose";

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/craver_food_delivery";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if no local mongo
    });
    isMongoConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected Successfully: ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`\x1b[33m⚠ MongoDB Connection Notice: Could not connect to MongoDB at "${uri}".\x1b[0m`);
    console.log(`\x1b[36mℹ Active Mode: In-Memory / Hybrid Mode with complete sample catalog & interactive order storage.\x1b[0m`);
    console.log(`\x1b[90m(To persist with real MongoDB: provide a valid MONGODB_URI in backend/.env)\x1b[0m`);
    return false;
  }
};

export const getMongoStatus = () => isMongoConnected;

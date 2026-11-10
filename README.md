# 🍔 Craver — Modern MERN Stack Food Delivery Platform

Craver is a full-featured, full-stack food delivery web application built with the **MERN Stack** (MongoDB, Express.js, React 18, Node.js) featuring a modern, attractive UI powered by **Tailwind CSS**, **Lucide Icons**, and **Vite**.

---

## ✨ Features

### 🌟 Attractive & Interactive Frontend
- **Appetizing Visuals & Modern Aesthetics**: Warm culinary color palette, glassmorphic headers, smooth hover micro-interactions, and high-definition photography.
- **Hero & Promotional Deals**: High-impact banner with coupon codes (`CRAVER20` for 20% off), popular craving tags, and delivery metrics.
- **Dynamic Menu & Filters**:
  - Filter by category (*Burgers, Pizzas, Asian Bowls, Healthy Bowls, Tacos, Desserts, Drinks*).
  - One-click **Veg-Only 🌱** toggle.
  - Sorting by **Most Popular**, **Top Rated (⭐ 4.8+)**, **Price: Low to High**, and **Price: High to Low**.
- **Interactive Dish Cards & Modal**:
  - Live in-card quantity counter (`[-] qty [+]`) when already added to basket.
  - Dish detail modal with fresh ingredient pills, spice level indicator, calorie counts, preparation time, and custom kitchen notes.
- **Slide-Out Cart Drawer**:
  - Visual **Free Delivery Progress Bar** (unlocked at \$35+).
  - Delivery address editor.
  - Courier tipping selector (\$1, \$2, \$3, \$5).
  - Promo discount validation (`CRAVER20`, `FEAST5`).
  - Itemized receipt (subtotal, delivery fee, discount, tip, total).
  - Celebratory confetti burst on order placement!
- **Real-Time Order Tracking**:
  - 4-stage visual progress stepper (*Order Confirmed ➔ Kitchen Preparing ➔ Courier on Route ➔ Delivered*).
  - Animated live GPS delivery map simulation with moving courier marker.
  - Courier card with driver name, rating, vehicle model, and contact buttons.
- **Restaurant Manager & Admin Portal**:
  - Real-time kitchen orders view with instant status update buttons (*Mark Preparing, Dispatch Rider, Mark Delivered*).
  - Real-time menu management: Add new dishes with photos, price, dietary tags, and delete existing items.
  - Revenue and order analytics cards.
- **Authentication System**:
  - Sign in & Sign up modals with JWT token generation.
  - **1-Click Demo Login buttons** to test as **Customer** or **Store Manager (Admin)** with zero typing required.

---

### 🚀 Robust Backend API & MongoDB
- **Connected MongoDB Database**:
  - Live local MongoDB Server 8.2 active on `mongodb://127.0.0.1:27017/craver_food_delivery`.
  - Also supports MongoDB Atlas cloud clusters by changing `MONGODB_URI` in `backend/.env`.
- **Mongoose Models**:
  - `User`: Handles registration, authentication, addresses, and roles (`customer` | `admin`).
  - `FoodItem`: Menu catalog with ingredients, spice indicators, and ratings.
  - `Order`: Multi-item orders with address, delivery fees, discount tracking, and live status.
- **Automated Seeder**:
  - Populates MongoDB with 12 gourmet dishes, demo customer & admin accounts, and an active order for real-time tracking testing (`npm run seed`).
- **Zero-Friction Fallback**:
  - If MongoDB is disconnected at any point, the backend seamlessly falls back to an interactive store without throwing 500 errors.

---

## 📁 Project Architecture

```
project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & status detector
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── foodController.js     # Menu CRUD, category filters, and search
│   │   └── orderController.js    # Order placement, status tracking & admin actions
│   ├── data/
│   │   ├── sampleFoods.js        # Catalog with delicious dishes & photos
│   │   └── fallbackStore.js      # Zero-setup in-memory data store
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verification & Admin role guard
│   ├── models/
│   │   ├── User.js               # Mongoose User Schema
│   │   ├── FoodItem.js           # Mongoose Food Item Schema
│   │   └── Order.js              # Mongoose Order Schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   └── orderRoutes.js
│   ├── .env                      # Environment configuration
│   ├── package.json
│   └── server.js                 # Express application entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, search, address & cart badge
│   │   │   ├── HeroBanner.jsx    # Hero visual, promo codes & badges
│   │   │   ├── CategoryFilter.jsx# Cuisine pills, Veg toggle & sorting
│   │   │   ├── FoodCard.jsx      # Card with interactive quantity stepper
│   │   │   ├── FoodModal.jsx     # Dish customization modal
│   │   │   ├── CartDrawer.jsx    # Slide-out basket with tip & promo codes
│   │   │   ├── OrderTrackerModal.jsx # Live order status & animated GPS map
│   │   │   ├── AuthModal.jsx     # Customer & Admin login with 1-click test buttons
│   │   │   ├── AdminPanel.jsx    # Restaurant manager order and menu dashboard
│   │   │   └── Footer.jsx        # Footer with brand links & operating hours
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global user auth state
│   │   │   └── CartContext.jsx   # Global cart, tip, and active order state
│   │   ├── services/
│   │   │   └── api.js            # Unified backend API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind base & custom design utilities
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json                  # Root scripts with concurrently
└── README.md
```

---

## 🛠️ How to Run

### Step 1: Start MongoDB
MongoDB is installed at `C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe`.
You can start it with:
```bash
npm run mongo
```
*Or double-click the `start-mongodb.bat` file in the project folder.*

### Step 2: Seed Initial Gourmet Dishes & Accounts (Already Done!)
```bash
npm run seed
```
*(Populates MongoDB with 12 gourmet dishes, demo customer, admin user, and active test order)*

### Step 3: Start the Backend and Frontend with One Command
```bash
npm run dev
```
*(Starts the Express server on port **5000** and the React Vite client on port **5173**)*

You can also double-click `start-all.bat` on Windows.

---

## 🔑 Demo Credentials

You can use the **1-Click Demo Login** buttons inside the Sign In modal, or enter them manually:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@craver.com` | `user123` | Browse menu, customize dishes, place orders, live track |
| **Chef / Admin** | `admin@craver.com` | `admin123` | Access Restaurant Manager, update order status, add/delete dishes |

---

## 🎟️ Promo Discount Codes
Try entering these at checkout in the basket drawer:
- **`CRAVER20`** — 20% discount on entire order.
- **`FEAST5`** — \$5.00 flat discount.
- Orders over **\$35.00** automatically qualify for **Free Express Delivery**!

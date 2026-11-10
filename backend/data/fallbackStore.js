import { sampleFoods } from "./sampleFoods.js";

// In-Memory store for out-of-the-box zero-setup run
class FallbackStore {
  constructor() {
    this.foods = [...sampleFoods];
    this.users = [
      {
        _id: "user_demo_customer",
        name: "Alex Johnson",
        email: "customer@craver.com",
        password: "user123", // in production hashed
        role: "customer",
        address: "742 Evergreen Terrace, Springfield",
        phone: "+1 (555) 019-2834"
      },
      {
        _id: "user_demo_admin",
        name: "Chef Marco (Store Manager)",
        email: "admin@craver.com",
        password: "admin123", // in production hashed
        role: "admin",
        address: "Kitchen Central, Store 101",
        phone: "+1 (555) 890-4321"
      }
    ];
    this.orders = [
      {
        _id: "ORD-98214",
        userId: "user_demo_customer",
        customerName: "Alex Johnson",
        customerEmail: "customer@craver.com",
        items: [
          {
            foodId: "food_1",
            name: "Truffle Smash Cheeseburger",
            price: 13.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
            specialInstructions: "Extra truffle aioli on the side please"
          },
          {
            foodId: "food_12",
            name: "Fresh Strawberry Basil Lemonade",
            price: 4.75,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80"
          }
        ],
        subtotal: 32.73,
        deliveryFee: 2.99,
        discount: 5.00,
        tip: 3.00,
        totalAmount: 33.72,
        deliveryAddress: "742 Evergreen Terrace, Springfield",
        paymentMethod: "Credit Card",
        status: "Out for Delivery", // 'Order Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'
        estimatedTime: "12-15 min",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ];
  }

  // FOOD METHODS
  getAllFoods(query = {}) {
    let result = [...this.foods];
    if (query.category && query.category.toLowerCase() !== "all") {
      result = result.filter(
        f => f.category.toLowerCase() === query.category.toLowerCase()
      );
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        f =>
          f.name.toLowerCase().includes(s) ||
          f.description.toLowerCase().includes(s) ||
          f.category.toLowerCase().includes(s) ||
          (f.tags && f.tags.some(t => t.toLowerCase().includes(s)))
      );
    }
    if (query.isVeg === "true") {
      result = result.filter(f => f.isVeg);
    }
    if (query.sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (query.sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (query.sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }

  getFoodById(id) {
    return this.foods.find(f => f._id === id || f.id === id);
  }

  createFood(data) {
    const newFood = {
      _id: "food_" + Date.now(),
      ...data,
      rating: data.rating || 5.0,
      ratingCount: 1,
      createdAt: new Date()
    };
    this.foods.unshift(newFood);
    return newFood;
  }

  updateFood(id, updates) {
    const index = this.foods.findIndex(f => f._id === id || f.id === id);
    if (index === -1) return null;
    this.foods[index] = { ...this.foods[index], ...updates };
    return this.foods[index];
  }

  deleteFood(id) {
    const index = this.foods.findIndex(f => f._id === id || f.id === id);
    if (index === -1) return false;
    this.foods.splice(index, 1);
    return true;
  }

  // USER METHODS
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id || u.id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: "user_" + Date.now(),
      ...userData,
      role: userData.role || "customer",
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // ORDER METHODS
  createOrder(orderData) {
    const newOrder = {
      _id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      ...orderData,
      status: "Order Confirmed",
      estimatedTime: "25-35 min",
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getAllOrders() {
    return this.orders;
  }

  getOrdersByUser(userId) {
    return this.orders.filter(o => o.userId === userId);
  }

  getOrderById(id) {
    return this.orders.find(o => o._id === id || o.id === id);
  }

  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    return order;
  }
}

export const fallbackStore = new FallbackStore();

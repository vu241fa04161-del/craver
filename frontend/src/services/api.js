const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = localStorage.getItem('craver_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  // Foods
  async getFoods(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.isVeg) query.append('isVeg', 'true');
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE_URL}/foods?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch food items');
    return res.json();
  },

  async getFoodById(id) {
    const res = await fetch(`${API_BASE_URL}/foods/${id}`);
    if (!res.ok) throw new Error('Failed to fetch food item');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/foods/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createFood(foodData) {
    const res = await fetch(`${API_BASE_URL}/foods`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(foodData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create food item');
    }
    return res.json();
  },

  async deleteFood(id) {
    const res = await fetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to delete food item');
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to authenticate');
    return res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to place order');
    }
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to fetch your orders');
    return res.json();
  },

  async getOrderById(id) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order details');
    return res.json();
  },

  async getAllOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to fetch restaurant orders');
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },
};

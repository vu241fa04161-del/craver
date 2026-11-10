import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  ShoppingBag,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  CheckCircle2,
  Bike,
  Utensils,
  RefreshCw,
  Search,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export const AdminPanel = ({ onBackToStore }) => {
  const [tab, setTab] = useState('orders'); // 'orders' | 'menu'
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrders, setSearchOrders] = useState('');
  const [showAddDishModal, setShowAddDishModal] = useState(false);

  // New Dish Form State
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'Burgers',
    price: '',
    originalPrice: '',
    image: '',
    description: '',
    prepTime: '20 min',
    isVeg: false,
    isSpicy: false,
    tags: 'Popular, Chef Special',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedFoods] = await Promise.all([
        api.getAllOrders().catch(() => []),
        api.getFoods().catch(() => []),
      ]);
      setOrders(fetchedOrders);
      setFoods(fetchedFoods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    try {
      await api.deleteFood(id);
      setFoods(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      alert('Failed to delete food item');
    }
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price || !newDish.image || !newDish.description) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const created = await api.createFood({
        ...newDish,
        price: Number(newDish.price),
        originalPrice: newDish.originalPrice ? Number(newDish.originalPrice) : undefined,
        tags: newDish.tags.split(',').map(t => t.trim()),
      });
      setFoods(prev => [created, ...prev]);
      setShowAddDishModal(false);
      setNewDish({
        name: '',
        category: 'Burgers',
        price: '',
        originalPrice: '',
        image: '',
        description: '',
        prepTime: '20 min',
        isVeg: false,
        isSpicy: false,
        tags: '',
      });
    } catch (err) {
      alert(err.message || 'Failed to create food item');
    }
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  const filteredOrders = orders.filter(o =>
    o._id?.toLowerCase().includes(searchOrders.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchOrders.toLowerCase()) ||
    o.status?.toLowerCase().includes(searchOrders.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16">
      {/* Admin Sub-Navbar */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black">Kitchen & Store Manager</h1>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded uppercase">
                    Admin Portal
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Live restaurant management, order fulfillment & menu controls
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={onBackToStore}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Back to Customer Store
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Total Orders</div>
              <div className="text-2xl font-black text-white mt-1">{orders.length}</div>
            </div>
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Active In Kitchen</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{activeOrdersCount}</div>
            </div>
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Gross Sales</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">${totalRevenue.toFixed(2)}</div>
            </div>
            <div className="p-3.5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Menu Catalog</div>
              <div className="text-2xl font-black text-purple-400 mt-1">{foods.length} items</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'orders'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              Live Orders ({orders.length})
            </button>
            <button
              onClick={() => setTab('menu')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === 'menu'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              Menu Catalog ({foods.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Tab 1: Orders */}
        {tab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchOrders}
                  onChange={(e) => setSearchOrders(e.target.value)}
                  placeholder="Filter by ID, customer name, status..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <span className="text-xs text-stone-500 font-semibold">
                Showing {filteredOrders.length} orders
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
                No orders match your filter.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-5 bg-white rounded-3xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          #{order._id}
                        </span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            order.status === 'Order Confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Preparing'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Out for Delivery'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600">
                        <span className="font-bold text-stone-900">{order.customerName}</span> •{' '}
                        <span>{order.deliveryAddress}</span>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items?.map((it, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-lg font-medium text-stone-700"
                          >
                            {it.quantity}x {it.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Order Price & Status Changer */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                      <div className="text-right sm:text-left">
                        <div className="text-[10px] uppercase font-bold text-stone-400">Total</div>
                        <div className="text-lg font-black text-stone-900">${order.totalAmount?.toFixed(2)}</div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {order.status !== 'Preparing' && order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleStatusChange(order._id, 'Preparing')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {order.status !== 'Out for Delivery' && order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleStatusChange(order._id, 'Out for Delivery')}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
                          >
                            Dispatch Rider
                          </button>
                        )}
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleStatusChange(order._id, 'Delivered')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu Items */}
        {tab === 'menu' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-stone-900">Manage Restaurant Dishes</h3>
                <p className="text-xs text-stone-500">Add new creations, update pricing, or delete dishes</p>
              </div>
              <button
                onClick={() => setShowAddDishModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-40">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {food.category}
                    </span>
                    <button
                      onClick={() => handleDeleteFood(food._id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-rose-600 shadow transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 truncate">{food.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">{food.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-100">
                      <span className="text-base font-black text-stone-900">${food.price.toFixed(2)}</span>
                      <span className="text-xs text-stone-400 font-semibold">{food.prepTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add New Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-lg text-stone-900">Add New Dish to Menu</h3>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="e.g. Crispy Truffle Fries"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Burgers">Burgers</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="Asian & Noodles">Asian & Noodles</option>
                    <option value="Healthy Bowls">Healthy Bowls</option>
                    <option value="Tacos & Mexican">Tacos & Mexican</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    placeholder="9.99"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Image URL (Unsplash/Direct) *</label>
                <input
                  type="url"
                  value={newDish.image}
                  onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  placeholder="Mouth-watering ingredients and cooking style..."
                  rows={2}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDish.isVeg}
                    onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <span>Vegetarian 🌱</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDish.isSpicy}
                    onChange={(e) => setNewDish({ ...newDish, isSpicy: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600"
                  />
                  <span>Spicy 🌶️</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:bg-stone-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/25"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

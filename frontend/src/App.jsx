import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { FoodCard } from './components/FoodCard';
import { FoodModal } from './components/FoodModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { Sparkles, Utensils, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Modal states
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [currentView, setCurrentView] = useState('customer'); // 'customer' | 'admin'

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (e) {
        console.warn('Failed to load categories', e);
      }
    };
    loadCategories();
  }, []);

  // Fetch Foods on filters change
  const fetchFoodList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFoods({
        category: selectedCategory,
        search: searchQuery,
        isVeg: isVegOnly,
        sort: sortBy,
      });
      setFoods(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load dishes right now. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, [selectedCategory, searchQuery, isVegOnly, sortBy]);

  const handleSearchTag = (tag) => {
    setSearchQuery(tag);
    setSelectedCategory('all');
    // Scroll down to menu
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {currentView === 'admin' ? (
        <AdminPanel onBackToStore={() => setCurrentView('customer')} />
      ) : (
        <main className="flex-1">
          {/* Hero Banner */}
          <HeroBanner
            onSelectCategory={setSelectedCategory}
            onSearchTag={handleSearchTag}
          />

          {/* Menu Section */}
          <div id="menu-section">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              isVegOnly={isVegOnly}
              setIsVegOnly={setIsVegOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              itemCount={foods.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Error State */}
              {error && (
                <div className="p-8 text-center bg-rose-50 rounded-3xl border border-rose-200 text-rose-800 space-y-3 max-w-lg mx-auto">
                  <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="text-sm font-semibold">{error}</p>
                  <button
                    onClick={fetchFoodList}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow hover:bg-rose-700 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              )}

              {/* Loading Skeleton Grid */}
              {loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-3xl p-4 border border-stone-200/60 shadow-sm animate-pulse space-y-4"
                    >
                      <div className="w-full h-48 bg-stone-200 rounded-2xl" />
                      <div className="space-y-2">
                        <div className="h-4 bg-stone-200 rounded w-3/4" />
                        <div className="h-3 bg-stone-100 rounded w-full" />
                        <div className="h-3 bg-stone-100 rounded w-2/3" />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-5 bg-stone-200 rounded w-16" />
                        <div className="h-8 bg-stone-200 rounded-2xl w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty Dishes State */}
              {!loading && !error && foods.length === 0 && (
                <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-stone-200/80 p-8">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 flex items-center justify-center text-4xl">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">No dishes found</h3>
                  <p className="text-sm text-stone-500 max-w-md mx-auto">
                    We couldn't find any dishes matching "{searchQuery}". Try clearing filters or exploring another category!
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setIsVegOnly(false);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-all shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Food Dishes Grid */}
              {!loading && !error && foods.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {foods.map((food) => (
                    <FoodCard
                      key={food._id}
                      food={food}
                      onQuickView={setSelectedFoodModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Global Modals & Drawers */}
      <FoodModal
        food={selectedFoodModal}
        onClose={() => setSelectedFoodModal(null)}
      />
      <CartDrawer />
      <OrderTrackerModal />
      <AuthModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

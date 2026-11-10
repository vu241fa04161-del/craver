import React, { useState } from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  User,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Clock,
  Sparkles,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  currentView,
  setCurrentView,
}) => {
  const { user, logout, openAuth, isAdmin } = useAuth();
  const {
    cartCount,
    subtotal,
    setIsCartOpen,
    activeOrder,
    setIsTrackerOpen,
    deliveryAddress,
    setDeliveryAddress,
  } = useCart();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (tempAddress.trim()) {
      setDeliveryAddress(tempAddress.trim());
      setAddressModalOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/80 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView('customer')}
                className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all">
                  <UtensilsCrossed className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black tracking-tight text-stone-900 group-hover:text-brand-600 transition-colors">
                      Craver<span className="text-brand-500">.</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-md">
                      Express
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium hidden sm:block">
                    Cravings, delivered hot & fast
                  </p>
                </div>
              </button>

              {/* Delivery Address Pill */}
              <button
                onClick={() => setAddressModalOpen(true)}
                className="hidden lg:flex items-center gap-2 py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-all border border-stone-200/60"
              >
                <div className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Deliver to</div>
                  <div className="max-w-[140px] truncate font-medium text-stone-800">
                    {deliveryAddress}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>

            {/* Search Input Bar (Center) */}
            {currentView === 'customer' && (
              <div className="hidden md:flex flex-1 max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search burgers, wood-fired pizza, ramen..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-100/90 hover:bg-stone-100 focus:bg-white text-sm rounded-full border border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all placeholder:text-stone-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-stone-400 hover:text-stone-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Right Action Icons */}
            <div className="flex items-center gap-3">
              {/* Admin Toggle Button */}
              {isAdmin && (
                <button
                  onClick={() => setCurrentView(currentView === 'customer' ? 'admin' : 'customer')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentView === 'admin'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <ChefHat className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {currentView === 'admin' ? 'Back to Store' : 'Admin Panel'}
                  </span>
                </button>
              )}

              {/* Live Order Tracker Button (if active order exists) */}
              {activeOrder && (
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all shadow-sm"
                  title="Track active order"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Track Order</span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-brand-400" />
                <span className="hidden sm:inline">${subtotal.toFixed(2)}</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Auth Profile / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-stone-100 hover:bg-stone-200/80 transition-all border border-stone-200/60"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-stone-800 max-w-[90px] truncate hidden sm:inline">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <div className="font-bold text-sm text-stone-800">{user.name}</div>
                        <div className="text-xs text-stone-400 truncate">{user.email}</div>
                        <div className="mt-1">
                          <span
                            className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-brand-50 text-brand-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Store Manager (Admin)' : 'Customer'}
                          </span>
                        </div>
                      </div>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setCurrentView(currentView === 'customer' ? 'admin' : 'customer');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          {currentView === 'admin' ? 'Switch to Customer View' : 'Admin & Order Manager'}
                        </button>
                      )}

                      {activeOrder && (
                        <button
                          onClick={() => {
                            setIsTrackerOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 text-emerald-600" />
                          Track Active Order
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuth('login')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-all shadow-sm hover:shadow-brand-500/30"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {currentView === 'customer' && (
            <div className="pb-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search burgers, pizzas, ramen..."
                  className="w-full pl-10 pr-4 py-2 bg-stone-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Address Edit Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900">Set Delivery Address</h3>
                <p className="text-xs text-stone-500">Where should we deliver your hot food?</p>
              </div>
            </div>
            <form onSubmit={handleSaveAddress}>
              <textarea
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="Enter street, apartment, city, zip code..."
                required
              />
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

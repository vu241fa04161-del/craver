import React, { useState } from 'react';
import { X, Mail, Lock, User, MapPin, Phone, ShieldCheck, Sparkles, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { authModalOpen, closeAuth, authMode, setAuthMode, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, address, phone });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async (role) => {
    setError('');
    setLoading(true);
    try {
      if (role === 'admin') {
        await login('admin@craver.com', 'admin123');
      } else {
        await login('customer@craver.com', 'user123');
      }
    } catch (err) {
      setError('Failed demo login. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-stone-900">
            {authMode === 'login' ? 'Welcome Back!' : 'Join Craver'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {authMode === 'login'
              ? 'Sign in to access saved addresses and track live orders'
              : 'Create your account for express checkout and exclusive discounts'}
          </p>
        </div>

        {/* 1-Click Demo Accounts Pill Box */}
        <div className="mb-5 p-3.5 bg-brand-50/80 rounded-2xl border border-brand-200/60">
          <div className="text-[10px] uppercase font-bold tracking-wider text-brand-800 mb-2 flex items-center justify-between">
            <span>⚡ 1-Click Demo Logins</span>
            <span className="font-normal text-[10px] text-brand-600">instant test</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer')}
              className="py-1.5 px-2 rounded-xl bg-white hover:bg-brand-100/80 text-brand-900 text-xs font-bold border border-brand-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-brand-500" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-1.5 px-2 rounded-xl bg-white hover:bg-purple-100/80 text-purple-900 text-xs font-bold border border-purple-200 shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <ChefHat className="w-3.5 h-3.5 text-purple-600" />
              <span>Chef / Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                required
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, Zip"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Please wait...
              </span>
            ) : authMode === 'login' ? (
              'Sign In to Craver'
            ) : (
              'Create My Free Account'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-5 text-xs text-stone-500">
          {authMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-brand-600 hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-brand-600 hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

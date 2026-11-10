import React from 'react';
import { Sparkles, Clock, Star, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const HeroBanner = ({ onSelectCategory, onSearchTag }) => {
  const { applyPromo } = useCart();

  const handleCopyCode = () => {
    applyPromo('CRAVER20');
    alert('Coupon code CRAVER20 copied and applied for 20% discount!');
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-brand-50/50 via-white to-stone-50 border-b border-stone-200/50">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Promo pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-bold tracking-wide shadow-sm">
              <Flame className="w-3.5 h-3.5 text-brand-600 animate-bounce" />
              <span>SUPER DEAL: Get 20% OFF using</span>
              <button
                onClick={handleCopyCode}
                className="bg-brand-600 text-white px-2 py-0.5 rounded font-mono text-[11px] hover:bg-brand-700 transition-colors uppercase tracking-wider cursor-pointer"
                title="Click to apply"
              >
                CRAVER20
              </button>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
              Savor Chef-Crafted <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-amber-500 to-rose-500">
                Gourmet Meals
              </span>{' '}
              Delivered Hot.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 font-medium">
              From artisan smash burgers and Neapolitan wood-fired pizzas to fresh salmon poke bowls, indulge in mouth-watering cuisine straight to your door in under 30 minutes.
            </p>

            {/* Quick Filter Tags */}
            <div className="pt-2">
              <div className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-2.5">
                Popular Cravings
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {[
                  { label: '🍔 Truffle Burger', tag: 'burger' },
                  { label: '🍕 Wood-Fired Pizza', tag: 'pizza' },
                  { label: '🍜 Tonkotsu Ramen', tag: 'ramen' },
                  { label: '🥗 Green Goddess Bowl', tag: 'bowl' },
                  { label: '🍫 Lava Cake', tag: 'chocolate' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSearchTag(item.tag)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-brand-50 hover:border-brand-300 border border-stone-200/80 text-xs font-semibold text-stone-700 hover:text-brand-700 transition-all shadow-sm active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-200/70 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-stone-900">25-30</div>
                <div className="text-xs font-medium text-stone-500">Mins Express Delivery</div>
              </div>
              <div className="text-center lg:text-left border-x border-stone-200 px-4">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-2xl font-black text-stone-900">
                  <span>4.9</span>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
                </div>
                <div className="text-xs font-medium text-stone-500">12k+ Foodie Reviews</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-black text-stone-900">100%</div>
                <div className="text-xs font-medium text-stone-500">Fresh & Hot Promise</div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Appetizing Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Dish Showpiece Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-900/15 border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                  alt="Featured Burger"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block bg-brand-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mb-1.5 shadow">
                    Today's Top Chef Pick
                  </span>
                  <h3 className="text-xl font-bold">Truffle Smash Cheeseburger</h3>
                  <div className="flex items-center justify-between mt-1 text-xs text-stone-200">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 (428 reviews)
                    </span>
                    <span className="text-base font-black text-amber-300">$13.99</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: 30 Mins Live delivery badge */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3 shadow-xl border border-stone-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900">Fast Delivery</div>
                  <div className="text-[11px] text-stone-500 font-semibold">Average 24 mins</div>
                </div>
              </div>

              {/* Floating Badge 2: Satisfied Customers */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-stone-900">Verified Quality</div>
                  <div className="text-[11px] text-emerald-600 font-bold">100% Contactless</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

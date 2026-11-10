import React from 'react';
import { UtensilsCrossed, Heart, ShieldCheck, Clock, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Craver<span className="text-brand-500">.</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Bringing artisanal, chef-crafted gourmet meals straight to your doorstep with guaranteed 30-minute hot delivery, real-time live map tracking, and 100% fresh ingredients.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>10:00 AM – 11:30 PM Everyday</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white mb-4">
              Explore Cuisines
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Artisan Smash Burgers</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Wood-Fired Neapolitan Pizza</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Tokyo Tonkotsu Ramen</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Organic Protein Bowls</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Baja Fish Tacos</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Molten Chocolate Desserts</li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="hover:text-brand-400 cursor-pointer transition-colors">About Craver</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Partner as a Restaurant</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Deliver with Craver</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Help Center & FAQ</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-brand-400 cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter / App */}
          <div>
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-white mb-4">
              Get VIP Food Deals
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Subscribe to get secret weekend discount codes & free dessert drops.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to VIP deals!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-stone-800 rounded-xl text-xs text-white placeholder:text-stone-500 border border-stone-700 focus:outline-none focus:border-brand-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Craver Inc. All rights reserved. Built with modern MERN Stack.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for passionate food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

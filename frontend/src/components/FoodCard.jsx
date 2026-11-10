import React from 'react';
import { Star, Clock, Flame, Plus, Minus, Eye, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ food, onQuickView }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => item._id === food._id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const discountPercent =
    food.originalPrice && food.originalPrice > food.price
      ? Math.round(((food.originalPrice - food.price) / food.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-3xl border border-stone-200/70 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Section */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => onQuickView(food)}>
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-48 sm:h-52 object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Veg / Non-Veg Indicator Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-md border-2 bg-white flex items-center justify-center shadow-sm ${
              food.isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
            title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            />
          </div>

          {/* Spicy Badge */}
          {food.isSpicy && (
            <div
              className="w-5 h-5 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm"
              title="Spicy dish"
            >
              <Flame className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Discount or Best Seller Badge */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {discountPercent && (
            <span className="bg-brand-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {food.isPopular && !discountPercent && (
            <span className="bg-amber-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Popular
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(food);
          }}
          className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-stone-700 shadow-md opacity-0 group-hover:opacity-100 transition-all active:scale-95"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Prep time chip */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg">
          <Clock className="w-3 h-3 text-brand-400" />
          <span>{food.prepTime || '20 min'}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {food.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{food.rating || 4.8}</span>
              <span className="text-stone-400 font-normal">({food.ratingCount || 120})</span>
            </div>
          </div>

          {/* Dish Name */}
          <h3
            onClick={() => onQuickView(food)}
            className="font-bold text-stone-900 text-base leading-snug hover:text-brand-600 transition-colors cursor-pointer line-clamp-1"
          >
            {food.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {food.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-stone-400 font-medium">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-stone-900">${food.price.toFixed(2)}</span>
              {food.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ${food.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Cart Button */}
          {inCartQty > 0 ? (
            <div className="flex items-center gap-2 bg-stone-100 border border-stone-200/80 rounded-2xl p-1 shadow-inner">
              <button
                onClick={() => updateQuantity(food._id, -1)}
                className="w-7 h-7 rounded-xl bg-white hover:bg-stone-200/80 text-stone-700 flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-xs text-stone-900 px-1">{inCartQty}</span>
              <button
                onClick={() => updateQuantity(food._id, 1)}
                className="w-7 h-7 rounded-xl bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food, 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white font-bold text-xs border border-brand-200 hover:border-brand-500 transition-all shadow-sm hover:shadow-brand-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

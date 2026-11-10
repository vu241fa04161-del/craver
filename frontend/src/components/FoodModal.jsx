import React, { useState } from 'react';
import { X, Star, Clock, Flame, Plus, Minus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodModal = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, quantity, specialInstructions);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const totalPrice = (food.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100 flex-shrink-0">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="bg-brand-500 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                {food.category}
              </span>
              {food.isVeg ? (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Pure Veg
                </span>
              ) : (
                <span className="bg-stone-800 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Non-Veg
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{food.rating} ({food.ratingCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">{food.name}</h2>
              <div className="text-2xl font-black text-brand-600">${food.price.toFixed(2)}</div>
            </div>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed font-medium">
              {food.description}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-center">
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Prep Time</div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-500" />
                {food.prepTime || '20 min'}
              </div>
            </div>
            <div className="border-x border-stone-200">
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Calories</div>
              <div className="text-xs font-bold text-stone-800 mt-0.5">
                {food.calories || 520} kcal
              </div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Spice Level</div>
              <div className="text-xs font-bold text-stone-800 mt-0.5 flex items-center justify-center gap-1">
                {food.isSpicy ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> Hot & Spicy
                  </>
                ) : (
                  'Mild / Gentle'
                )}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Fresh Ingredients Included
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {food.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold border border-stone-200/60"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Special Kitchen Instructions (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra dressing on the side, no onions, extra napkins..."
              rows={2}
              className="w-full p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Modal Footer (Sticky at bottom) */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition-all active:scale-90"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-black text-sm text-stone-900 w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition-all active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={addedAnimation}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${
              addedAnimation
                ? 'bg-emerald-600 shadow-emerald-500/30'
                : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/30'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5 animate-scale" />
                <span>Added to Basket!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket • ${totalPrice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

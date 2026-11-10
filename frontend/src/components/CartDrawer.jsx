import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  MapPin,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    tip,
    setTip,
    grandTotal,
    deliveryAddress,
    promoCode,
    setPromoCode,
    appliedPromo,
    applyPromo,
    removePromo,
    setActiveOrder,
    setIsTrackerOpen,
  } = useCart();

  const { user, openAuth } = useAuth();
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  if (!isCartOpen) return null;

  const handleApplyCode = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!promoCode.trim()) return;

    const res = applyPromo(promoCode);
    if (res.success) {
      setPromoSuccess(res.message);
    } else {
      setPromoError(res.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          specialInstructions: item.specialInstructions || '',
        })),
        subtotal,
        deliveryFee,
        discount,
        tip,
        totalAmount: grandTotal,
        deliveryAddress,
        paymentMethod,
        customerName: user ? user.name : 'Guest Customer',
        customerEmail: user ? user.email : 'guest@craver.com',
      };

      const newOrder = await api.createOrder(orderPayload);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Clear cart, close drawer, open live tracker!
      clearCart();
      setIsCartOpen(false);
      setActiveOrder(newOrder);
      setIsTrackerOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Free delivery threshold ($35)
  const freeDeliveryThreshold = 35;
  const awayFromFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-stone-900">Your Basket</h3>
                <p className="text-xs text-stone-500 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'dish' : 'dishes'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Free Delivery Bar */}
            <div className="p-3.5 bg-brand-50 rounded-2xl border border-brand-200/60">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
                <span>
                  {awayFromFreeDelivery === 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Delivery!
                    </span>
                  ) : (
                    <span>Add ${awayFromFreeDelivery.toFixed(2)} more for FREE delivery</span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-brand-700">
                  {Math.round(freeDeliveryProgress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-brand-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-stone-100 flex items-center justify-center text-4xl">
                  🍲
                </div>
                <h4 className="font-bold text-base text-stone-800">Your basket is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Satisfy your hunger! Discover our delicious dishes and add your favorites.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-all"
                >
                  Explore Delicious Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="p-3 rounded-2xl border border-stone-200/70 bg-stone-50/50 flex gap-3 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 truncate">{item.name}</h4>
                      <div className="text-xs font-extrabold text-brand-600 mt-0.5">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.specialInstructions && (
                        <p className="text-[10px] text-stone-500 truncate italic">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-stone-800 px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="w-6 h-6 rounded-lg bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove from basket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <>
                {/* Delivery Address Box */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                      Delivery Address
                    </div>
                    <div className="text-xs font-medium text-stone-800 truncate">
                      {deliveryAddress}
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div>
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Promo code (e.g. CRAVER20)"
                        className="w-full pl-9 pr-3 py-2 bg-stone-100 rounded-xl text-xs font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm"
                    >
                      Apply
                    </button>
                  </form>

                  {appliedPromo && (
                    <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> {appliedPromo.code} applied ({appliedPromo.label})
                      </span>
                      <button
                        onClick={removePromo}
                        className="text-stone-400 hover:text-rose-600 text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <div className="mt-2 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                    </div>
                  )}
                </div>

                {/* Tip Driver Selection */}
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-stone-700 mb-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-brand-600" />
                    <span>Tip your hard-working courier</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { label: '$1', val: 1 },
                      { label: '$2', val: 2 },
                      { label: '$3', val: 3 },
                      { label: '$5', val: 5 },
                      { label: '$0', val: 0 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setTip(item.val)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          tip === item.val
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <div className="text-xs font-bold text-stone-700 mb-1.5">Payment Method</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Credit Card', 'Apple Pay', 'Cash on Delivery'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 px-1 rounded-xl text-[11px] font-bold border text-center transition-all ${
                          paymentMethod === m
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Calculation & Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-black text-[11px]">Free</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex justify-between">
                    <span>Courier Tip</span>
                    <span className="font-bold text-stone-900">${tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-900">
                  <span>Total Due</span>
                  <span className="text-base text-brand-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 transition-all active:scale-95 disabled:opacity-60"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Your Order...
                  </span>
                ) : (
                  <>
                    <span>Place Order • ${grandTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

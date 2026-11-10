import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('craver_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('craver_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);

  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('craver_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Springfield');
  const [tip, setTip] = useState(3.00);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem('craver_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('craver_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('craver_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('craver_active_order');
    }
  }, [activeOrder]);

  const toggleFavorite = (foodId) => {
    setFavorites(prev => {
      if (prev.includes(foodId)) {
        return prev.filter(id => id !== foodId);
      } else {
        return [...prev, foodId];
      }
    });
  };

  const isFavorite = (foodId) => favorites.includes(foodId);

  const addToCart = (food, quantity = 1, specialInstructions = '') => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item._id === food._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (specialInstructions) {
          updated[existingIndex].specialInstructions = specialInstructions;
        }
        return updated;
      } else {
        return [
          ...prev,
          {
            ...food,
            quantity,
            specialInstructions,
          },
        ];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prev => prev.filter(item => item._id !== foodId));
  };

  const updateQuantity = (foodId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item._id === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    setPromoCode('');
  };

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CRAVER20') {
      setAppliedPromo({ code: 'CRAVER20', discountPercent: 0.2, label: '20% OFF' });
      return { success: true, message: '20% discount applied successfully!' };
    } else if (clean === 'FEAST5') {
      setAppliedPromo({ code: 'FEAST5', flatDiscount: 5.0, label: '$5.00 OFF' });
      return { success: true, message: '$5.00 discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try CRAVER20 or FEAST5' };
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 35 || subtotal === 0 ? 0 : 2.99;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discount = subtotal * appliedPromo.discountPercent;
    } else if (appliedPromo.flatDiscount) {
      discount = Math.min(appliedPromo.flatDiscount, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + (subtotal > 0 ? deliveryFee + tip : 0));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        tip,
        setTip,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        activeOrder,
        setActiveOrder,
        isTrackerOpen,
        setIsTrackerOpen,
        deliveryAddress,
        setDeliveryAddress,
        promoCode,
        setPromoCode,
        appliedPromo,
        applyPromo,
        removePromo,
        favorites,
        toggleFavorite,
        isFavorite,
        orderHistoryOpen,
        setOrderHistoryOpen,
        receiptOrder,
        setReceiptOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

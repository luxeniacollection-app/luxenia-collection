import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY_CART = 'luxenia_cart';
const STORAGE_KEY_CURRENCY = 'luxenia_currency';
const STORAGE_KEY_LAST_ORDER = 'luxenia_last_order';
const USD_KES_RATE = 130;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currency, setCurrency] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(STORAGE_KEY_CURRENCY) || 'KES';
      }
    } catch (e) {
      // ignore storage errors
    }
    return 'KES';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const [discountAmountKes, setDiscountAmountKes] = useState(0);

  const [lastOrder, setLastOrder] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_LAST_ORDER);
        return saved ? JSON.parse(saved) : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  // Persist cart
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
      }
    } catch (e) {
      // ignore
    }
  }, [cart]);

  // Persist currency
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
      }
    } catch (e) {
      // ignore
    }
  }, [currency]);

  // Persist last order
  useEffect(() => {
    try {
      if (lastOrder && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_LAST_ORDER, JSON.stringify(lastOrder));
      }
    } catch (e) {
      // ignore
    }
  }, [lastOrder]);

  // Calculate totals: PRODUCT TOTAL = FINAL TOTAL
  const subtotalKes = cart.reduce((sum, item) => sum + (Number(item.priceKes) || 5800) * (Number(item.quantity) || 1), 0);
  const subtotalUsd = cart.reduce((sum, item) => sum + (item.priceUsd || Math.round((item.priceKes || 5800) / USD_KES_RATE)) * (Number(item.quantity) || 1), 0);
  const totalItemCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  // Recalculate discount whenever subtotal or promoCode changes
  useEffect(() => {
    if (!promoCode) {
      setDiscountAmountKes(0);
      return;
    }

    const code = promoCode.toUpperCase();
    if (code === 'LUXE10') {
      setDiscountAmountKes(Math.round(subtotalKes * 0.1));
    } else if (code === 'LUXE2000' || code === 'FIRST2000') {
      setDiscountAmountKes(Math.min(2000, subtotalKes));
    } else {
      setDiscountAmountKes(0);
    }
  }, [promoCode, subtotalKes]);

  const addToCart = (product, size, color, quantity = 1) => {
    const isOutOfStock = Number(product.stock) <= 0 || product.status === 'out_of_stock';
    if (isOutOfStock) return;

    const availableStock = typeof product.stock === 'number' ? product.stock : 99;
    const colorName = typeof color === 'object' ? color?.name : color || product.colors?.[0]?.name || 'Noir Black';
    const itemKey = `${product.id}-${size || 'Classic Baguette (28cm)'}-${colorName}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity || 1;
        const newQty = Math.min(availableStock, currentQty + quantity);
        updated[existingIndex].quantity = newQty;
        updated[existingIndex].stock = availableStock;
        return updated;
      } else {
        const safeQty = Math.min(availableStock, quantity);
        return [
          ...prev,
          {
            itemKey,
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            category: product.category,
            categoryName: product.categoryName || 'Designer Bags',
            priceKes: Number(product.priceKes) || 5800,
            priceUsd: Number(product.priceUsd) || 45,
            sku: product.sku,
            selectedSize: size || product.sizes?.[0] || 'Classic Baguette (28cm)',
            selectedColor: color || product.colors?.[0] || { name: 'Noir Black', hex: '#0A0A0C' },
            quantity: safeQty,
            stock: availableStock,
            image: product.image
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (itemKey) => {
    setCart(prev => prev.filter(item => item.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.itemKey === itemKey) {
          const maxStock = typeof item.stock === 'number' ? item.stock : 99;
          const newQty = Math.min(maxStock, item.quantity + delta);
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setDiscountAmountKes(0);
  };

  const saveConfirmedOrder = (order) => {
    const secureOrder = {
      ...order,
      status: 'Payment Verification Pending',
      paymentVerified: false
    };
    setLastOrder(secureOrder);

    // Also persist into orders history for Admin Dashboard review
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing = localStorage.getItem('luxenia_orders_history');
        const list = existing ? JSON.parse(existing) : [];
        const updatedList = [secureOrder, ...list.filter(o => o.id !== secureOrder.id)];
        localStorage.setItem('luxenia_orders_history', JSON.stringify(updatedList));
      }
    } catch (e) {
      // ignore
    }
  };

  const applyPromoCode = (code) => {
    const trimmed = (code || '').trim().toUpperCase();
    if (trimmed === 'LUXE10') {
      setPromoCode('LUXE10');
      return { success: true, message: 'Promo applied: 10% Off your collection purchase!' };
    } else if (trimmed === 'LUXE2000' || trimmed === 'FIRST2000') {
      setPromoCode(trimmed);
      return { success: true, message: 'Welcome discount applied: KSh 2,000 Off!' };
    }
    return { success: false, message: 'Invalid or expired promo code. Try LUXE10 or LUXE2000' };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscountAmountKes(0);
  };

  const toggleCurrency = () => {
    setCurrency('KES');
  };

  const formatPrice = (kesAmount, usdAmount) => {
    const amount = Number(kesAmount) || 0;
    return `KSh ${amount.toLocaleString()}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItemCount,
        subtotalKes,
        subtotalUsd,
        currency,
        toggleCurrency,
        formatPrice,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        discountAmountKes,
        applyPromoCode,
        removePromoCode,
        lastOrder,
        saveConfirmedOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

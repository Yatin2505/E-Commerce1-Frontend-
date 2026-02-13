import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      setError(message);
      return { success: false, message };
    }
  };

  // Update cart quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);
      const response = await cartAPI.updateCartQuantity(productId, quantity);
      setCart(response.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update quantity';
      setError(message);
      return { success: false, message };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove from cart';
      setError(message);
      return { success: false, message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setError(null);
      await cartAPI.clearCart();
      setCart(null);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to clear cart';
      setError(message);
      return { success: false, message };
    }
  };

  // Calculate cart total
  const cartTotal = cart?.totalPrice || 0;

  // Get cart items count
  const cartItemsCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    cartTotal,
    cartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

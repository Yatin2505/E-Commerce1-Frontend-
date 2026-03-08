import { createContext, useState, useEffect, useContext } from 'react';
import { wishlistAPI } from '../services/api';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist when user is logged in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.wishlist.products || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      const response = await wishlistAPI.addToWishlist(productId);
      setWishlist(response.data.wishlist.products || []);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to wishlist');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const response = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(response.data.wishlist.products || []);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from wishlist');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      await wishlistAPI.clearWishlist();
      setWishlist([]);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear wishlist');
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product && item.product._id === productId);
  };

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    fetchWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

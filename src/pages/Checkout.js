import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: user?.address || '',
    city: '',
    state: '',
    pinCode: '',
    phone: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
      };

      const response = await orderAPI.createOrder(orderData);
      
      if (response.data.success) {
        await clearCart();
        alert('Order placed successfully!');
        navigate('/orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return <Loader />;
  }

  if (!cart || cart.products.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Checkout Form */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Shipping Information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-input"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  className="form-input"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                name="paymentMethod"
                className="form-input"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Card Payment</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order - $${cart.totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          
          {cart.products.map((item) => (
            <div key={item.product._id} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: '500' }}>{item.product.name}</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          
          <div className="summary-row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
            <span>Total</span>
            <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

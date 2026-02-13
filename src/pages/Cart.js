import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return <Loader />;
  }

  if (!cart || cart.products.length === 0) {
    return (
      <div className="container">
        <div className="text-center" style={{ padding: '4rem' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: '#6b7280', marginTop: '1rem' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.products.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.image || 'https://via.placeholder.com/100'}
                alt={item.product.name}
                className="cart-item-image"
              />
              
              <div className="cart-item-info">
                <Link to={`/product/${item.product._id}`}>
                  <h3 className="cart-item-name">{item.product.name}</h3>
                </Link>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
                
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.product._id, item.quantity - 1);
                      }
                    }}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 0.5rem' }}>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: '600' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
          
          <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
            Proceed to Checkout
          </Link>
          
          <Link to="/" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          E-Shop
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          
          <Link to="/cart" className="navbar-link navbar-cart">
            Cart
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="navbar-link">
                  Admin
                </Link>
              )}
              <Link to="/orders" className="navbar-link">
                Orders
              </Link>
              <div className="navbar-user">
                <button
                  className="navbar-link"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {user?.name}
                </button>
                {showDropdown && (
                  <div className="user-dropdown">
                    <button onClick={handleLogout} className="btn btn-outline btn-sm">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

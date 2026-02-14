import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) return;
    
    setAdding(true);
    const result = await addToCart(product._id, 1);
    setAdding(false);
    
    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <span>⭐ {product.ratings?.toFixed(1) || '0.0'}</span>
          <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
            ({product.numOfReviews || 0} reviews)
          </span>
        </div>
        <p className="product-price">${product.price?.toFixed(2)}</p>
        {product.stock > 0 ? (
          <span style={{ color: '#10b981', fontSize: '0.75rem' }}>In Stock</span>
        ) : (
          <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>Out of Stock</span>
        )}
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '10px',
            backgroundColor: added ? '#10b981' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
            opacity: adding ? 0.7 : 1,
          }}
        >
          {adding ? 'Adding...' : added ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

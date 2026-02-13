import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
      </div>
    </div>
  );
};

export default ProductCard;

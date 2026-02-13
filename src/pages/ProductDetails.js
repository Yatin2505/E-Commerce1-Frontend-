import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.message);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      await productAPI.addReview(product._id, reviewData);
      alert('Review added successfully!');
      fetchProduct();
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="alert alert-error">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
        {/* Product Image */}
        <div>
          <img
            src={product.image || 'https://via.placeholder.com/500'}
            alt={product.name}
            style={{ width: '100%', borderRadius: '0.75rem' }}
          />
        </div>

        {/* Product Info */}
        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{product.name}</h1>
          
          <div className="product-rating" style={{ marginTop: '1rem' }}>
            <span>⭐ {product.ratings?.toFixed(1) || '0.0'}</span>
            <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
              ({product.numOfReviews || 0} reviews)
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', color: '#2563eb', marginTop: '1rem' }}>
            ${product.price?.toFixed(2)}
          </h2>

          <p style={{ marginTop: '1rem', color: '#6b7280' }}>
            {product.description}
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            {product.stock > 0 ? (
              <span style={{ color: '#10b981', fontWeight: '600' }}>In Stock ({product.stock} available)</span>
            ) : (
              <span style={{ color: '#ef4444', fontWeight: '600' }}>Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ fontWeight: '500', marginRight: '1rem' }}>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                style={{ padding: '0.5rem', width: '80px', borderRadius: '0.25rem', border: '1px solid #e5e7eb' }}
              />
            </div>
          )}

          {/* Add to Cart Button */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-lg"
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Reviews</h2>
        
        {/* Add Review Form */}
        <form onSubmit={handleSubmitReview} style={{ marginBottom: '2rem', background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: '1rem' }}>Write a Review</h3>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <select
              className="form-input"
              value={reviewData.rating}
              onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) })}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea
              className="form-input"
              rows="3"
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        {product.reviews?.length > 0 ? (
          <div>
            {product.reviews.map((review, index) => (
              <div key={index} style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{review.name}</strong>
                  <span>⭐ {review.rating}</span>
                </div>
                <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>{review.comment}</p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

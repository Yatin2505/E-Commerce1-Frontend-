import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, keyword, category };
      const response = await productAPI.getProducts(params);
      setProducts(response.data.products);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchKeyword = formData.get('keyword');
    setSearchParams({ keyword: searchKeyword, page: '1' });
  };

  const handlePageChange = (newPage) => {
    const params = { page: newPage.toString() };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    setSearchParams(params);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to E-Shop</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          name="keyword"
          placeholder="Search products..."
          className="search-input"
          defaultValue={keyword}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Category Filter */}
      <div className="category-filter" style={{ marginBottom: '1.5rem' }}>
        <button
          className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSearchParams({ keyword, page: '1' })}
        >
          All
        </button>
        {['electronics', 'clothing', 'books', 'home', 'sports'].map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSearchParams({ category: cat, keyword, page: '1' })}
            style={{ marginLeft: '0.5rem' }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <h2>No products found</h2>
              <p>Try adjusting your search or filter</p>
            </div>
          ) : (
            <>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                Showing {products.length} of {pagination.total} products
              </p>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`page-btn ${pagination.page === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                className="page-btn"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

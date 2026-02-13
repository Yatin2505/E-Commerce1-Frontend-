import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      processing: '#f59e0b',
      shipped: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
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

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem' }}>
          <h2>No orders yet</h2>
          <p style={{ color: '#6b7280', marginTop: '1rem' }}>
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <div>
                  <p style={{ fontWeight: '600' }}>Order ID: {order._id}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: `${getStatusColor(order.orderStatus)}20`,
                      color: getStatusColor(order.orderStatus),
                    }}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '1rem' }}>
                {order.products.map((item) => (
                  <div
                    key={item.product}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', borderRadius: '0.25rem', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '500' }}>{item.name}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p style={{ fontWeight: '600' }}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <span style={{ fontWeight: '600' }}>Total</span>
                <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

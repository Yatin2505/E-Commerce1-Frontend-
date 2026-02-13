import React from 'react';

const Loader = ({ size = 'medium', color = '#2563eb' }) => {
  const sizeStyles = {
    small: { width: '20px', height: '20px', borderWidth: '2px' },
    medium: { width: '40px', height: '40px', borderWidth: '3px' },
    large: { width: '60px', height: '60px', borderWidth: '4px' },
  };

  const style = sizeStyles[size] || sizeStyles.medium;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div
        style={{
          ...style,
          border: `${style.borderWidth} solid rgba(0, 0, 0, 0.1)`,
          borderRadius: '50%',
          borderTopColor: color,
          animation: 'spin 1s ease-in-out infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;

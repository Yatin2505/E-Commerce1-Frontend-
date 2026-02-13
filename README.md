# E-Commerce Frontend

A React-based frontend for the MERN stack eCommerce website.

## Tech Stack

- **Framework:** React
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Context API

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminRoute.js      # Admin route protection
│   │   ├── Footer.js          # Footer component
│   │   ├── Loader.js          # Loading spinner
│   │   ├── Navbar.js          # Navigation bar
│   │   ├── ProductCard.js     # Product display card
│   │   └── ProtectedRoute.js  # Protected route wrapper
│   ├── context/
│   │   ├── AuthContext.js     # Authentication state
│   │   └── CartContext.js     # Cart state
│   ├── pages/
│   │   ├── AdminDashboard.js  # Admin dashboard
│   │   ├── Cart.js            # Shopping cart
│   │   ├── Checkout.js        # Checkout page
│   │   ├── Home.js            # Home page with products
│   │   ├── Login.js           # Login page
│   │   ├── Orders.js          # User orders
│   │   ├── ProductDetails.js  # Product details
│   │   └── Register.js        # Registration page
│   ├── services/
│   │   └── api.js             # API configuration
│   ├── App.css
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
└── README.md
```

## Features

- **Product Listing:** Browse products with search and category filtering
- **Pagination:** Navigate through multiple pages of products
- **Product Details:** View detailed product information and reviews
- **Shopping Cart:** Add, remove, and update product quantities
- **Checkout:** Place orders with shipping information
- **User Orders:** View order history and status
- **Admin Dashboard:** Manage products and orders
- **Authentication:** JWT-based login and registration
- **Protected Routes:** Secure access to user-specific pages

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install Dependencies**
   
```
bash
   cd frontend
   npm install
   
```

2. **Start the Development Server**
   
```
bash
   npm start
   
```

   The app will open at `http://localhost:3000`

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`.

To change the API URL, edit `src/services/api.js`:

```
javascript
const API_URL = 'http://localhost:5000/api';
```

## Connecting to Backend

Make sure the backend server is running at `http://localhost:5000` before starting the frontend.

For the backend setup, see the [backend README](../backend/README.md).

## Pages

### Home Page
- Displays all products with pagination
- Search functionality
- Category filtering

### Product Details Page
- Product information
- Add to cart
- Product reviews

### Login/Register Pages
- User authentication
- JWT token management

### Cart Page
- View cart items
- Update quantities
- Remove items
- View total

### Checkout Page
- Shipping information form
- Payment method selection
- Order placement

### Orders Page
- View order history
- Track order status

### Admin Dashboard
- Manage products (add/delete)
- Manage orders (update status)

## Environment Variables

The frontend uses the following environment variables (if needed):

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Building for Production

```
bash
npm run build
```

The production build will be in the `build` folder.

## Troubleshooting

### CORS Errors
If you encounter CORS errors, make sure the backend has the correct CORS configuration and the frontend API URL is correct.

### Connection Refused
Ensure the backend server is running before starting the frontend. The backend should be running on port 5000.

### Token Issues
If you experience authentication issues:
1. Clear browser localStorage
2. Log out and log back in
3. Check the backend JWT_SECRET configuration

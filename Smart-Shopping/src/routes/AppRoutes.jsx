import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ShoppingDashboardPage from '../pages/ShoppingDashboardPage';
import ShopPage from '../pages/ShopPage';
import CategoryPage from '../pages/CategoryPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Pages (Accessible to unauthenticated visitors) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. Authentication-First Protected Pages (Redirects unauthenticated visitors to /login) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ShoppingDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute>
            <ShopPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/category/:categoryName"
        element={
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <ProductDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-confirmation/:orderId"
        element={
          <ProtectedRoute>
            <OrderConfirmationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

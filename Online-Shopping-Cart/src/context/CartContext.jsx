import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { cartReducer, initialState } from '../reducer/cartReducer';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Derived state calculations
  const calculateCartQuantity = () => state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const calculateSubtotal = () => state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const calculateDiscount = (subtotal) => (subtotal * state.discountPercentage) / 100;
  
  const cartItemCount = calculateCartQuantity();
  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount(subtotal);
  const totalAfterDiscount = subtotal - discountAmount;
  
  // 18% GST calculation
  const calculateGST = (amount) => amount * 0.18;
  const gstAmount = calculateGST(totalAfterDiscount);
  
  const calculateGrandTotal = () => totalAfterDiscount + gstAmount;
  const grandTotal = calculateGrandTotal();

  const value = {
    ...state,
    dispatch,
    cartItemCount,
    subtotal,
    discountAmount,
    totalAfterDiscount,
    gstAmount,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook for easier access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

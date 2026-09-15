import React from 'react';
import { useCart } from '../context/CartContext';

const CartSummary = () => {
  const { subtotal, discountAmount, gstAmount, grandTotal, discountPercentage, couponCode, dispatch } = useCart();

  const handleRemoveCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  return (
    <div className="summary-section">
      <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
      
      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toLocaleString('en-IN')}</span>
      </div>
      
      {discountPercentage > 0 && (
        <div className="summary-row discount">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Coupon ({couponCode})
            <button 
              onClick={handleRemoveCoupon} 
              style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Remove
            </button>
          </span>
          <span>- ₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      )}
      
      <div className="summary-row">
        <span>GST (18%)</span>
        <span>₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-total">
        <span>Grand Total</span>
        <span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
      </div>
      
      <button 
        className="btn-primary checkout-btn" 
        onClick={() => alert("Demo checkout — payment integration is not included.")}
      >
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;

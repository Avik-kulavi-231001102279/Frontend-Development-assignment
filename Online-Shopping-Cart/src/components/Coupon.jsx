import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Tag } from 'lucide-react';

const Coupon = () => {
  const { dispatch, couponCode, discountPercentage } = useCart();
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const codeUpper = inputCode.trim().toUpperCase();
    
    if (codeUpper === 'SAVE10' || codeUpper === 'SAVE20') {
      dispatch({ type: 'APPLY_COUPON', payload: { code: codeUpper } });
      setErrorMsg('');
      setInputCode('');
    } else {
      setErrorMsg('Invalid coupon code!');
    }
  };

  return (
    <div className="coupon-section">
      <form className="coupon-input-group" onSubmit={handleApplyCoupon}>
        <input
          type="text"
          className="coupon-input"
          placeholder="Enter Coupon (e.g. SAVE10)"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        />
        <button type="submit" className="btn-secondary">Apply</button>
      </form>
      
      {errorMsg && <p className="coupon-msg error">{errorMsg}</p>}
      
      {couponCode && (
        <p className="coupon-msg success">
          <Tag size={12} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}/>
          {couponCode} applied! ({discountPercentage}% off)
        </p>
      )}
    </div>
  );
};

export default Coupon;

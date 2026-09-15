import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import Coupon from './Coupon';
import CartSummary from './CartSummary';
import EmptyState from './EmptyState';

const Cart = ({ setCurrentView }) => {
  const { cartItems, dispatch } = useCart();

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  if (cartItems.length === 0) {
    return <EmptyState type="cart" action={() => setCurrentView('home')} />;
  }

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
        <div className="cart-header">
          <h2 className="cart-title">
            <ShoppingBag size={22} color="var(--accent-primary)" />
            Your Cart
          </h2>
          <button className="clear-btn" onClick={handleClearCart}>
            <X size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Clear Cart
          </button>
        </div>

        <div className="cart-items-container" style={{ maxHeight: 'none', overflowY: 'visible' }}>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div style={{ flex: '1 1 35%', minWidth: '300px', position: 'sticky', top: '100px' }}>
        <Coupon />
        <CartSummary />
      </div>
    </div>
  );
};

export default Cart;

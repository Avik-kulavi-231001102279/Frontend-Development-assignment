import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { dispatch } = useCart();

  const handleIncrease = () => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: item.id });
  };

  const handleDecrease = () => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: item.id });
  };

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
  };

  return (
    <div className="cart-item animate-pop-in">
      <img src={item.image} alt={item.name} className="cart-item-img" />
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</p>
        <div className="quantity-controls">
          <button className="qty-btn" onClick={handleDecrease} disabled={item.quantity <= 1}>
            <Minus size={14} />
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
            {item.quantity}
          </span>
          <button className="qty-btn" onClick={handleIncrease}>
            <Plus size={14} />
          </button>
        </div>
      </div>
      <button className="remove-btn" onClick={handleRemove} title="Remove Item">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;

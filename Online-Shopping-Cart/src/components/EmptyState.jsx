import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

const EmptyState = ({ type, action }) => {
  const isCart = type === 'cart';

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        {isCart ? <ShoppingBag size={64} opacity={0.5} /> : <Heart size={64} opacity={0.5} />}
      </div>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Your {isCart ? 'cart' : 'wishlist'} is empty
      </h2>
      <p style={{ marginBottom: '2rem' }}>
        {isCart ? 'Add some products to your cart and start shopping.' : 'Save items you love to your wishlist.'}
      </p>
      {action && (
        <button className="btn-primary" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={action}>
          Continue Shopping
        </button>
      )}
    </div>
  );
};

export default EmptyState;

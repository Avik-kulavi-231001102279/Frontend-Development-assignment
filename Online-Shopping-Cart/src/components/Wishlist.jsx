import React from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

const Wishlist = ({ setCurrentView }) => {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return <EmptyState type="wishlist" action={() => setCurrentView('home')} />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Your Wishlist</h2>
      <div className="product-grid">
        {wishlist.map((product, index) => (
          <div 
            key={product.id} 
            className="stagger-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard product={product} inWishlistView={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

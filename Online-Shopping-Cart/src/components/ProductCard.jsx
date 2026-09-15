import React, { useState } from 'react';
import { ShoppingCart, Plus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, inWishlistView = false }) => {
  const { wishlist, dispatch } = useCart();
  const [showToast, setShowToast] = useState(false);

  const isLiked = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleToggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  return (
    <div className="product-card animate-pop-in">
      <div className="product-image-container">
        <span className="product-category">{product.category}</span>
        <button 
          className="btn-icon" 
          onClick={handleToggleWishlist}
          style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--glass-bg)', zIndex: 10 }}
        >
          <Heart size={20} fill={isLiked ? "var(--error-color)" : "transparent"} color={isLiked ? "var(--error-color)" : "var(--text-primary)"} />
        </button>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: 'auto' }}>
          <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>⭐ {product.rating}</span>
        </div>
        
        <button className="btn-primary" onClick={handleAddToCart}>
          {showToast ? 'Added to Cart!' : <><Plus size={18} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

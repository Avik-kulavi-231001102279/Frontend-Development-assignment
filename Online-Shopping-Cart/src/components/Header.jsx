import React from 'react';
import { ShoppingBag, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = ({ currentView, setCurrentView }) => {
  const { cartItemCount, theme, dispatch } = useCart();

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="header">
      <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('home')}>
        <ShoppingBag size={28} color="#6366f1" />
        <span>SHOPCART</span>
      </div>
      
      <nav className="nav-links">
        <button 
          className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button 
          className={`nav-link ${currentView === 'wishlist' ? 'active' : ''}`}
          onClick={() => setCurrentView('wishlist')}
        >
          Wishlist
        </button>
        
        <div className="cart-icon-wrapper" onClick={() => setCurrentView('cart')}>
          <ShoppingBag size={20} />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </div>
        
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>
    </header>
  );
};

export default Header;

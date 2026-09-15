import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import SortDropdown from './components/SortDropdown';
import { CartProvider } from './context/CartContext';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, cart, wishlist
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  return (
    <CartProvider>
      <div className="app-container">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="main-content" style={{ display: 'block' }}>
          
          {/* Controls visible only on Home/Products view */}
          {currentView === 'home' && (
            <div className="controls-bar animate-slide-in">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <CategoryFilter category={category} setCategory={setCategory} />
              <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
          )}

          {currentView === 'home' && (
            <ProductList 
              searchQuery={searchQuery} 
              category={category} 
              sortOrder={sortOrder} 
            />
          )}

          {currentView === 'cart' && <Cart setCurrentView={setCurrentView} />}
          
          {currentView === 'wishlist' && <Wishlist setCurrentView={setCurrentView} />}

        </main>
      </div>
    </CartProvider>
  );
}

export default App;

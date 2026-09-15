import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
      <Search 
        size={18} 
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
      />
      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ paddingLeft: '38px', width: '100%' }}
      />
    </div>
  );
};

export default SearchBar;

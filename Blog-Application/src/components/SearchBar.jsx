import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search by title, author, or keywords...'
}) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <Search className="search-icon" size={19} />
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search blog posts"
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search query"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}


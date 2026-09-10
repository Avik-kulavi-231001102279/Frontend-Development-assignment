import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const RecentSearches = ({ searches, onCityClick }) => {
  if (!searches || searches.length === 0) {
    return (
      <div className="recent-searches glass-panel">
        <h3>Recent Searches</h3>
        <p className="no-searches">No recent searches yet.</p>
      </div>
    );
  }

  return (
    <div className="recent-searches glass-panel">
      <h3>
        <Clock size={18} /> Recent Searches
      </h3>
      <ul className="search-list">
        {searches.map((search, index) => (
          <li key={search._id || index} className="search-item">
            <button 
              onClick={() => onCityClick(search.city)}
              className="recent-city-btn"
            >
              <MapPin size={14} />
              <span>{search.city}, {search.country}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;

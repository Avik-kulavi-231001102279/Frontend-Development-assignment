import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search city, town or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search location"
      />
      <button type="submit" aria-label="Search" disabled={!query.trim()}>
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;

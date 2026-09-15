import React from 'react';

const SortDropdown = ({ sortOrder, setSortOrder }) => {
  return (
    <select 
      className="sort-select"
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
    >
      <option value="default">Sort By: Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
    </select>
  );
};

export default SortDropdown;

import React from 'react';

const CategoryFilter = ({ category, setCategory }) => {
  const categories = ['All', 'Fashion', 'Electronics', 'Footwear', 'Accessories'];

  return (
    <select 
      className="filter-select"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
};

export default CategoryFilter;

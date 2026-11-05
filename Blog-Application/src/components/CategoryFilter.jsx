import React from 'react';
import { CATEGORIES } from '../utils/helpers';

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {}
}) {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="category-filter-container" role="tablist" aria-label="Blog categories">
      <div className="category-scroll-track">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All' ? categoryCounts.total : categoryCounts[cat];

          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <span>{cat}</span>
              {typeof count === 'number' && (
                <span className="category-count-badge">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


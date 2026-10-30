import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, count, showCount = true, size = 'sm' }) => {
  const numericRating = Number(rating) || 0;
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentSize = starSizes[size] || starSizes.sm;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${numericRating.toFixed(1)} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.round(numericRating);
          return (
            <Star
              key={starIndex}
              className={`${currentSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {numericRating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default RatingStars;

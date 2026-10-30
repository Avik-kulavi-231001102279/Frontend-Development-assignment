import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { addToast, selectCurrency } from '../../features/preferences/preferenceSlice';
import { formatPrice } from '../../utils/currency';
import RatingStars from '../common/RatingStars';
import { ShoppingCart, Eye, Check } from 'lucide-react';

export const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(
      addToast({
        message: `Added "${product.title.slice(0, 32)}..." to your cart!`,
        type: 'success',
      })
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const fallbackImage = `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(
    product.title.slice(0, 16)
  )}`;

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/80 transition-all duration-300">
        <Link
          to={`/product/${product.id}`}
          className="relative w-full sm:w-48 h-48 rounded-xl bg-white p-4 flex items-center justify-center overflow-hidden shrink-0"
        >
          <img
            src={imageError ? fallbackImage : product.image}
            alt={product.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            {product.category}
          </span>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {product.category}
              </span>
              <RatingStars
                rating={product.rating?.rate}
                count={product.rating?.count}
                size="xs"
              />
            </div>

            <Link to={`/product/${product.id}`}>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(product.price, currency)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/product/${product.id}`}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (Default)
  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-4 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/80 transition-all duration-300 overflow-hidden">
      {/* Category Pill */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider truncate max-w-[150px]">
          {product.category}
        </span>
        {product.rating?.rate >= 4.5 && (
          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
            ★ Top Rated
          </span>
        )}
      </div>

      {/* Image Area */}
      <Link
        to={`/product/${product.id}`}
        className="relative w-full h-52 my-2 rounded-xl bg-white dark:bg-white p-4 flex items-center justify-center overflow-hidden"
      >
        <img
          src={imageError ? fallbackImage : product.image}
          alt={product.title}
          onError={() => setImageError(true)}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between pt-2">
        <div>
          <div className="mb-2">
            <RatingStars
              rating={product.rating?.rate}
              count={product.rating?.count}
              size="xs"
            />
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[40px] mb-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {formatPrice(product.price, currency)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory, fetchProducts } from '../features/products/productThunks';
import {
  selectSortedCategoryProducts,
  selectProductsStatus,
  selectProductsError,
  selectAllProducts,
} from '../features/products/productSelectors';
import { selectViewMode } from '../features/preferences/preferenceSlice';
import ProductGrid from '../components/products/ProductGrid';
import SortDropdown from '../components/products/SortDropdown';
import { ArrowLeft, Layers } from 'lucide-react';

const categoryDescriptions = {
  electronics: 'Cutting-edge personal electronics, high-capacity solid state drives, and high-resolution IPS gaming monitors.',
  jewelery: 'Timeless luxury fine jewelry, precious gold bracelets, sparkling engagement rings, and classic double flared plugs.',
  "men's clothing": 'Versatile outerwear, premium cotton henley tees, rugged all-weather backpacks, and modern slim-fit apparel.',
  "women's clothing": 'Fashion-forward windbreakers, removable hooded moto biker jackets, 3-in-1 snowboard coats, and comfortable casual wear.',
};

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const decodedCategory = decodeURIComponent(categoryName || '');

  const allProducts = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const viewMode = useSelector(selectViewMode);

  // Sorted products for this specific category
  const categoryProducts = useSelector((state) =>
    selectSortedCategoryProducts(state, decodedCategory)
  );

  useEffect(() => {
    if (decodedCategory) {
      dispatch(fetchProductsByCategory(decodedCategory));
    }
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, decodedCategory, allProducts.length]);

  const handleRetry = () => {
    dispatch(fetchProductsByCategory(decodedCategory));
  };

  const isLoading = status === 'loading' && categoryProducts.length === 0;
  const description =
    categoryDescriptions[decodedCategory.toLowerCase()] ||
    `Browse all items in ${decodedCategory}.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="pt-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Collection</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-black capitalize tracking-tight">
            {decodedCategory}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Decorative blur */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{categoryProducts.length}</strong> items in this category
        </span>

        <SortDropdown />
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={categoryProducts}
        loading={isLoading}
        error={error}
        onRetry={handleRetry}
        viewMode={viewMode}
        itemsPerPage={12}
        enablePagination={true}
        emptyTitle={`No products found in ${decodedCategory}`}
        emptyDescription="We couldn't find items in this category right now."
      />
    </div>
  );
};

export default CategoryPage;

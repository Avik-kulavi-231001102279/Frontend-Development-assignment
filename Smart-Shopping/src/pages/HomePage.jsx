import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../features/products/productThunks';
import {
  selectAllProducts,
  selectBestSellingProducts,
  selectTrendingProducts,
  selectNewArrivals,
  selectCategories,
  selectProductsStatus,
  selectProductsError,
} from '../features/products/productSelectors';
import HeroSection from '../components/products/HeroSection';
import CategoryCard from '../components/products/CategoryCard';
import ProductGrid from '../components/products/ProductGrid';
import {
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export const HomePage = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const bestSellers = useSelector(selectBestSellingProducts);
  const trending = useSelector(selectTrendingProducts);
  const newArrivals = useSelector(selectNewArrivals);
  const categories = useSelector(selectCategories);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (allProducts.length === 0 && status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, allProducts.length, status]);

  const handleRetry = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  };

  const isLoading = status === 'loading';

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section aria-label="Hero Banner">
        <HeroSection />
      </section>

      {/* 2. Featured Categories Section */}
      <section aria-label="Featured Categories" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Browse by Department</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((cat) => <CategoryCard key={cat} category={cat} />)
          ) : (
            ['electronics', 'jewelery', "men's clothing", "women's clothing"].map((cat) => (
              <CategoryCard key={cat} category={cat} />
            ))
          )}
        </div>
      </section>

      {/* 3. Promotional Banner / Special Offers */}
      <section aria-label="Special Offers">
        <div className="relative rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-800 p-8 sm:p-12 text-white shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Percent className="w-3.5 h-3.5 text-amber-300" />
              Limited Time Promo
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Save Up to 20% on First Order
            </h2>
            <p className="text-slate-200 text-sm">
              Use code <strong className="font-mono text-amber-300 font-extrabold">SHOPSPHERE20</strong> for instant savings on luxury items, top electronics, and trendy outfits.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/shop"
              className="px-7 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              Claim Discount Now
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Trending Products */}
      <section aria-label="Trending Products" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Hot Picks Right Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Trending Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={trending}
          loading={isLoading}
          error={error}
          onRetry={handleRetry}
          itemsPerPage={4}
          enablePagination={false}
        />
      </section>

      {/* 5. Best Selling Products */}
      <section aria-label="Best Selling Products" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Best Selling Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>See Best Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={bestSellers}
          loading={isLoading}
          error={error}
          onRetry={handleRetry}
          itemsPerPage={4}
          enablePagination={false}
        />
      </section>

      {/* 6. New Arrivals */}
      <section aria-label="New Arrivals" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Freshly Added</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Browse New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={newArrivals}
          loading={isLoading}
          error={error}
          onRetry={handleRetry}
          itemsPerPage={4}
          enablePagination={false}
        />
      </section>
    </div>
  );
};

export default HomePage;

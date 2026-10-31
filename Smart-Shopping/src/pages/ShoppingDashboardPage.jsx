import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { selectCartItemCount } from '../features/cart/cartSelectors';
import { selectAllOrders } from '../features/orders/orderSelectors';
import {
  selectAllProducts,
  selectBestSellingProducts,
  selectTrendingProducts,
  selectCategories,
  selectProductsStatus,
  selectProductsError,
} from '../features/products/productSelectors';
import { fetchProducts, fetchCategories } from '../features/products/productThunks';
import CategoryCard from '../components/products/CategoryCard';
import ProductGrid from '../components/products/ProductGrid';
import {
  ShoppingBag,
  ShoppingCart,
  Package,
  Layers,
  Sparkles,
  TrendingUp,
  ArrowRight,
  User,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export const ShoppingDashboardPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const cartItemCount = useSelector(selectCartItemCount);
  const orders = useSelector(selectAllOrders);

  const allProducts = useSelector(selectAllProducts);
  const bestSellers = useSelector(selectBestSellingProducts);
  const trending = useSelector(selectTrendingProducts);
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
    <div className="space-y-12 pb-16">
      {/* 1. Welcome User Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 sm:p-10 shadow-xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Logged In • Shopping Dashboard Active</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {currentUser?.name || 'Shopper'}!
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-xl">
              Explore your personalized catalog, discover new collections, and enjoy member discounts across all categories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-600" />
              <span>Browse All Products</span>
            </Link>

            <Link
              to="/cart"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cartItemCount})</span>
            </Link>
          </div>
        </div>

        {/* Quick User Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-lg font-black">{cartItemCount}</p>
              <p className="text-[11px] text-slate-300">Items in Cart</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-lg font-black">{orders.length}</p>
              <p className="text-[11px] text-slate-300">Total Orders Placed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-lg font-black font-mono">₹ INR</p>
              <p className="text-[11px] text-slate-300">Active Currency</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-lg font-black">100%</p>
              <p className="text-[11px] text-slate-300">Member Security</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT CATEGORIES (Step 4 of User Journey) */}
      <section aria-label="Product Categories" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Step 4: Explore Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Product Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a category to view department-specific products.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Inventory</span>
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

      {/* 3. FEATURED PRODUCTS HIGHLIGHT */}
      <section aria-label="Featured Products" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Products (₹ INR)
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Shop All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={bestSellers.length > 0 ? bestSellers.slice(0, 4) : allProducts.slice(0, 4)}
          loading={isLoading}
          error={error}
          onRetry={handleRetry}
          itemsPerPage={4}
          enablePagination={false}
        />
      </section>

      {/* 4. POPULAR PICKS */}
      <section aria-label="Popular Picks" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Highest Rated by Shoppers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Customer Favorites
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Browse All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid
          products={trending.length > 0 ? trending.slice(0, 4) : allProducts.slice(4, 8)}
          loading={isLoading}
          error={error}
          onRetry={handleRetry}
          itemsPerPage={4}
          enablePagination={false}
        />
      </section>

      {/* 5. Quick Navigation Dashboard Shortcuts */}
      <section aria-label="Account Shortcuts" className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <Link
            to="/shop"
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Shop Catalog</h4>
            <p className="text-[11px] text-slate-500">Filter, sort, and search all inventory</p>
          </Link>

          <Link
            to="/orders"
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
          >
            <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Order History</h4>
            <p className="text-[11px] text-slate-500">Track and view previous purchases</p>
          </Link>

          <Link
            to="/profile"
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors"
          >
            <User className="w-6 h-6 text-violet-600 dark:text-violet-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Profile Settings</h4>
            <p className="text-[11px] text-slate-500">Manage your address and account details</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShoppingDashboardPage;

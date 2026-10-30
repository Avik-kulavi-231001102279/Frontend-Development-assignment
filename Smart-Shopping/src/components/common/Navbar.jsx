import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemCount } from '../../features/cart/cartSelectors';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import { selectCurrency, setCurrency, addToast } from '../../features/preferences/preferenceSlice';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  Package,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemCount = useSelector(selectCartItemCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const currency = useSelector(selectCurrency);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ message: 'Successfully signed out.', type: 'info' }));
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleCurrencyToggle = () => {
    const nextCurrency = currency === 'USD' ? 'INR' : 'USD';
    dispatch(setCurrency(nextCurrency));
    dispatch(
      addToast({
        message: `Currency switched to ${nextCurrency} (${nextCurrency === 'INR' ? '₹' : '$'})`,
        type: 'info',
        duration: 2000,
      })
    );
  };

  const categories = [
    { name: 'All Categories', path: '/shop' },
    { name: 'Electronics', path: '/category/electronics' },
    { name: 'Jewelry', path: '/category/jewelery' },
    { name: "Men's Clothing", path: "/category/men's clothing" },
    { name: "Women's Clothing", path: "/category/women's clothing" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 focus:outline-none"
            aria-label="ShopSphere Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-200 bg-clip-text text-transparent">
                ShopSphere
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 hidden sm:block">
                Smart Shopping
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar className="w-full" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              Shop
            </NavLink>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                onBlur={() => setTimeout(() => setCategoriesDropdownOpen(false), 200)}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                aria-expanded={categoriesDropdownOpen}
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl glass-card shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Switcher */}
            <button
              onClick={handleCurrencyToggle}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Click to toggle currency between USD and INR"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Cart Icon with Live Counter */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all active:scale-95 shadow-sm"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 200)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer"
                  aria-label="User menu"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={
                      currentUser?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`
                    }
                    alt={currentUser?.name || 'User'}
                    className="w-7 h-7 rounded-lg object-cover bg-indigo-100"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:block max-w-[90px] truncate">
                    {currentUser?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-card shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                    >
                      <Package className="w-4 h-4 text-indigo-500" />
                      My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      My Profile
                    </Link>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar className="w-full" />
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-3">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
              >
                All Products
              </Link>

              <div className="pt-2 pl-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Categories
              </div>
              {categories.slice(1).map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                >
                  {cat.name}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="pt-2 pl-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    My Account
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    Order History
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    User Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

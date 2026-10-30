import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../../features/preferences/preferenceSlice';
import {
  ShoppingBag,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Heart,
  ArrowRight,
} from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      dispatch(
        addToast({
          message: 'Please enter a valid email address to subscribe.',
          type: 'error',
        })
      );
      return;
    }
    dispatch(
      addToast({
        message: '🎉 Thank you for subscribing to ShopSphere newsletter! Enjoy 10% off with code WELCOME10.',
        type: 'success',
      })
    );
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors mt-auto">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Fast & Free Shipping
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Free delivery on all orders over $100
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  100% Safe Checkout
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulated multi-tier encrypted payment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  30-Day Easy Returns
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hassle-free money-back guarantee
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  24/7 Dedicated Support
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Friendly support agents always ready
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                ShopSphere
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Smart Shopping. Seamless Experience. Discover curated electronics, premium apparel, and timeless jewelry with guaranteed satisfaction and fast delivery.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <span>⚡ Redux Toolkit Academic Project</span>
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/category/electronics" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/jewelery" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Jewelry & Watches
                </Link>
              </li>
              <li>
                <Link to="/category/men's clothing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/category/women's clothing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Women's Wear
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  Browse All &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Customer Area
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/cart" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Stay in the Loop
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Subscribe to unlock flash promotions and exclusive drops.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using React.js & Redux Toolkit
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

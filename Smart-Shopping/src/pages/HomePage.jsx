import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { addToast } from '../features/preferences/preferenceSlice';
import HeroSection from '../components/products/HeroSection';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  Mail,
  Send,
  UserPlus,
  CreditCard,
  Layers,
  Zap,
  Lock,
  Tag,
  Star,
  Quote,
  Building2,
  Phone,
} from 'lucide-react';

export const HomePage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
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
        message: '🎉 Welcome to ShopSphere VIP Circle! You unlocked 10% off with coupon: WELCOME10',
        type: 'success',
      })
    );
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section (No products, premium visual, auth CTAs) */}
      <section aria-label="Hero Banner">
        <HeroSection />
      </section>

      {/* 2. About ShopSphere Section */}
      <section id="about" aria-label="About ShopSphere" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About ShopSphere</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Reinventing Online Shopping for Modern India
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            ShopSphere is a premier digital marketplace built with state-of-the-art web technology. We bring together curated collections of contemporary fashion, high-performance electronics, and fine jewelry with 100% transparent pricing in Indian Rupees (₹).
          </p>
        </div>

        {/* Brand Mission & Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center space-y-2">
            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">50,000+</p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Satisfied Shoppers</h3>
            <p className="text-xs text-slate-500">Delivering smiles across 19,000+ PIN codes nationwide.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center space-y-2">
            <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Verified Quality</h3>
            <p className="text-xs text-slate-500">Rigorous inspection and authentic product guarantees.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center space-y-2">
            <p className="text-4xl font-black text-violet-600 dark:text-violet-400">₹ INR</p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Direct Rupee Pricing</h3>
            <p className="text-xs text-slate-500">No hidden conversion markups or surprise billing charges.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-center space-y-2">
            <p className="text-4xl font-black text-amber-500 dark:text-amber-400">24/7</p>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Dedicated Care</h3>
            <p className="text-xs text-slate-500">Always accessible customer assistance whenever needed.</p>
          </div>
        </div>
      </section>

      {/* 3. Why Choose ShopSphere (Shopping Benefits) */}
      <section aria-label="Why Choose ShopSphere" className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Peace of Mind</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Choose ShopSphere
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Enjoy world-class service, transparent policies, and total reliability from checkout to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pan-India Express Delivery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Fast, reliable shipping dispatched via premier logistics partners with real-time tracking updates directly to your doorstep.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              100% Safe Payments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-tier protected transactions supporting UPI (GPay, PhonePe, Paytm), Net Banking, Debit/Credit Cards, and Cash on Delivery.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              30-Day Easy Returns
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Not completely satisfied? Initiate a fast replacement or full refund within 30 days with hassle-free pickup from your address.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Authenticity Guaranteed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every single product cataloged is sourced from trusted suppliers, complete with standard warranty and quality verification.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Exclusive Member Discounts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Apply coupon codes like WELCOME10 and SHOPSPHERE20 directly in your cart for immediate percentage or flat reductions.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              24/7 Dedicated Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our responsive customer experience specialists are ready around the clock to assist you with inquiries, sizing, and order tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Key Features Section */}
      <section id="features" aria-label="Key Features" className="scroll-mt-24 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>State-of-the-Art Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Key Platform Features
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Built from the ground up using React.js and Redux Toolkit for instantaneous responsiveness and state synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Normalized Entity Management</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Leverages Redux Toolkit&apos;s createEntityAdapter for optimal O(1) product lookups, automated sorting, and normalized CRUD operations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Tag className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Cart & Formula Calculations</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Memoized createSelector calculates: Final Price = Subtotal - Discount + Tax + Shipping in real time with coupon validations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Structured 6-Step Checkout</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Guided progression through Cart Review, Customer Info, Shipping Address, Payment Method, Order Review, and Instant Confirmation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Persistent LocalStorage State</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Custom persistence middleware safely preserves your cart, login session, theme preference, and complete order history across reloads.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Multi-Attribute Filtering</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Seamlessly combines keyword search, category filters, price range sliders, and minimum customer ratings with 5 sort modes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Indian Rupee Currency Core</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standardized ₹ INR conversion and Indian number formatting (₹1,299.00) applied consistently across inventory, cart, and orders.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section (Explaining the Shopping Journey) */}
      <section id="how-it-works" aria-label="How It Works" className="scroll-mt-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>The Shopping Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How ShopSphere Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Follow our intuitive authentication-first journey designed to protect your orders and deliver a personalized shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create an Account
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Register with your name and secure password, then log in to unlock full access to the shopping portal.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Browse Dashboard & Categories
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore Electronics, Fashion, and Jewelry. Search, sort, and filter products with live ₹ INR pricing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add to Cart & Apply Coupons
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review quantities, apply promo codes like WELCOME10, and see live tax and free shipping calculations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-600/30">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Checkout & Track Orders
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete the 6-step checkout with simulated UPI or COD and monitor your order history in real time.
            </p>
          </div>
        </div>

        {/* Journey CTA Banner */}
        <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-indigo-950 dark:text-indigo-200">
              Ready to start your shopping journey?
            </h3>
            <p className="text-xs text-indigo-700 dark:text-indigo-400">
              Join thousands of happy customers and discover high-quality products today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Go to Shopping Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-50 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials Section */}
      <section aria-label="Customer Testimonials" className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved by Shoppers Across India
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Read what our genuine customers have to say about their ShopSphere experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;The ₹ INR transparent pricing is fantastic! No confusing conversions. The ordering process was seamless, and my jacket arrived within 3 days in pristine packaging.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                PS
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Priya Sharma</p>
                <p className="text-[11px] text-slate-400">Bengaluru, Karnataka • Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;I was very impressed by the 6-step checkout workflow and instant order updates. The coupon code WELCOME10 saved me money right at checkout!&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                RP
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Rajesh Patel</p>
                <p className="text-[11px] text-slate-400">Mumbai, Maharashtra • Verified Buyer</p>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="w-8 h-8 text-indigo-300 dark:text-indigo-700" />
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;The simulated order progression and tracking in Order History is so well thought out. The electronics I bought worked right out of the box with zero flaws.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Ananya Iyer</p>
                <p className="text-[11px] text-slate-400">Chennai, Tamil Nadu • Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription UI */}
      <section aria-label="Newsletter Subscription">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Join Our Exclusive VIP Circle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Subscribe today to unlock an instant 10% coupon code (WELCOME10) for your first order, plus early member drops.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 8. Quick Contact Information */}
      <section id="contact" aria-label="Contact ShopSphere" className="scroll-mt-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Headquarters</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">ShopSphere India</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Level 7, Tech Boulevard, Bandra Kurla Complex, Mumbai, Maharashtra 400051
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Direct Helpline</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">+91 1800 266 8989</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Toll-Free Customer Care available Monday through Saturday, 9:00 AM – 9:00 PM IST.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">support@shopsphere.in</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Send us your inquiries anytime; our response time is under 2 business hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

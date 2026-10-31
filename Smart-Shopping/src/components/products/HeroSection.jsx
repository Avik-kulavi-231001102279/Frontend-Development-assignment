import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const HeroSection = () => {
  return (
    <div id="hero" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white my-6 shadow-2xl border border-indigo-500/20">
      {/* Decorative Gradient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Headlines & Call to Action */}
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen E-Commerce Experience • Transparent ₹ INR Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Discover Shopping That{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Defines Your Style
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
            Welcome to ShopSphere — India&apos;s premier curated shopping destination. Explore quality collections, verified brands, and seamless order fulfillment. Register or log in to unlock your personalized shopping dashboard.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 transition-all cursor-pointer"
            >
              <span>Get Started / Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4 text-indigo-300" />
              <span>Sign In to Shop</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">50,000+</p>
              <p className="text-[11px] text-slate-400 font-medium">Happy Shoppers</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-400 font-medium">Genuine Guarantee</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">₹ INR</p>
              <p className="text-[11px] text-slate-400 font-medium">Transparent Pricing</p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Shopping Portal Visual (No products) */}
        <div className="relative w-full max-w-md lg:max-w-lg">
          <div className="relative rounded-3xl bg-white/10 border border-white/15 p-8 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Shopping Hub Icon */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">ShopSphere Hub</h3>
                  <p className="text-xs text-indigo-200">Authentication-First Shopping Portal</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                Online & Secure
              </span>
            </div>

            {/* Feature Highlights Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">100% Verified Quality</p>
                  <p className="text-[11px] text-slate-300">Curated authentic products with full warranty</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Pan-India Express Delivery</p>
                  <p className="text-[11px] text-slate-300">Track shipments right to your doorstep</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Flexible Payment Options</p>
                  <p className="text-[11px] text-slate-300">UPI, Cards, and Cash on Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Exclusive Member Benefits</p>
                  <p className="text-[11px] text-slate-300">Special discounts with promo codes like WELCOME10</p>
                </div>
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Ready to Explore
              </span>
              <span className="text-indigo-300">Sign in to begin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white my-6 shadow-2xl">
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column Text */}
        <div className="max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen E-Commerce Experience</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Smart Shopping.{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Seamless Experience.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore curated tech, fashion, and luxury jewelry. Real-time cart state, instant coupon calculations, and seamless simulated checkout powered by Redux Toolkit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/category/electronics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Featured Tech</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-400 font-medium">Real REST API Data</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">4.8★</p>
              <p className="text-[11px] text-slate-400 font-medium">Customer Rating</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">0s</p>
              <p className="text-[11px] text-slate-400 font-medium">Cart Refresh Sync</p>
            </div>
          </div>
        </div>

        {/* Right Column Visual Banner */}
        <div className="relative w-full max-w-md lg:max-w-lg">
          <div className="relative rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-2xl">
            {/* Promo Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Exclusive Welcome Offer
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                Active Code
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300">Use Coupon at Checkout</p>
                  <p className="text-lg font-black tracking-wider text-amber-300 font-mono">
                    WELCOME10
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-xl">
                    10% OFF
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300">Big Orders ($50+)</p>
                  <p className="text-lg font-black tracking-wider text-pink-300 font-mono">
                    SHOPSPHERE20
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white bg-violet-600 px-3 py-1.5 rounded-xl">
                    20% OFF
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Simulated Secure Payment</span>
              </div>
              <span className="text-indigo-300 font-semibold">Free Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

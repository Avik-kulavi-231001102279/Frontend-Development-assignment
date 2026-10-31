import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTax,
  selectCartShipping,
  selectCartFinalTotal,
  selectAppliedCoupon,
  selectCouponError,
} from '../../features/cart/cartSelectors';
import { applyCoupon, removeCoupon, clearCouponError } from '../../features/cart/cartSlice';
import { addToast, selectCurrency } from '../../features/preferences/preferenceSlice';
import { formatPrice } from '../../utils/currency';
import {
  Tag,
  X,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';

export const CartSummary = ({ showCheckoutButton = true }) => {
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();

  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCartDiscount);
  const tax = useSelector(selectCartTax);
  const shipping = useSelector(selectCartShipping);
  const finalTotal = useSelector(selectCartFinalTotal);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const couponError = useSelector(selectCouponError);
  const currency = useSelector(selectCurrency);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    dispatch(applyCoupon(couponCode));
    dispatch(
      addToast({
        message: `Attempted to apply coupon: ${couponCode.toUpperCase()}`,
        type: 'info',
        duration: 2000,
      })
    );
    setCouponCode('');
  };

  const handleApplyQuickCoupon = (code) => {
    dispatch(applyCoupon(code));
    dispatch(
      addToast({
        message: `Applied coupon ${code}!`,
        type: 'success',
      })
    );
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    dispatch(
      addToast({
        message: 'Coupon removed from order.',
        type: 'info',
      })
    );
  };

  // Free shipping threshold ($100)
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
      <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      {subtotal > 0 && (
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-300">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {remainingForFreeShipping === 0 ? (
                <span>🎉 You unlocked Free Express Shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-indigo-600 dark:text-indigo-400">{formatPrice(remainingForFreeShipping, currency)}</strong> more for Free Shipping
                </span>
              )}
            </span>
            <span>{Math.round(freeShippingProgress)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-indigo-200 dark:bg-indigo-900 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Coupon Application Box */}
      <div className="space-y-3 pt-1">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Promo or Coupon Code
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold font-mono tracking-wider">
                  {appliedCoupon.code}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  {appliedCoupon.description}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1 rounded-lg text-emerald-700 hover:text-rose-600 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (couponError) dispatch(clearCouponError());
                }}
                placeholder="Enter WELCOME10..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={!couponCode.trim()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}

        {couponError && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {couponError}
          </p>
        )}

        {/* Quick Suggestion Chips */}
        {!appliedCoupon && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400">Try:</span>
            {['WELCOME10', 'SHOPSPHERE20', 'FREESHIP'].map((code) => (
              <button
                key={code}
                onClick={() => handleApplyQuickCoupon(code)}
                className="px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calculations Breakdown */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {formatPrice(subtotal, currency)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Discount ({appliedCoupon?.code})
            </span>
            <span>-{formatPrice(discount, currency)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Estimated Tax (5%)</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {formatPrice(tax, currency)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping Charges</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs">
                FREE
              </span>
            ) : (
              formatPrice(shipping, currency)
            )}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-base">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Final Total
            </span>
            <span className="block text-[11px] text-slate-400">
              Inclusive of taxes & discounts
            </span>
          </div>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {formatPrice(finalTotal, currency)}
          </span>
        </div>
      </div>

      {/* Call to Action Button */}
      {showCheckoutButton && subtotal > 0 && (
        <div className="space-y-3 pt-2">
          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/shop"
            className="block text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            &larr; Continue Shopping
          </Link>
        </div>
      )}

      {/* Security badge */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>SSL Encrypted Checkout Guaranteed</span>
      </div>
    </div>
  );
};

export default CartSummary;

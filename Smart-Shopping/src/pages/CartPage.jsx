import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartItemCount,
} from '../features/cart/cartSelectors';
import { clearCart } from '../features/cart/cartSlice';
import { addToast } from '../features/preferences/preferenceSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

export const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      dispatch(clearCart());
      dispatch(
        addToast({
          message: 'Shopping cart has been cleared.',
          type: 'info',
        })
      );
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our featured categories and top deals!"
          actionText="Explore All Products"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="py-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You have <strong className="text-indigo-600 dark:text-indigo-400">{itemCount}</strong> items in your cart.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>

          <button
            onClick={handleClearCart}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>
      </div>

      {/* Main Cart Grid: Left Items List, Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-2 sm:p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm space-y-2">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 px-2">
            <span>Prices are subject to applied promotional discounts at checkout.</span>
            <Link to="/shop" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Add more items &rarr;
            </Link>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1 sticky top-24">
          <CartSummary showCheckoutButton={true} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

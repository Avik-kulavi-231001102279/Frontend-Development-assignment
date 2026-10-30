import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeFromCart,
} from '../../features/cart/cartSlice';
import { addToast, selectCurrency } from '../../features/preferences/preferenceSlice';
import { formatPrice } from '../../utils/currency';
import QuantitySelector from './QuantitySelector';
import { Trash2 } from 'lucide-react';

export const CartItem = ({ item }) => {
  const [imgError, setImgError] = useState(false);
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    dispatch(
      addToast({
        message: `Removed "${item.title.slice(0, 24)}..." from cart.`,
        type: 'info',
      })
    );
  };

  const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 rounded-2xl">
      {/* Product Image */}
      <Link
        to={`/product/${item.id}`}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800"
      >
        <img
          src={
            imgError
              ? `https://placehold.co/200x200?text=${encodeURIComponent(item.title.slice(0, 10))}`
              : item.image
          }
          alt={item.title}
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain"
        />
      </Link>

      {/* Title & Price info */}
      <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          {item.category}
        </span>
        <Link to={`/product/${item.id}`}>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
            {item.title}
          </h4>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Unit Price: <span className="font-semibold">{formatPrice(item.price, currency)}</span>
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4 shrink-0">
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => dispatch(increaseQuantity(item.id))}
          onDecrease={() => dispatch(decreaseQuantity(item.id))}
          onChange={(newQty) => dispatch(updateQuantity({ id: item.id, quantity: newQty }))}
          size="sm"
        />

        {/* Line Total */}
        <div className="min-w-[80px] text-right">
          <span className="block text-sm font-extrabold text-slate-900 dark:text-white">
            {formatPrice(lineTotal, currency)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          aria-label={`Remove ${item.title} from cart`}
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

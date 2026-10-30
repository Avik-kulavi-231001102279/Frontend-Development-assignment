import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectOrderById, selectCurrentOrder } from '../features/orders/orderSelectors';
import { selectCurrency } from '../features/preferences/preferenceSlice';
import { formatPrice } from '../utils/currency';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const currency = useSelector(selectCurrency);

  const orderFromStore = useSelector((state) => selectOrderById(state, orderId));
  const currentOrder = useSelector(selectCurrentOrder);

  const order = location.state?.order || orderFromStore || currentOrder;

  useEffect(() => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-sm text-slate-500">
          We could not locate details for order ID: {orderId}
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs"
        >
          View My Orders &rarr;
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8 pb-16">
      {/* Success Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
          <CheckCircle2 className="w-8 h-8 animate-in zoom-in-75 duration-300" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Thank You for Your Order!
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Your order has been confirmed and is now being processed. A confirmation has been logged in your account history.
        </p>

        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            Order Reference: <strong className="text-indigo-600 dark:text-indigo-400">{order.id}</strong>
          </span>
        </div>
      </div>

      {/* Order Card Container */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        {/* Meta summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
        </div>

        {/* Ordered items list */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Purchased Products
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-100 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Qty: {item.quantity} × {formatPrice(item.price, currency)}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.price * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Delivering To</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-xs text-slate-500">
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
            </p>
            <p className="text-xs text-slate-500">
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              <span>Payment Details</span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {order.paymentMethod}
            </p>
            <p className="text-xs text-slate-500">
              Transaction: <span className="font-mono text-emerald-600">Simulated Success</span>
            </p>
            <p className="text-xs text-slate-500">
              Estimated Delivery: 3 - 5 business days
            </p>
          </div>
        </div>

        {/* Total Cost Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal, currency)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Promotional Discount:</span>
              <span>-{formatPrice(order.discount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Sales Tax:</span>
            <span>{formatPrice(order.tax, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping, currency)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-sm font-bold text-slate-900 dark:text-white">
            <span>Total Paid:</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatPrice(order.totalAmount, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
        >
          <Package className="w-4 h-4" />
          <span>View in My Orders</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;

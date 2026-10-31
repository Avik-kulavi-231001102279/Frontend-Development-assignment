import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatus, cancelOrder } from '../../features/orders/orderSlice';
import { addToast, selectCurrency } from '../../features/preferences/preferenceSlice';
import { formatPrice } from '../../utils/currency';
import OrderStatusBadge from './OrderStatusBadge';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  Ban,
  RefreshCw,
} from 'lucide-react';

export const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const currency = useSelector(selectCurrency);

  const handleCancelOrder = () => {
    if (window.confirm(`Are you sure you want to cancel order ${order.id}?`)) {
      dispatch(cancelOrder(order.id));
      dispatch(
        addToast({
          message: `Order ${order.id} has been cancelled.`,
          type: 'info',
        })
      );
    }
  };

  const handleAdvanceStatus = () => {
    const statuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(order.orderStatus);
    if (currentIndex >= 0 && currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      dispatch(updateOrderStatus({ orderId: order.id, status: nextStatus }));
      dispatch(
        addToast({
          message: `Order ${order.id} status updated to "${nextStatus}".`,
          type: 'success',
        })
      );
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Top Order Summary Bar */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">
              {order.id}
            </span>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 justify-between md:justify-end">
          <div className="text-right">
            <span className="block text-[11px] text-slate-400 uppercase font-semibold">
              Total Amount
            </span>
            <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
              {formatPrice(order.totalAmount, currency)}
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Hide Details' : 'View Details'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Item thumbnails glance */}
      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="relative w-12 h-12 rounded-xl bg-white p-1.5 border border-slate-200 dark:border-slate-700 shrink-0"
              title={`${item.title} (x${item.quantity})`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
          ))}
          <span className="text-xs text-slate-500 font-medium pl-2">
            {order.items?.reduce((t, i) => t + i.quantity, 0)} total item(s)
          </span>
        </div>

        {/* Simulation Controls for testing */}
        <div className="flex items-center gap-2">
          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
            <button
              onClick={handleAdvanceStatus}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-[11px] font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Simulate advancing to next delivery step"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Simulate Next Status</span>
            </button>
          )}

          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
            <button
              onClick={handleCancelOrder}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <Ban className="w-3 h-3" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details Section */}
      {expanded && (
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2">
          {/* Detailed Item List */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Ordered Products
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-100 shrink-0"
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
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Delivery address */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Shipping Address</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phone: {order.shippingAddress?.phone} | Email: {order.shippingAddress?.email}
              </p>
            </div>

            {/* Payment & Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Payment & Cost Breakdown</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Method: <strong className="text-slate-900 dark:text-slate-100">{order.paymentMethod}</strong>
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal, currency)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(order.tax, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Paid:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {formatPrice(order.totalAmount, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

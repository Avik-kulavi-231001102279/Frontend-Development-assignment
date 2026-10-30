import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRecentOrders } from '../features/orders/orderSelectors';
import OrderCard from '../components/orders/OrderCard';
import EmptyState from '../components/common/EmptyState';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';

export const OrderHistoryPage = () => {
  const orders = useSelector(selectRecentOrders);

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Orders ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View your order history, track deliveries, and manage past purchases.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-bold hover:bg-indigo-100 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More Items</span>
        </Link>
      </div>

      {/* Orders List or Empty State */}
      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description="You haven't placed any orders yet. Discover our latest items and fill your cart today!"
          actionText="Start Shopping"
          actionLink="/shop"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;

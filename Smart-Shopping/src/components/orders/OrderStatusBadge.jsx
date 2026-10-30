import React from 'react';
import { Clock, CheckCircle2, Truck, PackageCheck, XCircle } from 'lucide-react';

export const OrderStatusBadge = ({ status = 'Confirmed' }) => {
  const configs = {
    Confirmed: {
      label: 'Confirmed',
      icon: CheckCircle2,
      style: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    },
    Processing: {
      label: 'Processing',
      icon: Clock,
      style: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    },
    Shipped: {
      label: 'Shipped',
      icon: Truck,
      style: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    },
    Delivered: {
      label: 'Delivered',
      icon: PackageCheck,
      style: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    },
    Cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      style: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    },
  };

  const current = configs[status] || configs.Confirmed;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.style}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
};

export default OrderStatusBadge;

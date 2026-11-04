import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SummaryCard = ({
  title,
  amount,
  isCurrency = true,
  customValue = null,
  icon: Icon,
  variant = 'indigo', // 'indigo' | 'emerald' | 'rose' | 'blue' | 'amber'
  subtitle = null,
  badge = null,
  trend = null, // { value: '+12%', isPositive: true }
}) => {
  const currencyCode = useSelector(selectCurrency);

  const variantStyles = {
    indigo: {
      bg: 'bg-indigo-50/70 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/50',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
      textAccent: 'text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-50/70 dark:bg-rose-950/40',
      border: 'border-rose-100 dark:border-rose-900/50',
      iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
      textAccent: 'text-rose-600 dark:text-rose-400',
    },
    blue: {
      bg: 'bg-blue-50/70 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/50',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
      textAccent: 'text-blue-600 dark:text-blue-400',
    },
    amber: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/50',
      iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
      textAccent: 'text-amber-600 dark:text-amber-400',
    },
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <div
      className={`relative p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {customValue !== null
              ? customValue
              : isCurrency
              ? formatCurrency(amount, currencyCode)
              : amount}
          </h3>
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 flex-shrink-0 ${style.iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || badge || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>
          )}
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full font-semibold ${style.textAccent} bg-white dark:bg-slate-800 shadow-xs`}
            >
              {badge}
            </span>
          )}
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                trend.isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;


import React from 'react';
import { useSelector } from 'react-redux';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, currencyCode }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[140px]">
        <p className="font-bold text-slate-200 mb-1 border-b border-slate-800 pb-1">
          {item.displayDate || label}
        </p>
        <p className="text-slate-300">
          Daily Expense:{' '}
          <span className="font-bold text-rose-400">
            {formatCurrency(item.expense || 0, currencyCode)}
          </span>
        </p>
        {item.income > 0 && (
          <p className="text-slate-300">
            Daily Income:{' '}
            <span className="font-bold text-emerald-400">
              {formatCurrency(item.income || 0, currencyCode)}
            </span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const ExpenseLineChart = ({ data = [], height = 300 }) => {
  const currencyCode = useSelector(selectCurrency);

  const hasExpenses = data.some((d) => d.expense > 0);

  if (!hasExpenses) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30"
        style={{ height }}
      >
        <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No daily expenses recorded this month
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Transactions will show day-by-day fluctuation
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="expenseTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#94a3b8"
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(val) => {
              if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
              return val;
            }}
          />
          <Tooltip content={<CustomTooltip currencyCode={currencyCode} />} />
          <Area
            type="monotone"
            dataKey="expense"
            name="Daily Expense"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#expenseTrendGradient)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseLineChart;


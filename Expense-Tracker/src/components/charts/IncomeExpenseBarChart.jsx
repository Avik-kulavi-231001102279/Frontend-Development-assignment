import React from 'react';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, currencyCode }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[150px]">
        <p className="font-bold text-slate-200 mb-2 border-b border-slate-800 pb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`tip-${index}`} className="flex items-center justify-between gap-3 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-300 capitalize">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-semibold text-white">
              {formatCurrency(entry.value, currencyCode)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const IncomeExpenseBarChart = ({ data = [], height = 300 }) => {
  const currencyCode = useSelector(selectCurrency);

  const hasData = data.some((item) => item.income > 0 || item.expense > 0);

  if (!hasData) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30"
        style={{ height }}
      >
        <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No monthly comparison data
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Add transactions across months to visualize trends
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
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
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: 12 }}
            formatter={(value) => (
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            animationDuration={800}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseBarChart;


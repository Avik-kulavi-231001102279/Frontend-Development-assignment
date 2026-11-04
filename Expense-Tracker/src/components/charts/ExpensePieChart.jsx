import React from 'react';
import { useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { PieChart as PieIcon } from 'lucide-react';

const CustomTooltip = ({ active, payload, currencyCode }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-semibold">{data.name}</span>
        </div>
        <p className="text-slate-300">
          Amount: <span className="font-bold text-white">{formatCurrency(data.value, currencyCode)}</span>
        </p>
        <p className="text-slate-400">
          Share: <span className="font-semibold text-indigo-400">{data.payload.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const ExpensePieChart = ({ data = [], height = 300 }) => {
  const currencyCode = useSelector(selectCurrency);

  if (!data || data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30"
        style={{ height }}
      >
        <PieIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No expense data available
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Record expense transactions to view category distribution
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip currencyCode={currencyCode} />} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value, entry) => (
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {value} ({entry.payload.percentage}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;


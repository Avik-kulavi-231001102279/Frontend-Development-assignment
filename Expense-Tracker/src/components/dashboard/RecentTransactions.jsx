import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Receipt,
  Calendar,
} from 'lucide-react';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';

export const RecentTransactions = ({ transactions = [] }) => {
  const navigate = useNavigate();
  const currencyCode = useSelector(selectCurrency);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest 5 income & expense activities
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors p-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
        {transactions.length === 0 ? (
          <div className="py-8 text-center">
            <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No recent transactions
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Click &quot;Add Transaction&quot; to get started
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div
                key={tx.id}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      <span className="font-medium text-slate-600 dark:text-slate-400">
                        {tx.category}
                      </span>
                      <span>&bull;</span>
                      <span>{tx.paymentMethod}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm sm:text-base font-bold whitespace-nowrap flex-shrink-0 ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currencyCode)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
        >
          Open Complete Ledger
        </button>
      </div>
    </div>
  );
};

export default RecentTransactions;


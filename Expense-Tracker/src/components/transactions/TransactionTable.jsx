import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  Receipt,
  CreditCard,
  Calendar,
  Tag,
} from 'lucide-react';
import { selectCurrency } from '../../features/settings/settingsSlice';
import { deleteTransactionAsync } from '../../features/transactions/transactionSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import ConfirmDialog from '../common/ConfirmDialog';
import EmptyState from '../common/EmptyState';

export const TransactionTable = ({
  transactions = [],
  onEditTransaction,
  onAddNew,
}) => {
  const dispatch = useDispatch();
  const currencyCode = useSelector(selectCurrency);

  // Deletion state
  const [deletingTx, setDeletingTx] = useState(null);

  const handleConfirmDelete = async () => {
    if (deletingTx) {
      await dispatch(deleteTransactionAsync(deletingTx.id));
      setDeletingTx(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No Transactions Found"
        description="Try adjusting your search criteria or add a new transaction to begin tracking."
        actionLabel={onAddNew ? 'Add New Transaction' : undefined}
        onAction={onAddNew}
      />
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Transaction</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Title & Notes */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
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
                          <p className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                            {tx.title}
                          </p>
                          {tx.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-xs">
                              {tx.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isIncome
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
                        }`}
                      >
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{tx.category}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                      {formatDate(tx.date)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                      {tx.paymentMethod || 'Other'}
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-4 px-6 text-right font-bold whitespace-nowrap ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currencyCode)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditTransaction && onEditTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingTx(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
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
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-1">
                      {tx.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(tx.date)}</span>
                    </p>
                  </div>
                </div>

                <div
                  className={`text-right font-bold text-base ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currencyCode)}
                </div>
              </div>

              {tx.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg mb-2 line-clamp-2">
                  {tx.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                    {tx.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {tx.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditTransaction && onEditTransaction(tx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingTx(tx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={Boolean(deletingTx)}
        onClose={() => setDeletingTx(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction?"
        message={`Are you sure you want to delete "${deletingTx?.title}" (${formatCurrency(
          deletingTx?.amount || 0,
          currencyCode
        )})? This action cannot be reversed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
};

export default TransactionTable;


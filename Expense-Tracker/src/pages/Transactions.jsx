import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Download } from 'lucide-react';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionModal from '../components/transactions/TransactionModal';
import { selectFilteredTransactions } from '../features/transactions/transactionSelectors';
import { exportTransactionsToCSV } from '../utils/exportCSV';

export const Transactions = () => {
  const filteredTransactions = useSelector(selectFilteredTransactions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleExportFilteredCSV = () => {
    try {
      exportTransactionsToCSV(filteredTransactions, 'filtered-records');
    } catch (error) {
      alert(error.message || 'Export failed.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transactions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, filter, and review all your income and expense records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportFilteredCSV}
            disabled={filteredTransactions.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <TransactionFilters
        onExportCSV={handleExportFilteredCSV}
        totalResultsCount={filteredTransactions.length}
      />

      {/* Transactions Table / Responsive Cards */}
      <TransactionTable
        transactions={filteredTransactions}
        onEditTransaction={handleOpenEdit}
        onAddNew={handleOpenAdd}
      />

      {/* Modal for Add / Edit */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
};

export default Transactions;


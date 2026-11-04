import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Tags,
  Plus,
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FolderPlus,
  Layers,
} from 'lucide-react';
import {
  selectAllCategories,
  addCategoryAsync,
  updateCategoryAsync,
  deleteCategoryAsync,
  resetCategoriesToDefault,
} from '../features/categories/categorySlice';
import { selectAllTransactions } from '../features/transactions/transactionSelectors';
import { selectCurrency } from '../features/settings/settingsSlice';
import { formatCurrency } from '../utils/formatCurrency';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

const PALETTE = [
  '#6366f1',
  '#f97316',
  '#ec4899',
  '#06b6d4',
  '#8b5cf6',
  '#14b8a6',
  '#a855f7',
  '#eab308',
  '#3b82f6',
  '#10b981',
  '#ef4444',
  '#64748b',
];

export const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const transactions = useSelector(selectAllTransactions);
  const currencyCode = useSelector(selectCurrency);

  const [activeTab, setActiveTab] = useState('expense'); // 'expense' | 'income'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState(PALETTE[0]);
  const [categoryType, setCategoryType] = useState('expense');
  const [formError, setFormError] = useState('');

  // Delete dialog state
  const [deletingCat, setDeletingCat] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Calculate usage stats per category
  const getCategoryStats = (name, type) => {
    const matchingTx = transactions.filter(
      (t) => t.category === name && t.type === type
    );
    const count = matchingTx.length;
    const totalAmount = matchingTx.reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0
    );
    return { count, totalAmount };
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor(PALETTE[0]);
    setCategoryType(activeTab);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryColor(cat.color || PALETTE[0]);
    setCategoryType(cat.type);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setFormError('Category name is required.');
      return;
    }

    if (editingCategory) {
      const res = await dispatch(
        updateCategoryAsync({
          id: editingCategory.id,
          name: categoryName.trim(),
          color: categoryColor,
        })
      );
      if (res.error) {
        setFormError(res.error.message || 'Failed to update category.');
        return;
      }
    } else {
      const res = await dispatch(
        addCategoryAsync({
          name: categoryName.trim(),
          type: categoryType,
          color: categoryColor,
        })
      );
      if (res.error) {
        setFormError(res.error.message || 'Failed to create category.');
        return;
      }
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCat) return;

    // Check if in use
    const { count } = getCategoryStats(deletingCat.name, deletingCat.type);
    if (count > 0) {
      setDeleteError(
        `Cannot delete "${deletingCat.name}" because it is currently used by ${count} transaction(s). Reassign or delete those transactions first.`
      );
      return;
    }

    await dispatch(deleteCategoryAsync(deletingCat.id));
    setDeletingCat(null);
    setDeleteError('');
  };

  const currentList = categories.filter((c) => c.type === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Category Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize transactions into custom income and expense categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Tabs: Expense vs Income Categories */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('expense')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-all ${
            activeTab === 'expense'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Expense Categories</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {categories.filter((c) => c.type === 'expense').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('income')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 font-semibold text-sm transition-all ${
            activeTab === 'income'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Income Categories</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {categories.filter((c) => c.type === 'income').length}
          </span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((cat) => {
          const stats = getCategoryStats(cat.name, cat.type);
          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-sm"
                      style={{ backgroundColor: cat.color || '#6366f1' }}
                    >
                      {cat.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-400">
                        {cat.isDefault ? 'Standard Default' : 'Custom Category'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError('');
                        setDeletingCat(cat);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Usage Stats Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {stats.count} {stats.count === 1 ? 'transaction' : 'transactions'}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(stats.totalAmount, currencyCode)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Custom Category'}
        subtitle="Categories help you organize and analyze transactions"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          {!editingCategory && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Category Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCategoryType('expense')}
                  className={`py-2 rounded-lg transition-all ${
                    categoryType === 'expense'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryType('income')}
                  className={`py-2 rounded-lg transition-all ${
                    categoryType === 'income'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Income
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setFormError('');
              }}
              placeholder="e.g. Fitness & Gym, Dividends"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
            {formError && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{formError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCategoryColor(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    categoryColor === color
                      ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Category Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deletingCat)}
        onClose={() => {
          setDeletingCat(null);
          setDeleteError('');
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete "${deletingCat?.name}" Category?`}
        message={
          deleteError ||
          `Are you sure you want to delete this category? Make sure no existing transactions are assigned to it.`
        }
        confirmText="Confirm Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
};

export default Categories;


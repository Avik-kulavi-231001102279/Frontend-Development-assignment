import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'Nothing found here',
  description = 'We could not find any items matching your criteria.',
  actionText = 'Start Shopping',
  actionLink = '/shop',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 my-8">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        {description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;

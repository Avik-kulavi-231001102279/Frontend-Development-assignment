import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Gem, Shirt, Sparkles } from 'lucide-react';

const categoryMeta = {
  electronics: {
    icon: Laptop,
    label: 'Electronics',
    gradient: 'from-blue-600 to-indigo-600',
    description: 'Smartphones, SSDs, 4K monitors & audio',
  },
  jewelery: {
    icon: Gem,
    label: 'Jewelry & Watches',
    gradient: 'from-amber-500 to-rose-500',
    description: 'Gold bracelets, rings, earrings & luxury',
  },
  "men's clothing": {
    icon: Shirt,
    label: "Men's Fashion",
    gradient: 'from-emerald-600 to-teal-700',
    description: 'Casual jackets, t-shirts, packs & coats',
  },
  "women's clothing": {
    icon: Sparkles,
    label: "Women's Wear",
    gradient: 'from-purple-600 to-pink-600',
    description: 'Elegant coats, windbreakers, tops & tees',
  },
};

export const CategoryCard = ({ category }) => {
  const normalizedKey = (category || '').toLowerCase();
  const meta = categoryMeta[normalizedKey] || {
    icon: Sparkles,
    label: category,
    gradient: 'from-indigo-600 to-violet-600',
    description: 'Explore trendy collections',
  };

  const Icon = meta.icon;

  return (
    <Link
      to={`/category/${encodeURIComponent(category)}`}
      className="group relative flex flex-col items-center text-center p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 overflow-hidden"
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${meta.gradient} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
        {meta.label}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
        {meta.description}
      </p>

      <span className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        Explore Collection &rarr;
      </span>
    </Link>
  );
};

export default CategoryCard;

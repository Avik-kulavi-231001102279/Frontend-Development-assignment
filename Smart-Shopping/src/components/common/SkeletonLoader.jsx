import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm overflow-hidden">
      <div className="w-full h-52 rounded-xl skeleton-shimmer mb-4" />
      <div className="space-y-2.5">
        <div className="w-1/3 h-3.5 rounded-full skeleton-shimmer" />
        <div className="w-4/5 h-4.5 rounded-full skeleton-shimmer" />
        <div className="w-1/2 h-4 rounded-full skeleton-shimmer" />
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="w-1/4 h-6 rounded-md skeleton-shimmer" />
          <div className="w-24 h-9 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="w-14 h-14 rounded-2xl skeleton-shimmer mb-3" />
      <div className="w-20 h-4 rounded-full skeleton-shimmer mb-1" />
      <div className="w-12 h-3 rounded-full skeleton-shimmer" />
    </div>
  );
};

export const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="w-full h-[450px] rounded-3xl skeleton-shimmer" />
        <div className="space-y-4">
          <div className="w-24 h-6 rounded-full skeleton-shimmer" />
          <div className="w-3/4 h-8 rounded-lg skeleton-shimmer" />
          <div className="w-32 h-5 rounded-md skeleton-shimmer" />
          <div className="w-28 h-8 rounded-md skeleton-shimmer" />
          <div className="w-full h-24 rounded-xl skeleton-shimmer" />
          <div className="flex gap-4 pt-4">
            <div className="w-32 h-12 rounded-xl skeleton-shimmer" />
            <div className="w-40 h-12 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  CategoryCardSkeleton,
  ProductDetailsSkeleton,
};

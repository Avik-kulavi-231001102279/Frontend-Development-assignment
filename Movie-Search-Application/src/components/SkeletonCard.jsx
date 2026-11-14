import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-cinema-850/60 dark:bg-cinema-850/60 border border-white/5 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      {/* Poster shimmer with standard 2:3 movie aspect ratio */}
      <div className="relative w-full aspect-[2/3] bg-cinema-800/80">
        <div className="absolute inset-0 poster-shimmer" />
      </div>

      {/* Card Info skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Badge & Year placeholder */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-14 bg-cinema-700/70 rounded-full" />
            <div className="h-4 w-10 bg-cinema-700/70 rounded" />
          </div>

          {/* Title placeholder (two lines) */}
          <div className="h-5 w-3/4 bg-cinema-700/70 rounded" />
          <div className="h-4 w-1/2 bg-cinema-700/50 rounded" />
        </div>

        {/* Action buttons placeholder */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <div className="h-9 flex-1 bg-cinema-700/60 rounded-xl" />
          <div className="h-9 w-9 bg-cinema-700/60 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonMovieDetails() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-10 w-36 bg-cinema-800 rounded-xl mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Poster column */}
        <div className="md:col-span-1">
          <div className="aspect-[2/3] bg-cinema-800 rounded-2xl w-full poster-shimmer" />
        </div>

        {/* Content column */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <div className="space-y-3">
            <div className="h-6 w-28 bg-cinema-700 rounded-full" />
            <div className="h-10 w-3/4 bg-cinema-700 rounded-xl" />
            <div className="flex gap-4">
              <div className="h-5 w-16 bg-cinema-800 rounded" />
              <div className="h-5 w-20 bg-cinema-800 rounded" />
              <div className="h-5 w-24 bg-cinema-800 rounded" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="h-8 w-20 bg-cinema-800 rounded-full" />
            <div className="h-8 w-24 bg-cinema-800 rounded-full" />
            <div className="h-8 w-16 bg-cinema-800 rounded-full" />
          </div>

          <div className="space-y-2 py-4 border-y border-white/5">
            <div className="h-4 w-full bg-cinema-800 rounded" />
            <div className="h-4 w-full bg-cinema-800 rounded" />
            <div className="h-4 w-2/3 bg-cinema-800 rounded" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="h-16 bg-cinema-800 rounded-xl" />
            <div className="h-16 bg-cinema-800 rounded-xl" />
            <div className="h-16 bg-cinema-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}


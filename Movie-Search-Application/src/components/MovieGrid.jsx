import React from 'react';
import MovieCard from './MovieCard';
import { SkeletonGrid } from './SkeletonCard';
import ErrorMessage from './ErrorMessage';

export default function MovieGrid({
  movies = [],
  loading = false,
  error = null,
  skeletonCount = 10,
  emptyMessage = 'No movies to display.',
  onRetry,
}) {
  if (loading) {
    return <SkeletonGrid count={skeletonCount} />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!movies || movies.length === 0) {
    return <ErrorMessage type="empty" message={emptyMessage} onRetry={onRetry} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}


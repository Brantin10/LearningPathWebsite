'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center px-4">
      <div className="glass-card-elevated rounded-2xl p-10 text-center max-w-md w-full">
        <p className="text-5xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h1>
        <p className="text-text-secondary text-sm mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

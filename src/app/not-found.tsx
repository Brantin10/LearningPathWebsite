import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg to-bg-elevated flex items-center justify-center px-4">
      <div className="glass-card-elevated rounded-2xl p-10 text-center max-w-md w-full">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Page Not Found</h1>
        <p className="text-text-secondary text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/home"
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

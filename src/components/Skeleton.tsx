'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export default function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const base = 'animate-pulse bg-bg-card-hover';
  const variants = {
    text: `${base} rounded h-4`,
    card: `${base} rounded-2xl`,
    circle: `${base} rounded-full`,
  };

  return <div className={`${variants[variant]} ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton variant="text" className="w-48 h-6" />
        <Skeleton variant="text" className="w-32 h-4" />
      </div>
      {/* Card skeletons */}
      <Skeleton variant="card" className="h-32" />
      <Skeleton variant="card" className="h-24" />
      <Skeleton variant="card" className="h-24" />
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" className="h-24" />
      ))}
    </div>
  );
}

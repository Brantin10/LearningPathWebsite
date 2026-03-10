'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function GradientBackground({ children, className = '' }: Props) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-bg to-bg-elevated ${className}`}
    >
      {children}
    </div>
  );
}

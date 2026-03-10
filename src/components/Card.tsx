'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
  onClick?: () => void;
}

export default function Card({ children, className = '', variant = 'default', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-5
        ${variant === 'elevated' ? 'glass-card-elevated' : 'glass-card'}
        ${onClick ? 'cursor-pointer hover:bg-bg-card-hover transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive';
  onClick?: () => void;
}

const variantClass: Record<string, string> = {
  default: 'glass-card',
  elevated: 'glass-card-elevated',
  interactive: 'glass-card-interactive',
};

export default function Card({ children, className = '', variant = 'default', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-5
        ${variantClass[variant]}
        ${onClick ? 'cursor-pointer hover:bg-bg-card-hover transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

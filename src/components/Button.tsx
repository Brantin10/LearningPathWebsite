'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
}: Props) {
  const isDisabled = disabled || loading;

  const variantClasses: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'glass-card-elevated text-text-primary hover:bg-bg-card-hover',
    outline: 'bg-transparent border border-border-light text-text-primary hover:bg-bg-card',
    danger: 'bg-error-muted border border-[rgba(255,107,107,0.4)] text-error hover:bg-[rgba(255,107,107,0.25)]',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-card',
  };

  return (
    <motion.button
      type={type}
      onClick={onPress}
      disabled={isDisabled}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        flex items-center justify-center py-4 px-6 rounded-xl min-h-[56px]
        font-semibold text-[15px] tracking-wide transition-colors
        ${variantClasses[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex gap-1">
          <span className="typing-dot w-2 h-2 rounded-full bg-current" />
          <span className="typing-dot w-2 h-2 rounded-full bg-current" />
          <span className="typing-dot w-2 h-2 rounded-full bg-current" />
        </div>
      ) : (
        title
      )}
    </motion.button>
  );
}

'use client';

import React, { useState } from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  maxLength?: number;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  success,
  maxLength,
  containerClassName = '',
  className = '',
  value,
  onFocus,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className={`mb-5 ${containerClassName}`}>
      {label && (
        <label className="block text-[11px] font-semibold text-text-secondary mb-2 tracking-[1.5px] uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          value={value}
          maxLength={maxLength}
          className={`
            w-full text-[15px] py-3.5 px-4 rounded-xl text-text-primary
            glass-input transition-colors placeholder:text-text-muted
            ${focused ? 'border-border-focus' : ''}
            ${error ? 'border-[rgba(255,107,107,0.4)]' : ''}
            ${success && !error ? 'border-[rgba(39,174,96,0.4)]' : ''}
            ${success && !error ? 'pr-10' : ''}
            ${className}
          `}
          {...rest}
        />
        {success && !error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27ae60] text-lg leading-none select-none">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 9.5L7 13L14.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
      <div className="flex justify-between items-start mt-1 min-h-[18px]">
        <div
          className={`transition-all duration-200 ease-out overflow-hidden ${
            error
              ? 'max-h-8 opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-1'
          }`}
        >
          <p className="text-error text-[11px]">{error}</p>
        </div>
        {maxLength !== undefined && (
          <p
            className={`text-[11px] ml-auto ${
              charCount > maxLength ? 'text-error' : 'text-text-muted'
            }`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

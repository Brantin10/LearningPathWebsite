'use client';

import React, { useState } from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export default function TextArea({
  label,
  error,
  containerClassName = '',
  className = '',
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`mb-5 ${containerClassName}`}>
      {label && (
        <label className="block text-[11px] font-semibold text-text-secondary mb-2 tracking-[1.5px] uppercase">
          {label}
        </label>
      )}
      <textarea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full text-[15px] py-3.5 px-4 rounded-xl text-text-primary
          glass-input transition-colors placeholder:text-text-muted resize-vertical min-h-[100px]
          ${focused ? 'border-border-focus' : ''}
          ${error ? 'border-[rgba(255,107,107,0.4)]' : ''}
          ${className}
        `}
        {...rest}
      />
      {error && (
        <p className="text-error text-[11px] mt-1">{error}</p>
      )}
    </div>
  );
}

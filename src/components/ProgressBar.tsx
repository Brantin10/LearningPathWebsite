'use client';

import React from 'react';

interface Props {
  progress: number; // 0-1
  label?: string;
  showPercent?: boolean;
  height?: number;
}

export default function ProgressBar({
  progress,
  label,
  showPercent = true,
  height = 6,
}: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div className="my-2">
      {(label || showPercent) && (
        <div className="flex justify-between mb-1.5">
          {label && (
            <span className="text-[11px] font-semibold text-text-secondary tracking-[1.2px] uppercase">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-[11px] font-bold text-accent">{pct}%</span>
          )}
        </div>
      )}
      <div
        className="bg-border rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className="bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, height }}
        />
      </div>
    </div>
  );
}

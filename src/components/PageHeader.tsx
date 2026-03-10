'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function PageHeader({ title, subtitle, showBack = true }: Props) {
  const router = useRouter();

  return (
    <div className="mb-6">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h1>
      {subtitle && (
        <p className="text-text-secondary mt-1 text-sm">{subtitle}</p>
      )}
    </div>
  );
}

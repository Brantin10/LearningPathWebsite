'use client';

import React from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import { ToastProvider } from '../hooks/useToast';
import CommandPalette from '../components/CommandPalette';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
        <CommandPalette />
      </ToastProvider>
    </ThemeProvider>
  );
}

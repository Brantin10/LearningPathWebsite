'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Colors as DarkColors, Glass as DarkGlass } from '../config/theme';
import { LightColors, LightGlass } from '../config/lightTheme';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof DarkColors;
  glass: typeof DarkGlass;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'theme_mode';

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  isDark: true,
  colors: DarkColors,
  glass: DarkGlass,
  toggleTheme: () => {},
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      setModeState(stored);
    }
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const isDark = mode === 'dark';
  const colors = isDark ? DarkColors : (LightColors as typeof DarkColors);
  const glass = isDark ? DarkGlass : (LightGlass as typeof DarkGlass);

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, glass, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Theme Context for managing light/dark mode and color system
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { applyCSSVariables, colorUtils } from './utils';
import type { ThemeMode } from './utils';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colors: typeof colorUtils;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('giv-theme-mode') as ThemeMode;
      if (savedMode === 'light' || savedMode === 'dark') {
        return savedMode;
      }

      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }

    return defaultMode;
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    colorUtils.setMode(newMode);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('giv-theme-mode', newMode);
    }

    // Apply CSS variables
    applyCSSVariables(newMode);

    // Update document class for Tailwind dark mode
    if (typeof document !== 'undefined') {
      if (newMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  // Initialize theme on mount
  useEffect(() => {
    setMode(mode);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedMode = localStorage.getItem('giv-theme-mode');
      if (!savedMode) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const value: ThemeContextType = {
    mode,
    setMode,
    toggleMode,
    colors: colorUtils,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for getting colors with current theme mode
export const useColors = () => {
  const { mode, colors } = useTheme();

  return {
    mode,
    get: (colorPath: string) => colors.get(colorPath),
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    textPrimary: colors.textPrimary,
    textMuted: colors.textMuted,
    getCategoryColor: colors.getCategoryColor,
  };
};

// Hook for theme-aware CSS classes
export const useThemeClasses = () => {
  const { mode } = useTheme();

  return {
    mode,
    // Common theme-aware classes
    background: mode === 'dark' ? 'bg-slate-900' : 'bg-white',
    surface: mode === 'dark' ? 'bg-slate-800' : 'bg-gray-50',
    textPrimary: mode === 'dark' ? 'text-slate-100' : 'text-gray-900',
    textMuted: mode === 'dark' ? 'text-slate-400' : 'text-gray-500',
    border: mode === 'dark' ? 'border-slate-600' : 'border-gray-200',

    // Button classes
    primaryButton:
      mode === 'dark'
        ? 'bg-blue-500 hover:bg-blue-400 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton:
      mode === 'dark'
        ? 'bg-green-400 hover:bg-green-300 text-white'
        : 'bg-green-500 hover:bg-green-600 text-white',

    // Card classes
    card: mode === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200',
  };
};

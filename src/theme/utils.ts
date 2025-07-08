/**
 * Color utility functions and theme helpers
 */

import { theme } from './colors';

export type ThemeMode = 'light' | 'dark';

/**
 * Get color value based on current theme mode
 */
export const getColor = (colorPath: string, mode: ThemeMode = 'light'): string => {
  const pathParts = colorPath.split('.');
  let current: any = theme;

  // Navigate through the color object
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      console.warn(`Color path "${colorPath}" not found in theme`);
      return '#000000'; // Fallback color
    }
  }

  // If the final value is an object with light/dark modes
  if (current && typeof current === 'object' && 'light' in current && 'dark' in current) {
    return current[mode];
  }

  // If it's a direct color value
  if (typeof current === 'string') {
    return current;
  }

  console.warn(`Invalid color value for path "${colorPath}"`);
  return '#000000'; // Fallback color
};

/**
 * Generate CSS custom properties for the theme
 */
export const generateCSSVariables = (mode: ThemeMode = 'light'): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  // Brand colors
  Object.entries(theme.brand).forEach(([key]) => {
    cssVars[`--color-${key}`] = getColor(`brand.${key}`, mode);
  });

  // Base colors
  cssVars['--color-background'] = getColor('base.background', mode);
  cssVars['--color-surface'] = getColor('base.surface', mode);
  cssVars['--color-border'] = getColor('base.border', mode);
  cssVars['--color-text-primary'] = getColor('base.text.primary', mode);
  cssVars['--color-text-muted'] = getColor('base.text.muted', mode);

  // Component colors
  cssVars['--color-navbar-bg'] = getColor('components.navbar.background', mode);
  cssVars['--color-navbar-text'] = getColor('components.navbar.text', mode);
  cssVars['--color-navbar-hover'] = getColor('components.navbar.hoverLink', mode);

  cssVars['--color-hero-bg'] = getColor('components.hero.background', mode);
  cssVars['--color-hero-headline'] = getColor('components.hero.headline', mode);
  cssVars['--color-hero-subtext'] = getColor('components.hero.subtext', mode);

  cssVars['--color-card-bg'] = getColor('components.cards.background', mode);
  cssVars['--color-card-title'] = getColor('components.cards.title', mode);
  cssVars['--color-card-meta'] = getColor('components.cards.metaText', mode);
  cssVars['--color-card-border'] = getColor('components.cards.borderShadow', mode);

  cssVars['--color-stats-bg'] = getColor('components.stats.background', mode);
  cssVars['--color-stats-numbers'] = getColor('components.stats.numbers', mode);
  cssVars['--color-stats-labels'] = getColor('components.stats.labels', mode);

  // Button colors
  cssVars['--color-btn-primary-bg'] = getColor('components.buttons.primary.background', mode);
  cssVars['--color-btn-primary-hover'] = getColor('components.buttons.primary.hover', mode);
  cssVars['--color-btn-secondary-bg'] = getColor('components.buttons.secondary.background', mode);
  cssVars['--color-btn-secondary-hover'] = getColor('components.buttons.secondary.hover', mode);

  return cssVars;
};

/**
 * Apply CSS variables to document root
 */
export const applyCSSVariables = (mode: ThemeMode = 'light'): void => {
  const cssVars = generateCSSVariables(mode);
  const root = document.documentElement;

  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Get category color by name
 */
export const getCategoryColor = (category: string): string => {
  return theme.categories[category as keyof typeof theme.categories] || theme.brand.primary.light;
};

/**
 * Generate Tailwind color classes based on theme
 */
export const getTailwindClass = (
  colorPath: string,
  property: 'bg' | 'text' | 'border' | 'ring',
  mode: ThemeMode = 'light'
): string => {
  const color = getColor(colorPath, mode);

  // Convert hex to Tailwind class (this is a simplified approach)
  // In a real implementation, you might want to use a more sophisticated mapping
  const colorMap: Record<string, string> = {
    '#2563EB': 'blue-600',
    '#3B82F6': 'blue-500',
    '#10B981': 'green-500',
    '#22C55E': 'green-400',
    '#F97316': 'orange-500',
    '#FB923C': 'orange-400',
    '#EF4444': 'red-500',
    '#F87171': 'red-400',
    '#FACC15': 'yellow-400',
    '#FDE047': 'yellow-300',
    '#60A5FA': 'blue-400',
    '#34D399': 'green-400',
    '#FFFFFF': 'white',
    '#F8FAFC': 'gray-50',
    '#E5E7EB': 'gray-200',
    '#111827': 'gray-900',
    '#6B7280': 'gray-500',
    '#0F172A': 'slate-900',
    '#1E293B': 'slate-800',
    '#334155': 'slate-600',
    '#F1F5F9': 'slate-100',
    '#94A3B8': 'slate-400',
  };

  const tailwindColor = colorMap[color] || 'gray-500';
  return `${property}-${tailwindColor}`;
};

/**
 * Color utility class for easier usage
 */
export class ColorUtils {
  private mode: ThemeMode;

  constructor(mode: ThemeMode = 'light') {
    this.mode = mode;
  }

  setMode(mode: ThemeMode): void {
    this.mode = mode;
  }

  getMode(): ThemeMode {
    return this.mode;
  }

  get(colorPath: string): string {
    return getColor(colorPath, this.mode);
  }

  getTailwind(colorPath: string, property: 'bg' | 'text' | 'border' | 'ring'): string {
    return getTailwindClass(colorPath, property, this.mode);
  }

  getCategoryColor(category: string): string {
    return getCategoryColor(category);
  }

  // Convenience methods for common colors
  get primary(): string {
    return this.get('brand.primary');
  }

  get secondary(): string {
    return this.get('brand.secondary');
  }

  get accent(): string {
    return this.get('brand.accent');
  }

  get background(): string {
    return this.get('base.background');
  }

  get surface(): string {
    return this.get('base.surface');
  }

  get textPrimary(): string {
    return this.get('base.text.primary');
  }

  get textMuted(): string {
    return this.get('base.text.muted');
  }
}

// Export a default instance
export const colorUtils = new ColorUtils();

// Theme-aware color constants for easy access
export const colors = {
  get: (colorPath: string, mode: ThemeMode = 'light') => getColor(colorPath, mode),
  category: getCategoryColor,
  tailwind: getTailwindClass,
  utils: colorUtils,
};

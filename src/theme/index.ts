/**
 * GIV Society Theme System
 * Centralized exports for color management and theme utilities
 */

// Core theme exports
export { theme, brandColors, baseColors, componentColors, categoryColors } from './colors';
export {
  getColor,
  generateCSSVariables,
  applyCSSVariables,
  getCategoryColor,
  getTailwindClass,
  ColorUtils,
  colorUtils,
  colors,
} from './utils';

export type { ThemeMode } from './utils';

// React context and hooks
export { ThemeProvider, useTheme, useColors, useThemeClasses } from './ThemeContext';

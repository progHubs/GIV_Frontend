# 🎨 GIV Society Theme System Documentation

## Overview

The GIV Society theme system provides centralized color management, dark mode support, and consistent design tokens across the entire application. It's built on top of the official GIV Color Usage Guide and provides both programmatic and CSS-based approaches to theming.

## 📁 File Structure

```
src/theme/
├── index.ts           # Main theme exports
├── colors.ts          # Color definitions and theme object
├── utils.ts           # Utility functions and helpers
└── ThemeContext.tsx   # React context and hooks
```

## 🎯 Core Features

### ✅ **Centralized Color Management**
- All colors defined in one place (`colors.ts`)
- Consistent color usage across components
- Easy to update brand colors globally

### ✅ **Dark Mode Support**
- Class-based dark mode implementation
- Automatic system preference detection
- Manual theme switching capability
- Persistent theme preference storage

### ✅ **CSS Variables Integration**
- Theme-aware CSS custom properties
- Automatic variable generation and application
- Seamless integration with Tailwind CSS

### ✅ **React Integration**
- Context-based theme management
- Custom hooks for easy theme access
- TypeScript support throughout

## 🎨 Color System

### **Brand Colors**
```typescript
const brandColors = {
  primary: { light: '#2563EB', dark: '#3B82F6' },    // Blue
  secondary: { light: '#10B981', dark: '#22C55E' },  // Green
  accent: { light: '#F97316', dark: '#FB923C' },     // Orange
  danger: { light: '#EF4444', dark: '#F87171' },     // Red
  warning: { light: '#FACC15', dark: '#FDE047' },    // Yellow
  info: { light: '#3B82F6', dark: '#60A5FA' },       // Blue
  success: { light: '#10B981', dark: '#34D399' },    // Green
};
```

### **Base Colors**
```typescript
const baseColors = {
  background: { light: '#FFFFFF', dark: '#0F172A' },
  surface: { light: '#F8FAFC', dark: '#1E293B' },
  border: { light: '#E5E7EB', dark: '#334155' },
  text: {
    primary: { light: '#111827', dark: '#F1F5F9' },
    muted: { light: '#6B7280', dark: '#94A3B8' },
  },
};
```

### **Category Colors**
```typescript
const categoryColors = {
  'Impact Stories': '#EF4444',      // Red
  'Mental Health': '#10B981',       // Green
  'Partnerships': '#2563EB',        // Blue
  'Healthcare': '#3B82F6',          // Blue
  'Community Outreach': '#F97316',  // Orange
  'Volunteers': '#EC4899',          // Pink
};
```

## 🔧 Usage Examples

### **1. Using React Hooks**

```typescript
import { useTheme, useColors, useThemeClasses } from '../theme';

const MyComponent = () => {
  const { mode, toggleMode } = useTheme();
  const colors = useColors();
  const classes = useThemeClasses();

  return (
    <div className={classes.background}>
      <h1 style={{ color: colors.primary }}>
        Current mode: {mode}
      </h1>
      <button 
        onClick={toggleMode}
        className={classes.primaryButton}
      >
        Toggle Theme
      </button>
    </div>
  );
};
```

### **2. Using Color Utilities**

```typescript
import { getColor, getCategoryColor, colorUtils } from '../theme';

// Get color for current mode
const primaryColor = getColor('brand.primary', 'light');

// Get category color
const storyColor = getCategoryColor('Impact Stories');

// Using color utils class
colorUtils.setMode('dark');
const darkPrimary = colorUtils.primary;
```

### **3. Using CSS Variables**

```css
.my-component {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.my-button {
  background-color: var(--color-btn-primary-bg);
  color: white;
}

.my-button:hover {
  background-color: var(--color-btn-primary-hover);
}
```

### **4. Using Tailwind Classes**

```jsx
// Theme-aware Tailwind classes
<div className="bg-theme-background text-theme-primary border-theme">
  <button className="btn-theme-primary">
    Primary Button
  </button>
  <button className="btn-theme-secondary">
    Secondary Button
  </button>
</div>

// GIV brand colors
<div className="bg-giv-primary text-white">
  Brand Primary Background
</div>
```

## 🚀 Setup and Integration

### **1. Wrap App with ThemeProvider**

```typescript
// main.tsx or App.tsx
import { ThemeProvider } from './theme';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <YourAppComponents />
    </ThemeProvider>
  );
}
```

### **2. Initialize Theme on App Start**

```typescript
import { applyCSSVariables } from './theme';

// Apply initial theme variables
applyCSSVariables('light');
```

## 🎛️ Theme Management

### **Manual Theme Switching**

```typescript
const { mode, setMode, toggleMode } = useTheme();

// Set specific mode
setMode('dark');

// Toggle between modes
toggleMode();
```

### **System Preference Detection**

The theme system automatically:
- Detects system color scheme preference
- Applies appropriate theme on first load
- Listens for system preference changes
- Stores user's manual preference in localStorage

### **Persistence**

Theme preferences are automatically saved to `localStorage` with the key `giv-theme-mode`.

## 🎨 CSS Variables Reference

### **Brand Colors**
- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-danger`
- `--color-warning`
- `--color-info`
- `--color-success`

### **Base Colors**
- `--color-background`
- `--color-surface`
- `--color-border`
- `--color-text-primary`
- `--color-text-muted`

### **Component Colors**
- `--color-navbar-bg`
- `--color-navbar-text`
- `--color-navbar-hover`
- `--color-hero-bg`
- `--color-hero-headline`
- `--color-hero-subtext`
- `--color-card-bg`
- `--color-card-title`
- `--color-card-meta`
- `--color-card-border`
- `--color-stats-bg`
- `--color-stats-numbers`
- `--color-stats-labels`

### **Button Colors**
- `--color-btn-primary-bg`
- `--color-btn-primary-hover`
- `--color-btn-secondary-bg`
- `--color-btn-secondary-hover`

## 🛠️ Utility Classes

### **Background Classes**
- `.bg-theme-background`
- `.bg-theme-surface`
- `.bg-theme-primary`
- `.bg-theme-secondary`

### **Text Classes**
- `.text-theme-primary`
- `.text-theme-muted`
- `.text-theme-brand-primary`
- `.text-theme-brand-secondary`

### **Border Classes**
- `.border-theme`
- `.border-theme-primary`

### **Button Classes**
- `.btn-theme-primary`
- `.btn-theme-secondary`

## 🔄 Migration Guide

### **From Hardcoded Colors**

**Before:**
```jsx
<div className="bg-blue-600 text-white">
  <h1 className="text-gray-900">Title</h1>
</div>
```

**After:**
```jsx
<div className="bg-theme-primary text-white">
  <h1 className="text-theme-primary">Title</h1>
</div>
```

### **From Inline Styles**

**Before:**
```jsx
<div style={{ backgroundColor: '#2563EB', color: '#111827' }}>
  Content
</div>
```

**After:**
```jsx
const colors = useColors();
<div style={{ backgroundColor: colors.primary, color: colors.textPrimary }}>
  Content
</div>
```

## 🎯 Best Practices

### **✅ Do:**
- Use theme-aware colors consistently
- Leverage CSS variables for custom components
- Use React hooks for dynamic theming
- Test components in both light and dark modes
- Follow the established color hierarchy

### **❌ Don't:**
- Hardcode color values in components
- Mix theme-aware and hardcoded colors
- Override theme colors without good reason
- Forget to test dark mode functionality

## 🚀 Future Enhancements

### **Planned Features:**
- **Multiple Theme Variants**: Support for different color schemes
- **Component-Specific Themes**: Granular theming for specific components
- **Animation Support**: Theme transition animations
- **High Contrast Mode**: Accessibility-focused theme variant
- **Custom Theme Builder**: UI for creating custom themes

## 📊 Performance Considerations

- **CSS Variables**: Minimal runtime overhead
- **Context Usage**: Optimized to prevent unnecessary re-renders
- **Bundle Size**: Lightweight implementation (~5KB gzipped)
- **Memory Usage**: Efficient color caching and management

The GIV Society theme system provides a robust foundation for consistent, accessible, and maintainable theming across the entire healthcare platform.

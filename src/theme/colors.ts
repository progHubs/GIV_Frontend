/**
 * GIV Society Color System
 * Centralized color management based on GIV_Color_Usage_Guide.md
 */

// Brand Colors (Core Palette)
export const brandColors = {
  primary: {
    light: '#2563EB', // blue-600
    dark: '#3B82F6',  // blue-500
  },
  secondary: {
    light: '#10B981', // green-500
    dark: '#22C55E',  // green-400
  },
  accent: {
    light: '#F97316', // orange-500
    dark: '#FB923C',  // orange-400
  },
  danger: {
    light: '#EF4444', // red-500
    dark: '#F87171',  // red-400
  },
  warning: {
    light: '#FACC15', // yellow-400
    dark: '#FDE047',  // yellow-300
  },
  info: {
    light: '#3B82F6', // blue-500
    dark: '#60A5FA',  // blue-400
  },
  success: {
    light: '#10B981', // green-500
    dark: '#34D399',  // green-400
  },
} as const;

// Base Colors
export const baseColors = {
  background: {
    light: '#FFFFFF',
    dark: '#0F172A',
  },
  surface: {
    light: '#F8FAFC',
    dark: '#1E293B',
  },
  border: {
    light: '#E5E7EB',
    dark: '#334155',
  },
  text: {
    primary: {
      light: '#111827',
      dark: '#F1F5F9',
    },
    muted: {
      light: '#6B7280',
      dark: '#94A3B8',
    },
  },
} as const;

// Component-specific colors
export const componentColors = {
  navbar: {
    background: {
      light: '#FFFFFF',
      dark: '#1E293B',
    },
    text: {
      light: '#111827',
      dark: '#F1F5F9',
    },
    hoverLink: {
      light: '#2563EB',
      dark: '#3B82F6',
    },
    border: {
      light: '#E5E7EB',
      dark: '#334155',
    },
  },
  hero: {
    background: {
      light: '#F8FAFC',
      dark: '#1E293B',
    },
    headline: {
      light: '#111827',
      dark: '#F1F5F9',
    },
    subtext: {
      light: '#6B7280',
      dark: '#94A3B8',
    },
    ctaButton: {
      light: '#2563EB',
      dark: '#3B82F6',
    },
    ctaHover: {
      light: '#1D4ED8',
      dark: '#60A5FA',
    },
  },
  cards: {
    background: {
      light: '#FFFFFF',
      dark: '#1E293B',
    },
    title: {
      light: '#111827',
      dark: '#F8FAFC',
    },
    metaText: {
      light: '#6B7280',
      dark: '#94A3B8',
    },
    borderShadow: {
      light: '#E5E7EB',
      dark: '#334155',
    },
  },
  stats: {
    background: {
      light: '#F8FAFC',
      dark: '#0F172A',
    },
    numbers: {
      light: '#2563EB',
      dark: '#60A5FA',
    },
    labels: {
      light: '#6B7280',
      dark: '#94A3B8',
    },
  },
  buttons: {
    primary: {
      background: {
        light: '#2563EB',
        dark: '#3B82F6',
      },
      text: '#FFFFFF',
      hover: {
        light: '#1D4ED8',
        dark: '#60A5FA',
      },
    },
    secondary: {
      background: {
        light: '#10B981',
        dark: '#22C55E',
      },
      text: '#FFFFFF',
      hover: {
        light: '#059669',
        dark: '#16A34A',
      },
    },
    outline: {
      border: {
        light: '#2563EB',
        dark: '#60A5FA',
      },
      text: {
        light: '#2563EB',
        dark: '#60A5FA',
      },
      hover: {
        background: {
          light: '#EFF6FF',
          dark: '#1E3A8A',
        },
      },
    },
    danger: {
      background: {
        light: '#EF4444',
        dark: '#F87171',
      },
      text: '#FFFFFF',
      hover: {
        light: '#DC2626',
        dark: '#FCA5A5',
      },
    },
  },
  alerts: {
    success: {
      background: '#D1FAE5',
      text: '#065F46',
      accent: '#10B981',
    },
    warning: {
      background: '#FEF3C7',
      text: '#92400E',
      accent: '#F59E0B',
    },
    error: {
      background: '#FEE2E2',
      text: '#991B1B',
      accent: '#EF4444',
    },
    info: {
      background: '#DBEAFE',
      text: '#1E40AF',
      accent: '#3B82F6',
    },
  },
  footer: {
    background: '#0F172A', // Same for both modes
    text: '#F8FAFC',        // Same for both modes
    linkHover: {
      light: '#3B82F6',
      dark: '#60A5FA',
    },
  },
  forms: {
    inputBackground: {
      light: '#FFFFFF',
      dark: '#1E293B',
    },
    border: {
      light: '#D1D5DB',
      dark: '#334155',
    },
    labelText: {
      light: '#374151',
      dark: '#CBD5E1',
    },
    placeholder: {
      light: '#9CA3AF',
      dark: '#64748B',
    },
  },
  modals: {
    overlay: {
      light: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.7)',
    },
    background: {
      light: '#FFFFFF',
      dark: '#1E293B',
    },
    text: {
      light: '#111827',
      dark: '#F1F5F9',
    },
  },
} as const;

// Category colors for stories/content (mapped to brand colors)
export const categoryColors = {
  'Impact Stories': brandColors.danger.light,
  'Mental Health': brandColors.success.light,
  'Partnerships': brandColors.primary.light,
  'Healthcare': brandColors.info.light,
  'Community Outreach': brandColors.accent.light,
  'Volunteers': '#EC4899', // pink-500
} as const;

// Export all colors as a unified theme
export const theme = {
  brand: brandColors,
  base: baseColors,
  components: componentColors,
  categories: categoryColors,
} as const;

export default theme;

/**
 * Design System Theme Tokens
 * Clean, minimal, professional - Notion/Linear style
 * 
 * Color System:
 * - Three accent colors only: Red, Yellow, Blue
 * - Colors used as accents (borders, titles, numbers, hover states)
 * - Each card/module uses ONE color only
 * - Create hierarchy using opacity variations of the SAME color
 */

export const theme = {
  // Base colors
  background: {
    primary: '#ffffff',
    secondary: '#fafafa', // Very light off-white
  },
  
  text: {
    primary: '#1a1a1a', // Near-black (not pure black)
    secondary: '#4a4a4a', // Medium gray
    tertiary: '#8a8a8a', // Muted gray for helper text
  },

  // Three accent colors
  accent: {
    red: {
      base: '#dc2626', // Red-600
      light: 'rgba(220, 38, 38, 0.12)', // 12% opacity for background tint
      border: 'rgba(220, 38, 38, 0.25)', // 25% opacity for borders
      hover: 'rgba(220, 38, 38, 0.18)', // 18% opacity for hover
      focus: 'rgba(220, 38, 38, 0.3)', // 30% opacity for focus ring
    },
    yellow: {
      base: '#eab308', // Yellow-500
      light: 'rgba(234, 179, 8, 0.12)',
      border: 'rgba(234, 179, 8, 0.25)',
      hover: 'rgba(234, 179, 8, 0.18)',
      focus: 'rgba(234, 179, 8, 0.3)',
    },
    blue: {
      base: '#2563eb', // Blue-600
      light: 'rgba(37, 99, 235, 0.12)',
      border: 'rgba(37, 99, 235, 0.25)',
      hover: 'rgba(37, 99, 235, 0.18)',
      focus: 'rgba(37, 99, 235, 0.3)',
    },
  },

  // Spacing scale
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border radius
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
  },

  // Typography scale
  typography: {
    // Font sizes
    fontSize: {
      xs: '0.75rem',    // 12px - Helper text
      sm: '0.875rem',   // 14px - Small body
      base: '1rem',     // 16px - Body text
      lg: '1.125rem',   // 18px - Card title
      xl: '1.25rem',   // 20px - Section title
      '2xl': '1.5rem',  // 24px - Page title
      '3xl': '1.875rem', // 30px - Large title
      '4xl': '2.25rem',  // 36px - Hero title
    },
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    // Line heights
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    hover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Layout
  layout: {
    maxWidth: '1200px', // Max width for centered layout
    cardPadding: '1.5rem', // 24px
    sectionGap: '1.5rem', // 24px gap between sections
  },

  // Transitions
  transition: {
    default: 'all 0.2s ease-in-out',
    fast: 'all 0.15s ease-in-out',
  },
} as const;

// Type helpers
export type AccentColor = 'red' | 'yellow' | 'blue';
export type AccentColorKey = keyof typeof theme.accent;


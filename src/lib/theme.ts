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
    secondary: '#ffffff', // Pure white
  },
  
  text: {
    primary: '#111827', // Near-black (not pure black)
    secondary: 'rgba(17, 24, 39, 0.6)', // 60% opacity for secondary text
    tertiary: 'rgba(17, 24, 39, 0.4)', // 40% opacity for muted text
  },

  // Three accent colors - strict usage rules
  accent: {
    red: {
      base: '#9F3A2F',
      border: 'rgba(159, 58, 47, 0.25)', // 25% opacity for borders
      hover: 'rgba(159, 58, 47, 0.1)', // 10% opacity for hover background
      focus: 'rgba(159, 58, 47, 0.3)', // 30% opacity for focus ring
    },
    yellow: {
      base: '#E0B84A',
      border: 'rgba(224, 184, 74, 0.25)', // 25% opacity for borders
      hover: 'rgba(224, 184, 74, 0.1)', // 10% opacity for hover background
      focus: 'rgba(224, 184, 74, 0.3)', // 30% opacity for focus ring
    },
    blue: {
      base: '#2F5FA7',
      border: 'rgba(47, 95, 167, 0.25)', // 25% opacity for borders
      hover: 'rgba(47, 95, 167, 0.1)', // 10% opacity for hover background
      focus: 'rgba(47, 95, 167, 0.3)', // 30% opacity for focus ring
    },
  },

  // Spacing scale - 8px system
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
  },

  // Border radius
  radius: {
    sm: '0.5rem',    // 8px
    md: '0.875rem',  // 14px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
  },

  // Typography scale
  typography: {
    // Font sizes
    fontSize: {
      xs: '0.75rem',    // 12px - 单位/说明
      sm: '0.875rem',   // 14px - 正文/输入
      base: '1rem',     // 16px - 模块标题
      lg: '1.125rem',   // 18px - 模块标题
      xl: '1.75rem',    // 28px - 页面标题
      '2xl': '2rem',    // 32px - 页面标题
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

  // Shadows - subtle, hover enhances
  shadow: {
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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


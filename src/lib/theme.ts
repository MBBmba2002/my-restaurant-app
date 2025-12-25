/**
 * Design System Theme Tokens
 * Clean, minimal, professional - Notion/Linear/Stripe style
 * 
 * Color System:
 * - Three accent colors only: Red, Yellow, Blue
 * - Colors used as accents (borders, titles, numbers, hover states)
 * - Each card/module uses ONE color only
 * - Page background: light beige
 * - Card background: white
 */

export const theme = {
  // Base colors
  background: {
    page: '#F5F3F0', // Light beige - 全局背景浅米色
    card: '#ffffff', // White - 卡片底色始终为白色
  },
  
  text: {
    primary: '#111827', // Near-black - 主要文字颜色
    secondary: 'rgba(17, 24, 39, 0.6)', // 60% opacity - 次级说明
    tertiary: 'rgba(17, 24, 39, 0.4)', // 40% opacity - 单位/说明文字
  },

  // Three accent colors
  accent: {
    red: {
      base: '#9F3A2F', // Red
      border: 'rgba(159, 58, 47, 0.25)', // 25% opacity for borders
      hover: 'rgba(159, 58, 47, 0.1)', // 10% opacity for hover
      focus: 'rgba(159, 58, 47, 0.2)', // 20% opacity for focus ring
    },
    yellow: {
      base: '#E0B84A', // Yellow
      border: 'rgba(224, 184, 74, 0.25)', // 25% opacity for borders
      hover: 'rgba(224, 184, 74, 0.1)', // 10% opacity for hover
      focus: 'rgba(224, 184, 74, 0.2)', // 20% opacity for focus ring
    },
    blue: {
      base: '#2F5FA7', // Blue
      border: 'rgba(47, 95, 167, 0.25)', // 25% opacity for borders
      hover: 'rgba(47, 95, 167, 0.1)', // 10% opacity for hover
      focus: 'rgba(47, 95, 167, 0.2)', // 20% opacity for focus ring
    },
  },

  // Spacing scale - 8px体系
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
  },

  // Border radius - 14-16px
  radius: {
    card: '0.875rem', // 14px - Card圆角
    input: '0.5rem',  // 8px - Input圆角
  },

  // Typography scale
  typography: {
    // Font sizes
    fontSize: {
      pageTitle: '1.875rem',  // 30px - 页面标题 28-32px
      moduleTitle: '1rem',     // 16px - 模块标题 16-18px
      body: '0.875rem',        // 14px - 正文/输入
      helper: '0.75rem',       // 12px - 单位/说明
    },
    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },

  // Shadows - 浅阴影，hover增强
  shadow: {
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  // Layout
  layout: {
    maxWidth: '1200px',
    cardPadding: '1.5rem', // 24px
    sectionGap: '1.5rem', // 24px
  },

  // Transitions
  transition: {
    default: 'all 0.2s ease-in-out',
  },
} as const;

// Type helpers
export type AccentColor = 'red' | 'yellow' | 'blue';
export type AccentColorKey = keyof typeof theme.accent;


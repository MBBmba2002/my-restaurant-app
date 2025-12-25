import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accentColor?: AccentColor;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  accentColor = 'blue',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const accent = theme.accent[accentColor];
  
  const sizeStyles = {
    sm: { padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: theme.typography.fontSize.body },
    md: { padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: theme.typography.fontSize.body },
    lg: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, fontSize: theme.typography.fontSize.moduleTitle },
  };

  const getVariantStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontWeight: theme.typography.fontWeight.medium,
      borderRadius: theme.radius.input, // 8px
      transition: theme.transition.default,
      border: 'none',
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      ...sizeStyles[size],
    };
    
    if (variant === 'primary') {
      base.backgroundColor = accent.base;
      base.color = '#ffffff';
    } else if (variant === 'secondary') {
      base.backgroundColor = 'transparent';
      base.color = accent.base;
      base.border = `1px solid ${accent.border}`;
    } else if (variant === 'ghost') {
      base.backgroundColor = 'transparent';
      base.color = accent.base;
    }
    
    return base;
  };

  return (
    <button
      className={className}
      style={getVariantStyle()}
      onFocus={(e) => {
        if (!props.disabled) {
          e.target.style.boxShadow = `0 0 0 3px ${accent.focus}`;
        }
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = 'none';
      }}
      onMouseEnter={(e) => {
        if (!props.disabled && variant === 'primary') {
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled && variant === 'primary') {
          e.currentTarget.style.opacity = '1';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}


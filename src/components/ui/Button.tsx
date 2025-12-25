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
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseStyles = `
    font-medium
    rounded-lg
    transition-all
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:opacity-50
  `;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white hover:opacity-90 active:scale-[0.98]';
      case 'secondary':
        return 'border hover:opacity-90';
      case 'ghost':
        return 'bg-transparent hover:bg-opacity-10';
      default:
        return '';
    }
  };

  const getStyle = () => {
    const base: React.CSSProperties = {};
    
    if (variant === 'primary') {
      base.backgroundColor = accent.base;
      base.color = '#ffffff';
    } else if (variant === 'secondary') {
      base.backgroundColor = accent.light;
      base.color = accent.base;
      base.borderColor = accent.border;
    } else if (variant === 'ghost') {
      base.color = accent.base;
    }
    
    return base;
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${getVariantStyles()}
        ${className}
      `}
      style={getStyle()}
      onFocus={(e) => {
        e.target.style.boxShadow = `0 0 0 3px ${accent.focus}`;
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </button>
  );
}


import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  accentColor?: AccentColor;
  error?: boolean;
}

export function Input({ 
  accentColor = 'blue', 
  error = false,
  className = '',
  ...props 
}: InputProps) {
  const accent = theme.accent[accentColor];
  
  const baseStyles = `
    w-full
    px-4
    py-3
    font-mono
    text-base
    bg-white
    border
    rounded-lg
    transition-all
    text-[#1a1a1a]
    focus:outline-none
    disabled:bg-gray-50
    disabled:cursor-not-allowed
    disabled:opacity-60
  `;

  return (
    <input
      className={`${baseStyles} ${className}`}
      style={{
        borderColor: error ? theme.accent.red.base : accent.border,
      }}
      onFocus={(e) => {
        if (!props.disabled) {
          e.target.style.borderColor = accent.base;
          e.target.style.boxShadow = `0 0 0 3px ${accent.focus}`;
        }
      }}
      onBlur={(e) => {
        e.target.style.borderColor = accent.border;
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
  );
}


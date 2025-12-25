import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface FormRowProps {
  label: string;
  children: React.ReactNode;
  helperText?: string;
  accentColor?: AccentColor;
  className?: string;
  required?: boolean;
}

export function FormRow({ 
  label, 
  children, 
  helperText,
  accentColor,
  className = '',
  required = false 
}: FormRowProps) {
  const accent = accentColor ? theme.accent[accentColor] : null;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        className="block mb-2"
        style={{
          fontSize: theme.typography.fontSize.body, // 14px
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.text.primary,
        }}
      >
        {label}
        {required && (
          <span style={{ color: accent?.base || theme.accent.red.base, marginLeft: '4px' }}>
            *
          </span>
        )}
      </label>
      {children}
      {helperText && (
        <p 
          className="mt-1"
          style={{
            fontSize: theme.typography.fontSize.helper, // 12px
            color: theme.text.tertiary, // 40% opacity
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}


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
        className="block text-sm font-medium mb-2"
        style={{ color: theme.text.primary }}
      >
        {label}
        {required && <span style={{ color: accent?.base || theme.accent.red.base }} className="ml-1">*</span>}
      </label>
      {children}
      {helperText && (
        <p className="mt-1 text-xs" style={{ color: theme.text.secondary }}>
          {helperText}
        </p>
      )}
    </div>
  );
}


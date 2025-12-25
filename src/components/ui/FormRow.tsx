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
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {helperText && (
        <p className="mt-1 text-xs text-[#8a8a8a]">
          {helperText}
        </p>
      )}
    </div>
  );
}


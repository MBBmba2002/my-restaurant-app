import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  accentColor?: AccentColor;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ 
  children, 
  accentColor, 
  className = '', 
  onClick,
  hoverable = false 
}: CardProps) {
  const accent = accentColor ? theme.accent[accentColor] : null;
  
  const baseStyles = `
    bg-white
    rounded-xl
    p-6
    transition-all
    ${hoverable ? 'cursor-pointer' : ''}
  `;

  const borderStyles = accent
    ? 'border-l-4'
    : 'border border-gray-200';

  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${borderStyles}
        ${hoverStyles}
        ${className}
      `}
      onClick={onClick}
      style={{
        ...(accent && {
          borderLeftColor: accent.base,
          backgroundColor: accent.light,
        }),
      }}
    >
      {children}
    </div>
  );
}


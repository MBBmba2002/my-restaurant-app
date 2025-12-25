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
  
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        p-6
        transition-all
        ${hoverable ? 'cursor-pointer hover:-translate-y-0.5' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        boxShadow: theme.shadow.default,
        ...(hoverable && {
          '--hover-shadow': theme.shadow.hover,
        } as React.CSSProperties),
        ...(accent && {
          borderLeft: `4px solid ${accent.base}`,
          borderRight: `1px solid ${accent.border}`,
          borderTop: `1px solid ${accent.border}`,
          borderBottom: `1px solid ${accent.border}`,
        }),
        ...(hoverable && accent && {
          ':hover': {
            boxShadow: theme.shadow.hover,
            backgroundColor: accent.hover,
          },
        }),
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = theme.shadow.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = theme.shadow.default;
        }
      }}
    >
      {children}
    </div>
  );
}


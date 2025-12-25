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
        transition-all
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        borderRadius: theme.radius.card, // 14px
        padding: theme.spacing.md, // 24px
        boxShadow: theme.shadow.default,
        ...(hoverable && {
          ':hover': {
            boxShadow: theme.shadow.hover,
            transform: 'translateY(-2px)',
          },
        }),
        ...(accent && {
          borderLeft: `4px solid ${accent.base}`,
        }),
        ...(!accent && {
          border: `1px solid rgba(0, 0, 0, 0.08)`,
        }),
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = theme.shadow.hover;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = theme.shadow.default;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
}


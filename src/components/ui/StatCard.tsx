import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  accentColor: AccentColor;
  className?: string;
}

export function StatCard({ 
  label, 
  value, 
  unit,
  accentColor,
  className = '' 
}: StatCardProps) {
  const accent = theme.accent[accentColor];
  
  return (
    <div 
      className={`
        bg-white
        text-center
        border-l-4
        ${className}
      `}
      style={{
        borderRadius: theme.radius.card, // 14px
        padding: theme.spacing.md, // 24px
        boxShadow: theme.shadow.default,
        borderLeftColor: accent.base,
        borderLeftWidth: '4px',
      }}
    >
      <div 
        className="mb-2"
        style={{
          fontSize: theme.typography.fontSize.helper, // 12px
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.text.secondary, // 60% opacity
        }}
      >
        {label}
      </div>
      <div 
        className="font-bold font-mono mb-1"
        style={{
          fontSize: '2rem', // 32px for key numbers
          color: accent.base,
        }}
      >
        {value}
      </div>
      {unit && (
        <div 
          style={{
            fontSize: theme.typography.fontSize.helper, // 12px
            color: theme.text.tertiary, // 40% opacity
          }}
        >
          {unit}
        </div>
      )}
    </div>
  );
}


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
        rounded-2xl
        p-6
        text-center
        border-l-4
        ${className}
      `}
      style={{
        borderLeftColor: accent.base,
        borderRight: `1px solid ${accent.border}`,
        borderTop: `1px solid ${accent.border}`,
        borderBottom: `1px solid ${accent.border}`,
        boxShadow: theme.shadow.default,
      }}
    >
      {label && (
        <div className="text-xs font-medium mb-2" style={{ color: theme.text.secondary }}>
          {label}
        </div>
      )}
      <div 
        className="text-3xl font-semibold font-mono mb-1"
        style={{ color: accent.base }}
      >
        {value}
      </div>
      {unit && (
        <div className="text-xs" style={{ color: theme.text.secondary }}>
          {unit}
        </div>
      )}
    </div>
  );
}


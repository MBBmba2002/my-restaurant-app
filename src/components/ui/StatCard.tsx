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
        rounded-xl
        p-6
        text-center
        border-l-4
        ${className}
      `}
      style={{
        backgroundColor: accent.light,
        borderLeftColor: accent.base,
      }}
    >
      <div className="text-sm font-medium mb-2" style={{ color: theme.text.secondary }}>
        {label}
      </div>
      <div 
        className="text-4xl font-bold font-mono mb-1"
        style={{ color: accent.base }}
      >
        {value}
      </div>
      {unit && (
        <div className="text-xs" style={{ color: theme.text.tertiary }}>
          {unit}
        </div>
      )}
    </div>
  );
}


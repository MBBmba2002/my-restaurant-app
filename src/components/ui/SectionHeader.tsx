import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: AccentColor;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  accentColor,
  className = '' 
}: SectionHeaderProps) {
  const accent = accentColor ? theme.accent[accentColor] : null;
  
  return (
    <div className={`mb-6 ${className}`}>
      <h2 
        className="text-lg font-medium mb-1"
        style={accent ? { color: accent.base } : { color: theme.text.primary }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: theme.text.secondary }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}


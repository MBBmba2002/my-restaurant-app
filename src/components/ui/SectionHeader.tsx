import React from 'react';
import { theme, AccentColor } from '@/lib/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accentColor?: AccentColor;
  className?: string;
  isPageTitle?: boolean; // 页面标题 vs 模块标题
}

export function SectionHeader({ 
  title, 
  subtitle, 
  accentColor,
  className = '',
  isPageTitle = false
}: SectionHeaderProps) {
  const accent = accentColor ? theme.accent[accentColor] : null;
  
  return (
    <div className={`mb-6 ${className}`}>
      <h2 
        className="mb-1"
        style={{
          fontSize: isPageTitle ? theme.typography.fontSize.pageTitle : theme.typography.fontSize.moduleTitle,
          fontWeight: theme.typography.fontWeight.semibold,
          color: accent ? accent.base : theme.text.primary,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          className="mt-1"
          style={{
            fontSize: theme.typography.fontSize.helper,
            color: theme.text.secondary, // 60% opacity
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}


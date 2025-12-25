import React from 'react';
import { theme } from '@/lib/theme';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Toast({ show, message, type }: ToastProps) {
  if (!show) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          color: '#ffffff',
        };
      case 'error':
        return {
          backgroundColor: theme.accent.red.base,
          color: '#ffffff',
        };
      case 'info':
      default:
        return {
          backgroundColor: theme.accent.blue.base,
          color: '#ffffff',
        };
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all"
      style={getStyles()}
    >
      {message}
    </div>
  );
}


import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AccentColor } from '@/lib/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  accentColor?: AccentColor;
  showCloseButton?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  accentColor = 'blue',
  showCloseButton = true 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card accentColor={accentColor} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium" style={{ color: '#111827' }}>
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="transition-colors"
                style={{ color: 'rgba(17, 24, 39, 0.4)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(17, 24, 39, 0.4)'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
}


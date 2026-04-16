import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('glass-card border-none rounded-xl p-6 relative overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
}

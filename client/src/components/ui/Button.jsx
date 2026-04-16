import React from 'react';
import { cn } from '../../utils/cn';

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
  const variants = {
    primary: 'bg-brand-900 text-white hover:bg-brand-600 shadow-xl shadow-brand-900/20',
    secondary: 'bg-white text-brand-900 shadow-sm hover:bg-brand-50',
    ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
    danger: 'bg-status-danger text-white hover:bg-red-400 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base font-semibold',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

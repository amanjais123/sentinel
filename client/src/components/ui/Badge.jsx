import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: 'bg-brand-100 text-brand-900',
        success: 'bg-status-safe/10 text-status-safe',
        warning: 'bg-status-warning/10 text-status-warning',
        danger: 'bg-status-danger/10 text-status-danger',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

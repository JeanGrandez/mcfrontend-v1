// src/components/ui/badge.tsx
import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'destructive' | 'warning' | 'secondary';
    size?: 'sm' | 'md';
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
                                                variant = 'default',
                                                size = 'md',
                                                children,
                                                className,
                                                ...props
                                            }) => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium';

    const variants = {
        default: 'bg-primary text-primary-foreground',
        success: 'bg-trade-green text-white',
        destructive: 'bg-destructive text-destructive-foreground',
        warning: 'bg-warning-500 text-white',
        secondary: 'bg-secondary text-secondary-foreground',
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
    };

    return (
        <span
            className={clsx(
                baseClasses,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
      {children}
    </span>
    );
};



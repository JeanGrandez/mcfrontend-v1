// src/components/ui/card.tsx
import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={clsx(
                'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
    return (
        <div className={clsx('flex flex-col space-y-1.5 p-6', className)} {...props}>
            {children}
        </div>
    );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className, ...props }) => {
    return (
        <h3 className={clsx('text-2xl font-semibold leading-none tracking-tight', className)} {...props}>
            {children}
        </h3>
    );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
    return (
        <div className={clsx('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => {
    return (
        <div className={clsx('flex items-center p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
};
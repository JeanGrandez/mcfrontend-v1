// src/components/ui/form.tsx
'use client';
import React from 'react';
import { clsx } from 'clsx';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ children, className, ...props }) => {
    return (
        <form className={clsx('space-y-4', className)} {...props}>
            {children}
        </form>
    );
};

interface FormFieldProps {
    children: React.ReactNode;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ children, className }) => {
    return (
        <div className={clsx('space-y-2', className)}>
            {children}
        </div>
    );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
                                                        children,
                                                        required,
                                                        className,
                                                        ...props
                                                    }) => {
    return (
        <label
            className={clsx(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className
            )}
            {...props}
        >
            {children}
            {required && <span className="text-destructive ml-1">*</span>}
        </label>
    );
};

interface FormMessageProps {
    children: React.ReactNode;
    type?: 'error' | 'helper';
    className?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({
                                                            children,
                                                            type = 'helper',
                                                            className
                                                        }) => {
    return (
        <p className={clsx(
            'text-sm',
            type === 'error' ? 'text-destructive' : 'text-muted-foreground',
            className
        )}>
            {children}
        </p>
    );
};
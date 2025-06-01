// src/components/ui/dialog.tsx
'use client';
import React, { useEffect } from 'react';
import { clsx } from 'clsx';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
                                                  isOpen,
                                                  onClose,
                                                  children,
                                                  size = 'md',
                                                  showCloseButton = true,
                                                  closeOnOverlayClick = true,
                                                  className,
                                              }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div
                className={clsx(
                    'relative w-full bg-background rounded-lg shadow-lg border border-border',
                    'max-h-[90vh] overflow-y-auto',
                    sizeClasses[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Cerrar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {children}
            </div>
        </div>
    );
};

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
    return (
        <div className={clsx('px-6 py-4 border-b border-border', className)}>
            {children}
        </div>
    );
};

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
    return (
        <h2 className={clsx('text-lg font-semibold text-foreground', className)}>
            {children}
        </h2>
    );
};

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
    return (
        <div className={clsx('px-6 py-4', className)}>
            {children}
        </div>
    );
};

interface DialogFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, className }) => {
    return (
        <div className={clsx('px-6 py-4 border-t border-border flex items-center justify-end gap-2', className)}>
            {children}
        </div>
    );
};
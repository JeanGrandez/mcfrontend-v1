// src/components/ui/drawer.tsx
import React, { useEffect } from 'react';
import { clsx } from 'clsx';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    position?: 'left' | 'right' | 'bottom';
    size?: 'sm' | 'md' | 'lg' | 'full';
    showCloseButton?: boolean;
    overlay?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
                                                  isOpen,
                                                  onClose,
                                                  title,
                                                  children,
                                                  position = 'right',
                                                  size = 'md',
                                                  showCloseButton = true,
                                                  overlay = true,
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

    // Posición y animación del drawer
    const positionClasses = {
        left: {
            container: 'left-0 top-0 h-full',
            transform: isOpen ? 'translate-x-0' : '-translate-x-full',
        },
        right: {
            container: 'right-0 top-0 h-full',
            transform: isOpen ? 'translate-x-0' : 'translate-x-full',
        },
        bottom: {
            container: 'bottom-0 left-0 right-0',
            transform: isOpen ? 'translate-y-0' : 'translate-y-full',
        },
    };

    // Tamaños según posición
    const sizeClasses = {
        left: {
            sm: 'w-64',
            md: 'w-80',
            lg: 'w-96',
            full: 'w-full max-w-lg',
        },
        right: {
            sm: 'w-64',
            md: 'w-80',
            lg: 'w-96',
            full: 'w-full max-w-lg',
        },
        bottom: {
            sm: 'h-64',
            md: 'h-80',
            lg: 'h-96',
            full: 'h-3/4',
        },
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            {overlay && (
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity duration-300"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={clsx(
                    'fixed bg-background shadow-xl transition-transform duration-300 ease-in-out',
                    positionClasses[position].container,
                    sizeClasses[position][size],
                    positionClasses[position].transform
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'drawer-title' : undefined}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        {title && (
                            <h2 id="drawer-title" className="text-lg font-semibold">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
                                aria-label="Cerrar panel"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};
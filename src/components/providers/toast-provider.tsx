'use client';

import React, { ReactNode } from 'react';
import { useToastContext, Toast, ToastType } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const { toasts, removeToast } = useToastContext();

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
    const { type, title, message, dismissible, action } = toast;

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-trade-green border-trade-green text-white',
                    icon: CheckCircle,
                };
            case 'error':
                return {
                    container: 'bg-trade-red border-trade-red text-white',
                    icon: AlertCircle,
                };
            case 'warning':
                return {
                    container: 'bg-warning-500 border-warning-500 text-white',
                    icon: AlertTriangle,
                };
            case 'info':
                return {
                    container: 'bg-primary border-primary text-white',
                    icon: Info,
                };
            default:
                return {
                    container: 'bg-gray-800 border-gray-800 text-white',
                    icon: Info,
                };
        }
    };

    const styles = getToastStyles(type);
    const Icon = styles.icon;

    return (
        <div
            className={cn(
                'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg',
                'animate-slide-up backdrop-blur-sm',
                styles.container
            )}
            role="alert"
        >
            {/* Icon */}
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <div className="font-semibold text-sm mb-1">
                        {title}
                    </div>
                )}
                <div className="text-sm opacity-90">
                    {message}
                </div>

                {/* Action button */}
                {action && (
                    <button
                        onClick={() => {
                            action.onClick();
                            onClose();
                        }}
                        className="mt-2 text-sm underline hover:no-underline focus:outline-none"
                    >
                        {action.label}
                    </button>
                )}
            </div>

            {/* Close button */}
            {dismissible && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                    aria-label="Cerrar notificación"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export default ToastProvider;
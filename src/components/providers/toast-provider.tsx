// src/components/providers/toast-provider.tsx
'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProps } from '@/components/ui';

interface ToastContextType {
    showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    hideToast: (id: string) => void;
    hideAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ActiveToast extends ToastProps {
    id: string;
}

interface ToastProviderProps {
    children: React.ReactNode;
    maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
                                                                children,
                                                                maxToasts = 5
                                                            }) => {
    const [toasts, setToasts] = useState<ActiveToast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const hideAll = useCallback(() => {
        setToasts([]);
    }, []);

    const showToast = useCallback((
        toast: Omit<ToastProps, 'id' | 'onClose'>
    ) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ActiveToast = {
            ...toast,
            id,
            onClose: hideToast,
        };

        setToasts(prev => {
            const newToasts = [newToast, ...prev];
            // Limit number of toasts
            return newToasts.slice(0, maxToasts);
        });

        return id;
    }, [hideToast, maxToasts]);

    const showSuccess = useCallback((title: string, message?: string) => {
        return showToast({ type: 'success', title, message });
    }, [showToast]);

    const showError = useCallback((title: string, message?: string) => {
        return showToast({ type: 'error', title, message });
    }, [showToast]);

    const showInfo = useCallback((title: string, message?: string) => {
        return showToast({ type: 'info', title, message });
    }, [showToast]);

    const showWarning = useCallback((title: string, message?: string) => {
        return showToast({ type: 'warning', title, message });
    }, [showToast]);

    const contextValue: ToastContextType = {
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        hideToast,
        hideAll,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
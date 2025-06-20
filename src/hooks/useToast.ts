// src/hooks/useToast.ts
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useContext, createContext } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    dismissible?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface UseToastReturn {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
    success: (message: string, options?: Partial<Toast>) => string;
    error: (message: string, options?: Partial<Toast>) => string;
    warning: (message: string, options?: Partial<Toast>) => string;
    info: (message: string, options?: Partial<Toast>) => string;
    showSuccess: (title: string, message?: string) => string;
    showError: (title: string, message?: string) => string;
    showInfo: (title: string, message?: string) => string;
    showWarning: (title: string, message?: string) => string;
}

let toastCounter = 0;

export function useToast(): UseToastReturn {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    // Generate unique ID
    const generateId = () => `toast-${++toastCounter}-${Date.now()}`;

    // Clear timeout for a specific toast
    const clearTimeout = useCallback((id: string) => {
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
            clearTimeout(timeout);
            timeoutsRef.current.delete(id);
        }
    }, []);

    // Remove toast
    const removeToast = useCallback((id: string) => {
        clearTimeout(id);
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, [clearTimeout]);

    // Add toast
    const addToast = useCallback((toastData: Omit<Toast, 'id'>): string => {
        const id = generateId();
        const duration = toastData.duration ?? 5000; // Default duration
        const dismissible = toastData.dismissible ?? true;

        const toast: Toast = {
            ...toastData,
            id,
            dismissible,
        };

        setToasts(prev => [...prev, toast]);

        // Auto-remove toast after duration
        if (duration > 0) {
            const timeout = setTimeout(() => {
                removeToast(id);
            }, duration);

            timeoutsRef.current.set(id, timeout);
        }

        return id;
    }, [removeToast]);

    // Clear all toasts
    const clearAllToasts = useCallback(() => {
        // Clear all timeouts
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current.clear();

        setToasts([]);
    }, []);

    // Convenience methods for different toast types
    const success = useCallback((message: string, options?: Partial<Toast>): string => {
        return addToast({
            type: 'success',
            message,
            ...options,
        });
    }, [addToast]);

    const error = useCallback((message: string, options?: Partial<Toast>): string => {
        return addToast({
            type: 'error',
            message,
            duration: 0, // Error toasts don't auto-dismiss by default
            ...options,
        });
    }, [addToast]);

    const warning = useCallback((message: string, options?: Partial<Toast>): string => {
        return addToast({
            type: 'warning',
            message,
            ...options,
        });
    }, [addToast]);

    const info = useCallback((message: string, options?: Partial<Toast>): string => {
        return addToast({
            type: 'info',
            message,
            ...options,
        });
    }, [addToast]);

    // New UI convenience methods
    const showSuccess = useCallback((title: string, message?: string): string => {
        return addToast({
            type: 'success',
            title,
            message: message || '',
        });
    }, [addToast]);

    const showError = useCallback((title: string, message?: string): string => {
        return addToast({
            type: 'error',
            title,
            message: message || '',
            duration: 0,
        });
    }, [addToast]);

    const showWarning = useCallback((title: string, message?: string): string => {
        return addToast({
            type: 'warning',
            title,
            message: message || '',
        });
    }, [addToast]);

    const showInfo = useCallback((title: string, message?: string): string => {
        return addToast({
            type: 'info',
            title,
            message: message || '',
        });
    }, [addToast]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
            timeoutsRef.current.clear();
        };
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}

// Create context
const ToastContext = createContext<UseToastReturn | undefined>(undefined);

interface ToastProviderProps {
    children: React.ReactNode;
}

export function useTradingToasts() {
    const toast = useContext(ToastContext);
    
    if (!toast) {
        throw new Error('useTradingToasts must be used within a ToastProvider');
    }

    const orderCreated = useCallback((orderType: 'buy' | 'sell', amount: number) => {
        const action = orderType === 'buy' ? 'compra' : 'venta';
        toast.success(`Orden de ${action} creada por $${amount}`);
    }, [toast]);

    const orderExecuted = useCallback((orderType: 'buy' | 'sell', amount: number, rate: number) => {
        const action = orderType === 'buy' ? 'compra' : 'venta';
        toast.success(`¡Orden ejecutada! ${action} de $${amount} a ${rate}`);
    }, [toast]);

    const orderCancelled = useCallback(() => {
        toast.info('Orden cancelada exitosamente');
    }, [toast]);

    const insufficientFunds = useCallback(() => {
        toast.error('Fondos insuficientes para esta operación');
    }, [toast]);

    const marketClosed = useCallback(() => {
        toast.warning('El mercado está cerrado. No se pueden crear órdenes.');
    }, [toast]);

    const connectionLost = useCallback(() => {
        toast.error('Conexión perdida. Reconectando...', {
            duration: 0,
            dismissible: false,
        });
    }, [toast]);

    const connectionRestored = useCallback(() => {
        toast.success('Conexión restaurada');
    }, [toast]);

    const loginSuccess = useCallback((userName: string) => {
        toast.success(`¡Bienvenido, ${userName}!`);
    }, [toast]);

    const logoutSuccess = useCallback(() => {
        toast.info('Sesión cerrada exitosamente');
    }, [toast]);

    const networkError = useCallback(() => {
        toast.error('Error de conexión. Verifique su internet.');
    }, [toast]);

    const unexpectedError = useCallback(() => {
        toast.error('Ha ocurrido un error inesperado. Inténtelo nuevamente.');
    }, [toast]);

    return {
        orderCreated,
        orderExecuted,
        orderCancelled,
        insufficientFunds,
        marketClosed,
        connectionLost,
        connectionRestored,
        loginSuccess,
        logoutSuccess,
        networkError,
        unexpectedError,
    };
}

// Hook para utilizar el contexto
export function useToastContext(): UseToastReturn {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
}

// Hook para manejar errores de API con toasts
export function useApiErrorToast() {
    const toast = useToastContext();

    const handleError = useCallback((error: any, defaultMessage?: string) => {
        let message = defaultMessage || 'Ha ocurrido un error';

        if (error?.message) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }

        toast.error(message);
    }, [toast]);

    return { handleError };
}

export default useToast;
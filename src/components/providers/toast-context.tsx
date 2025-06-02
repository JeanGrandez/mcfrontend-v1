'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/useToast';

interface ToastProviderContextType {
    showToast: (toast: any) => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    hideToast: (id: string) => void;
    hideAll: () => void;
}

export const ToastProviderContext = createContext<ToastProviderContextType | undefined>(undefined);

export function useToastProvider() {
    const context = useContext(ToastProviderContext);
    if (!context) {
        throw new Error('useToastProvider must be used within a ToastProvider');
    }
    return context;
}

interface ToastContextProviderProps {
    children: ReactNode;
}

export function ToastContextProvider({ children }: ToastContextProviderProps) {
    const { addToast, removeToast, clearAllToasts } = useToast();
    
    const showToast = useCallback((toast: any) => {
        addToast(toast);
    }, [addToast]);

    const showSuccess = useCallback((title: string, message?: string) => {
        addToast({
            type: 'success',
            title,
            message: message || '',
        });
    }, [addToast]);

    const showError = useCallback((title: string, message?: string) => {
        addToast({
            type: 'error',
            title,
            message: message || '',
            duration: 0,
        });
    }, [addToast]);

    const showInfo = useCallback((title: string, message?: string) => {
        addToast({
            type: 'info',
            title,
            message: message || '',
        });
    }, [addToast]);

    const showWarning = useCallback((title: string, message?: string) => {
        addToast({
            type: 'warning',
            title,
            message: message || '',
        });
    }, [addToast]);

    const hideToast = useCallback((id: string) => {
        removeToast(id);
    }, [removeToast]);

    const hideAll = useCallback(() => {
        clearAllToasts();
    }, [clearAllToasts]);

    const value = {
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        hideToast,
        hideAll,
    };

    return (
        <ToastProviderContext.Provider value={value}>
            {children}
        </ToastProviderContext.Provider>
    );
}
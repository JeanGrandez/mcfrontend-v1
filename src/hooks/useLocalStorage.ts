// src/hooks/useLocalStorage.ts - Hook de LocalStorage (Programador A)

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageReturn<T> {
    value: T;
    setValue: (value: SetValue<T>) => void;
    removeValue: () => void;
    loading: boolean;
    error: string | null;
}

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): UseLocalStorageReturn<T> {
    const [value, setValue] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize value from localStorage
    useEffect(() => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            const item = window.localStorage.getItem(key);

            if (item !== null) {
                try {
                    const parsedItem = JSON.parse(item);
                    setValue(parsedItem);
                } catch (parseError) {
                    // If it's not JSON, store as string
                    setValue(item as unknown as T);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading from localStorage');
            console.error(`Error loading localStorage key "${key}":`, err);
        } finally {
            setLoading(false);
        }
    }, [key]);

    // Set value in localStorage and state
    const setStoredValue = useCallback((newValue: SetValue<T>) => {
        try {
            setError(null);

            if (typeof window === 'undefined') {
                console.warn('localStorage is not available');
                return;
            }

            // Allow value to be a function so we have the same API as useState
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;

            // Save to state
            setValue(valueToStore);

            // Save to localStorage
            if (valueToStore === undefined) {
                window.localStorage.removeItem(key);
            } else {
                const serializedValue = typeof valueToStore === 'string'
                    ? valueToStore
                    : JSON.stringify(valueToStore);

                window.localStorage.setItem(key, serializedValue);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving to localStorage');
            console.error(`Error setting localStorage key "${key}":`, err);
        }
    }, [key, value]);

    // Remove value from localStorage and reset to initial value
    const removeValue = useCallback(() => {
        try {
            setError(null);

            if (typeof window === 'undefined') {
                console.warn('localStorage is not available');
                return;
            }

            window.localStorage.removeItem(key);
            setValue(initialValue);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing from localStorage');
            console.error(`Error removing localStorage key "${key}":`, err);
        }
    }, [key, initialValue]);

    return {
        value,
        setValue: setStoredValue,
        removeValue,
        loading,
        error,
    };
}

// Specialized hooks for common use cases
export function useAuthToken() {
    return useLocalStorage<string | null>('trading_auth_token', null);
}

export function useUserPreferences() {
    return useLocalStorage('trading_user_preferences', {
        theme: 'light',
        language: 'es',
        notifications: true,
        autoRefresh: true,
        refreshInterval: 5000,
    });
}

export function useLastLoginData() {
    return useLocalStorage<{
        email?: string;
        dni?: string;
        timestamp: number;
    } | null>('trading_last_login', null);
}

export function useFormData<T extends Record<string, any>>(
    formKey: string,
    initialData: T
) {
    return useLocalStorage<T>(`trading_form_${formKey}`, initialData);
}

// Hook for managing multiple localStorage keys
export function useMultipleLocalStorage<T extends Record<string, any>>(
    keys: (keyof T)[],
    initialValues: T
) {
    const storageHooks = keys.reduce((acc, key) => {
        acc[key] = useLocalStorage(
            `trading_${String(key)}`,
            initialValues[key]
        );
        return acc;
    }, {} as Record<keyof T, UseLocalStorageReturn<T[keyof T]>>);

    const values = keys.reduce((acc, key) => {
        acc[key] = storageHooks[key].value;
        return acc;
    }, {} as T);

    const setValues = useCallback((updates: Partial<T>) => {
        Object.entries(updates).forEach(([key, value]) => {
            if (storageHooks[key as keyof T]) {
                storageHooks[key as keyof T].setValue(value);
            }
        });
    }, [storageHooks]);

    const removeValues = useCallback((keysToRemove?: (keyof T)[]) => {
        const targetKeys = keysToRemove || keys;
        targetKeys.forEach(key => {
            if (storageHooks[key]) {
                storageHooks[key].removeValue();
            }
        });
    }, [storageHooks, keys]);

    const loading = keys.some(key => storageHooks[key].loading);
    const errors = keys
        .map(key => storageHooks[key].error)
        .filter(Boolean);

    return {
        values,
        setValues,
        removeValues,
        loading,
        errors,
        individual: storageHooks,
    };
}

// Hook for localStorage with expiration
export function useLocalStorageWithExpiry<T>(
    key: string,
    initialValue: T,
    expiryInMs: number
) {
    const [value, setValue] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setLoading(true);
            setError(null);

            if (typeof window === 'undefined') {
                setLoading(false);
                return;
            }

            const item = window.localStorage.getItem(key);

            if (item !== null) {
                const parsedItem = JSON.parse(item);

                // Check if item has expiry
                if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
                    // Item has expired, remove it
                    window.localStorage.removeItem(key);
                    setValue(initialValue);
                } else {
                    setValue(parsedItem.value);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading from localStorage');
            console.error(`Error loading localStorage key "${key}":`, err);
        } finally {
            setLoading(false);
        }
    }, [key, initialValue]);

    const setStoredValue = useCallback((newValue: SetValue<T>) => {
        try {
            setError(null);

            if (typeof window === 'undefined') {
                console.warn('localStorage is not available');
                return;
            }

            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            setValue(valueToStore);

            const itemWithExpiry = {
                value: valueToStore,
                expiry: Date.now() + expiryInMs,
            };

            window.localStorage.setItem(key, JSON.stringify(itemWithExpiry));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving to localStorage');
            console.error(`Error setting localStorage key "${key}":`, err);
        }
    }, [key, value, expiryInMs]);

    const removeValue = useCallback(() => {
        try {
            setError(null);

            if (typeof window === 'undefined') {
                console.warn('localStorage is not available');
                return;
            }

            window.localStorage.removeItem(key);
            setValue(initialValue);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error removing from localStorage');
            console.error(`Error removing localStorage key "${key}":`, err);
        }
    }, [key, initialValue]);

    return {
        value,
        setValue: setStoredValue,
        removeValue,
        loading,
        error,
    };
}

export default useLocalStorage;
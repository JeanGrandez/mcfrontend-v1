// src/hooks/useAuth.ts - Hook de autenticación (Programador A)

import { useState, useEffect, useCallback } from 'react';
import { ApiService, TokenManager, UserDataManager, ApiError } from '@/lib/api';
import { reconnectSocket, disconnectSocket } from '@/lib/socket';
import type {
    User,
    LoginCredentials,
    RegisterData,
    AuthContextType
} from '@/types';

interface UseAuthReturn extends AuthContextType {
    error: string | null;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Clear error helper
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initialize auth state on mount
    useEffect(() => {
        initializeAuth();
    }, []);

    // Initialize authentication state
    const initializeAuth = useCallback(async () => {
        try {
            const storedToken = TokenManager.getToken();
            const storedUser = UserDataManager.getUserData();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);

                // Verify token is still valid by fetching profile
                try {
                    const { user: currentUser } = await ApiService.getProfile();
                    setUser(currentUser);
                    UserDataManager.setUserData(currentUser);

                    // Reconnect socket with valid token
                    reconnectSocket(storedToken);
                } catch (error) {
                    // Token is invalid, clear auth state
                    console.warn('Stored token is invalid, clearing auth state');
                    await logout();
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Login function
    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await ApiService.login(credentials);

            if (response.success) {
                const { user: loggedInUser, token: authToken } = response.data;

                // Store auth data
                setUser(loggedInUser);
                setToken(authToken);
                TokenManager.setToken(authToken);
                UserDataManager.setUserData(loggedInUser);

                // Connect socket with new token
                reconnectSocket(authToken);

                console.log('✅ Login successful:', loggedInUser.name);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            const errorMessage = error instanceof ApiError
                ? error.message
                : 'Error al iniciar sesión';

            setError(errorMessage);
            console.error('❌ Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Register function
    const register = useCallback(async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await ApiService.register(data);

            if (response.success) {
                const { user: newUser, token: authToken } = response.data;

                // Store auth data
                setUser(newUser);
                setToken(authToken);
                TokenManager.setToken(authToken);
                UserDataManager.setUserData(newUser);

                // Connect socket with new token
                reconnectSocket(authToken);

                console.log('✅ Registration successful:', newUser.name);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            const errorMessage = error instanceof ApiError
                ? error.message
                : 'Error al registrar usuario';

            setError(errorMessage);
            console.error('❌ Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            // Clear state
            setUser(null);
            setToken(null);
            setError(null);

            // Clear stored data
            TokenManager.removeToken();
            UserDataManager.removeUserData();

            // Disconnect socket
            disconnectSocket();

            console.log('✅ Logout successful');
        } catch (error) {
            console.error('❌ Logout error:', error);
        }
    }, []);

    // Update user data
    const updateUser = useCallback((userData: Partial<User>) => {
        if (!user) return;

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        UserDataManager.setUserData(updatedUser);
    }, [user]);

    // Refresh user profile
    const refreshProfile = useCallback(async () => {
        if (!token) return;

        try {
            const { user: currentUser } = await ApiService.getProfile();
            setUser(currentUser);
            UserDataManager.setUserData(currentUser);
        } catch (error) {
            console.error('Error refreshing profile:', error);
            // If profile fetch fails, token might be invalid
            await logout();
        }
    }, [token, logout]);

    // Check if user is authenticated
    const isAuthenticated = !!(user && token);

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError,
        refreshProfile,
    };
}

// Standalone auth utilities
export const authUtils = {
    // Check if user has specific role
    hasRole: (user: User | null, role: string): boolean => {
        return user?.role === role;
    },

    // Check if user is admin
    isAdmin: (user: User | null): boolean => {
        return user?.role === 'admin';
    },

    // Check if user is trader
    isTrader: (user: User | null): boolean => {
        return user?.role === 'trader';
    },

    // Check if user is regular user
    isRegularUser: (user: User | null): boolean => {
        return user?.role === 'user';
    },

    // Get user display name
    getDisplayName: (user: User | null): string => {
        return user?.name || 'Usuario';
    },

    // Get user initials
    getInitials: (user: User | null): string => {
        if (!user?.name) return 'U';

        const names = user.name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return user.name[0].toUpperCase();
    },

    // Check if token exists and is not expired (basic check)
    hasValidToken: (): boolean => {
        const token = TokenManager.getToken();
        if (!token) return false;

        try {
            // Basic JWT expiration check (without verification)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch {
            return false;
        }
    },
};

export default useAuth;
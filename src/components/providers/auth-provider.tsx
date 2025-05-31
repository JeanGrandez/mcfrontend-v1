// src/components/providers/auth-provider.tsx - Proveedor de autenticación (Programador A)

'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/qr',
];

// Admin routes that require admin role
const ADMIN_ROUTES = [
    '/admin',
];

export function AuthProvider({ children }: AuthProviderProps) {
    const auth = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Route protection effect
    useEffect(() => {
        // Don't redirect while loading
        if (auth.isLoading) return;

        const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
        const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

        // Handle authenticated users
        if (auth.isAuthenticated) {
            // Redirect to dashboard if on auth pages
            if (pathname === '/login' || pathname === '/register') {
                router.replace('/market');
                return;
            }

            // Check admin access
            if (isAdminRoute && !auth.user?.role?.includes('admin')) {
                router.replace('/market');
                return;
            }
        }
        // Handle unauthenticated users
        else {
            // Allow access to public routes
            if (isPublicRoute) {
                return;
            }

            // Redirect to login for protected routes
            const redirectTo = pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : '';
            router.replace(`/login${redirectTo}`);
        }
    }, [auth.isAuthenticated, auth.isLoading, auth.user, pathname, router]);

    // Show loading while checking auth
    if (auth.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

export default AuthProvider;
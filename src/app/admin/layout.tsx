// src/app/admin/layout.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ToastProvider } from '@/components/providers';
import { clsx } from 'clsx';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface AdminNavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    description: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    const navItems: AdminNavItem[] = [
        {
            id: 'market',
            label: 'Vista del Mercado',
            href: '/admin',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            description: 'Monitorear el mercado'
        },
        {
            id: 'panel',
            label: 'Panel de Control',
            href: '/admin/panel',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            description: 'Controles del sistema'
        },
        {
            id: 'users',
            label: 'Gestión de Usuarios',
            href: '/admin/usuarios',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            description: 'Usuarios y exportación'
        }
    ];

    return (
        <ToastProvider>
            <div className="min-h-screen bg-background">
                {/* Admin Header */}
                <header className="bg-card border-b border-border sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-destructive-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold">Panel de Administración</h1>
                                    <p className="text-xs text-muted-foreground">Trading Simulator</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="hidden sm:block text-sm text-muted-foreground">
                                    Admin Dashboard
                                </div>
                                <Link
                                    href="/market"
                                    className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Volver al Mercado
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Admin Navigation */}
                <nav className="bg-muted/30 border-b border-border">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-8 overflow-x-auto">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={clsx(
                                            'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                                            isActive
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                                        )}
                                    >
                    <span className={clsx(isActive ? 'text-primary' : 'text-muted-foreground')}>
                      {item.icon}
                    </span>
                                        <div>
                                            <div>{item.label}</div>
                                            <div className="text-xs text-muted-foreground">{item.description}</div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}


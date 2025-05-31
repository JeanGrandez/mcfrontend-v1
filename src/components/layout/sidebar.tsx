// src/components/layout/sidebar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    userBalance?: {
        usd: number;
        pen: number;
    };
}

interface MenuItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    description?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    isOpen = true,
                                                    onClose,
                                                    userBalance = { usd: 0, pen: 0 }
                                                }) => {
    const pathname = usePathname();

    const menuItems: MenuItem[] = [
        {
            id: 'market',
            label: 'Mercado En Vivo',
            href: '/market',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            description: 'Ver órdenes y operaciones'
        },
        {
            id: 'ranking',
            label: 'Ranking',
            href: '/ranking',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            description: 'Posiciones y ganancias'
        },
        {
            id: 'operations',
            label: 'Mis Operaciones',
            href: '/my-operations',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            description: 'Historial personal'
        }
    ];

    const formatCurrency = (amount: number, currency: 'USD' | 'PEN') => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && onClose && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 z-50 h-full bg-background border-r border-border transition-transform duration-300 ease-in-out',
                    'w-64 lg:translate-x-0 lg:static lg:z-auto',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg">Trading Sim</span>
                        </div>

                        {/* Close button for mobile */}
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={onClose} // Close on mobile when clicking
                                    className={clsx(
                                        'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                                        'hover:bg-accent hover:text-accent-foreground',
                                        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    )}
                                >
                  <span className={clsx(isActive ? 'text-primary-foreground' : 'text-muted-foreground')}>
                    {item.icon}
                  </span>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.label}</div>
                                        {item.description && (
                                            <div className={clsx(
                                                'text-xs',
                                                isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                            )}>
                                                {item.description}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Tu Cuenta Section */}
                    <div className="p-4 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Tu Cuenta</h3>
                        <div className="space-y-3">
                            {/* Saldo USD */}
                            <div className="bg-muted/50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-trade-green rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">$</span>
                                        </div>
                                        <span className="text-sm font-medium">Dólares</span>
                                    </div>
                                    <span className="font-semibold text-trade-green">
                    {formatCurrency(userBalance.usd, 'USD')}
                  </span>
                                </div>
                            </div>

                            {/* Saldo PEN */}
                            <div className="bg-muted/50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">S/</span>
                                        </div>
                                        <span className="text-sm font-medium">Soles</span>
                                    </div>
                                    <span className="font-semibold text-primary">
                    {formatCurrency(userBalance.pen, 'PEN')}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
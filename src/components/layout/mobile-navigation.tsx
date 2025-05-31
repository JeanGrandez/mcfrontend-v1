// src/components/layout/mobile-navigation.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface MobileNavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
}

export const MobileNavigation: React.FC = () => {
    const pathname = usePathname();

    const navItems: MobileNavItem[] = [
        {
            id: 'market',
            label: 'Mercado',
            href: '/market',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            id: 'ranking',
            label: 'Ranking',
            href: '/ranking',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            id: 'operations',
            label: 'Operaciones',
            href: '/my-operations',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            id: 'account',
            label: 'Cuenta',
            href: '/account',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border lg:hidden z-40">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={clsx(
                                'flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1',
                                'hover:bg-accent hover:text-accent-foreground',
                                isActive && 'text-primary'
                            )}
                        >
              <span className={clsx(
                  'transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {item.icon}
              </span>
                            <span className={clsx(
                                'text-xs font-medium mt-1 truncate',
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            )}>
                {item.label}
              </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
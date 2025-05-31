// src/components/layout/breadcrumbs.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
    const pathname = usePathname();

    // Auto-generate breadcrumbs from pathname if items not provided
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }];

        const pathMap: Record<string, string> = {
            market: 'Mercado',
            ranking: 'Ranking',
            'my-operations': 'Mis Operaciones',
            admin: 'Administración',
            panel: 'Panel de Control',
            usuarios: 'Usuarios',
        };

        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;

            breadcrumbs.push({
                label: pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
                href: isLast ? undefined : currentPath,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbItems = items || generateBreadcrumbs();

    if (breadcrumbItems.length <= 1) return null;

    return (
        <nav className={clsx('flex items-center space-x-1 text-sm', className)} aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
                {breadcrumbItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <svg className="w-4 h-4 text-muted-foreground mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
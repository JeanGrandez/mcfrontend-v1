// src/components/layout/header.tsx
'use client';
import React from 'react';
import { Button } from '@/components/ui';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    onMenuClick?: () => void;
    rightContent?: React.ReactNode;
    showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
                                                  title = 'Trading Simulator',
                                                  subtitle,
                                                  onMenuClick,
                                                  rightContent,
                                                  showMenuButton = true,
                                              }) => {
    return (
        <header className="bg-background border-b border-border sticky top-0 z-30">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    {/* Menu Button for Mobile */}
                    {showMenuButton && onMenuClick && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuClick}
                            className="lg:hidden"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    )}

                    {/* Title */}
                    <div>
                        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right Content */}
                {rightContent && (
                    <div className="flex items-center space-x-2">
                        {rightContent}
                    </div>
                )}
            </div>
        </header>
    );
};
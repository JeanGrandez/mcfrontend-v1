// src/app/(dashboard)/layout.tsx
'use client';
import React, { useState } from 'react';
import { Sidebar, Header, MobileNavigation } from '@/components/layout';
import { ToastProvider } from '@/components/providers';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // TODO: Get user balance from auth context or API
    const userBalance = {
        usd: 1250.75,
        pen: 3875.25
    };

    return (
        <ToastProvider>
            <div className="min-h-screen bg-background">
                {/* Sidebar */}
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    userBalance={userBalance}
                />

                {/* Main Content */}
                <div className="lg:pl-64">
                    {/* Header */}
                    <Header
                        onMenuClick={() => setSidebarOpen(true)}
                        rightContent={
                            <div className="flex items-center space-x-2">
                                {/* User info or notifications can go here */}
                                <div className="hidden sm:block text-sm text-muted-foreground">
                                    {new Date().toLocaleDateString('es-PE', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        }
                    />

                    {/* Page Content */}
                    <main className="p-4 pb-20 lg:pb-4">
                        {children}
                    </main>
                </div>

                {/* Mobile Navigation */}
                <MobileNavigation />
            </div>
        </ToastProvider>
    );
}







// src/app/(auth)/layout.tsx - Layout de autenticación (Programador A)

import { ReactNode } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
                    >
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Trading Simulator
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>© 2024 Trading Simulator - Evento de Networking Fintech</p>
                        <p className="mt-1">
                            Simulador educativo con fondos virtuales
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
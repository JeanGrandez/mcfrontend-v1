// src/app/(auth)/login/page.tsx - Página de login (Programador A)

import { Metadata } from 'next';
import { LoginForm } from '@/components/auth';

export const metadata: Metadata = {
    title: 'Iniciar Sesión | Trading Simulator',
    description: 'Accede a tu cuenta del simulador de trading',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
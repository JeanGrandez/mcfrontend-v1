// src/app/(auth)/register/page.tsx - Página de registro (Programador A)

import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth';

export const metadata: Metadata = {
    title: 'Registro | Trading Simulator',
    description: 'Crea tu cuenta en el simulador de trading',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    );
}
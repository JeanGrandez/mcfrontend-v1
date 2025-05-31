// src/components/auth/register-form.tsx - Formulario de registro (Programador A)

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { User, Mail, CreditCard, Phone, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useTradingToasts, useApiErrorToast } from '@/hooks/useToast';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
    className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/market';

    const { register: registerUser, isLoading } = useAuthContext();
    const tradingToasts = useTradingToasts();
    const { handleError } = useApiErrorToast();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            dni: '',
            phone: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);

            tradingToasts.loginSuccess(data.name);

            // Redirect to intended page
            router.push(redirectTo);
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className={cn("w-full max-w-md mx-auto", className)}>
            <div className="bg-card rounded-lg shadow-lg p-6 border">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                        Crear Cuenta
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Únete al simulador de trading
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Nombre completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Juan Pérez"
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-lg border bg-background",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                                    "placeholder:text-muted-foreground",
                                    errors.name ? "border-destructive" : "border-border"
                                )}
                                {...register('name')}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="juan@email.com"
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-lg border bg-background",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                                    "placeholder:text-muted-foreground",
                                    errors.email ? "border-destructive" : "border-border"
                                )}
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* DNI Field */}
                    <div>
                        <label
                            htmlFor="dni"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            DNI
                        </label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                id="dni"
                                type="text"
                                autoComplete="off"
                                placeholder="12345678"
                                maxLength={8}
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-lg border bg-background",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                                    "placeholder:text-muted-foreground",
                                    errors.dni ? "border-destructive" : "border-border"
                                )}
                                {...register('dni')}
                                onChange={(e) => {
                                    // Only allow numbers
                                    const value = e.target.value.replace(/\D/g, '');
                                    setValue('dni', value);
                                }}
                            />
                        </div>
                        {errors.dni && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.dni.message}
                            </p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Teléfono
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                id="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="987654321"
                                maxLength={9}
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 rounded-lg border bg-background",
                                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                                    "placeholder:text-muted-foreground",
                                    errors.phone ? "border-destructive" : "border-border"
                                )}
                                {...register('phone')}
                                onChange={(e) => {
                                    // Only allow numbers
                                    const value = e.target.value.replace(/\D/g, '');
                                    setValue('phone', value);
                                }}
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* Initial Balance Info */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-foreground mb-2">
                            Saldo inicial del simulador:
                        </h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">USD:</span>
                            <span className="font-medium text-trade-green">$1,000.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">PEN:</span>
                            <span className="font-medium text-trade-green">S/. 3,500.00</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={cn(
                            "w-full py-3 px-4 rounded-lg font-medium",
                            "bg-primary text-primary-foreground",
                            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors duration-200",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {(isSubmitting || isLoading) ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Crear Cuenta
                            </>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿Ya tienes una cuenta?{' '}
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/80 font-medium"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

                {/* Terms Notice */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                        Al registrarte, aceptas participar en el simulador de trading.
                        Esta es una aplicación de demostración con fondos virtuales.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
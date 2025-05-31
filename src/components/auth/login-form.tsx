// src/components/auth/login-form.tsx - Formulario de login (Programador A)

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, Mail, CreditCard, LogIn } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useTradingToasts, useApiErrorToast } from '@/hooks/useToast';
import { useLastLoginData } from '@/hooks/useLocalStorage';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface LoginFormProps {
    className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/market';

    const { login, isLoading } = useAuthContext();
    const tradingToasts = useTradingToasts();
    const { handleError } = useApiErrorToast();

    const { value: lastLoginData, setValue: setLastLoginData } = useLastLoginData();

    const [loginMethod, setLoginMethod] = useState<'email' | 'dni'>('email');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        clearErrors,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: lastLoginData?.email || '',
            dni: lastLoginData?.dni || '',
        },
    });

    // Auto-fill from last login data
    useEffect(() => {
        if (lastLoginData) {
            if (lastLoginData.email) {
                setLoginMethod('email');
                setValue('email', lastLoginData.email);
            } else if (lastLoginData.dni) {
                setLoginMethod('dni');
                setValue('dni', lastLoginData.dni);
            }
        }
    }, [lastLoginData, setValue]);

    // Clear errors when switching login method
    useEffect(() => {
        clearErrors();
    }, [loginMethod, clearErrors]);

    const currentEmail = watch('email');
    const currentDni = watch('dni');

    const onSubmit = async (data: LoginFormData) => {
        try {
            const credentials = loginMethod === 'email'
                ? { email: data.email }
                : { dni: data.dni };

            await login(credentials);

            // Save login data for next time
            setLastLoginData({
                email: loginMethod === 'email' ? data.email : undefined,
                dni: loginMethod === 'dni' ? data.dni : undefined,
                timestamp: Date.now(),
            });

            tradingToasts.loginSuccess(
                loginMethod === 'email' ? data.email || '' : `DNI ${data.dni}`
            );

            // Redirect to intended page
            router.push(redirectTo);
        } catch (error) {
            handleError(error);
        }
    };

    const switchLoginMethod = (method: 'email' | 'dni') => {
        setLoginMethod(method);
        // Clear the other field
        if (method === 'email') {
            setValue('dni', '');
        } else {
            setValue('email', '');
        }
    };

    return (
        <div className={cn("w-full max-w-md mx-auto", className)}>
            <div className="bg-card rounded-lg shadow-lg p-6 border">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground">
                        Iniciar Sesión
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Accede a tu cuenta del simulador de trading
                    </p>
                </div>

                {/* Login Method Toggle */}
                <div className="flex mb-6 bg-muted rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => switchLoginMethod('email')}
                        className={cn(
                            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                            "flex items-center justify-center gap-2",
                            loginMethod === 'email'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>
                    <button
                        type="button"
                        onClick={() => switchLoginMethod('dni')}
                        className={cn(
                            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
                            "flex items-center justify-center gap-2",
                            loginMethod === 'dni'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <CreditCard className="w-4 h-4" />
                        DNI
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email Field */}
                    {loginMethod === 'email' && (
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
                                    placeholder="tu@email.com"
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
                    )}

                    {/* DNI Field */}
                    {loginMethod === 'dni' && (
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
                    )}

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
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            href="/register"
                            className="text-primary hover:text-primary/80 font-medium"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                {/* Last Login Hint */}
                {lastLoginData && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">
                            Último acceso:{' '}
                            {lastLoginData.email ? `Email: ${lastLoginData.email}` : ''}
                            {lastLoginData.dni ? `DNI: ${lastLoginData.dni}` : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginForm;
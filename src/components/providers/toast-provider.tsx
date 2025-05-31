// src/components/providers/toast-provider.tsx - Proveedor de notificaciones (Programador A)

'use client';

import { ReactNode } from 'react';
import { ToastProvider as BaseToastProvider, useToastContext } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Toast, ToastType } from '@/hooks/useToast';

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    return (
        <BaseToastProvider>
            {children}
            <ToastContainer />
        </BaseToastProvider>
    );
}

function ToastContainer() {
    const { toasts, removeToast } = useToastContext();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

interface ToastItemProps {
    toast: Toast;
    onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
    const { type, title, message, dismissible, action } = toast;

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-trade-green border-trade-green text-white',
                    icon: CheckCircle,
                };
            case 'error':
                return {
                    container: 'bg-trade-red border-trade-red text-white',
                    icon: AlertCircle,
                };
            case 'warning':
                return {
                    container: 'bg-warning-500 border-warning-500 text-white',
                    icon: AlertTriangle,
                };
            case 'info':
                return {
                    container: 'bg-primary border-primary text-white',
                    icon: Info,
                };
            default:
                return {
                    container: 'bg-gray-800 border-gray-800 text-white',
                    icon: Info,
                };
        }
    };

    const styles = getToastStyles(type);
    const Icon = styles.icon;

    return (
        <div
            className={cn(
                'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg',
                'animate-slide-up backdrop-blur-sm',
                styles.container
            )}
            role="alert"
        >
            {/* Icon */}
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <div className="font-semibold text-sm mb-1">
                        {title}
                    </div>
                )}
                <div className="text-sm opacity-90">
                    {message}
                </div>

                {/* Action button */}
                {action && (
                    <button
                        onClick={() => {
                            action.onClick();
                            onClose();
                        }}
                        className="mt-2 text-sm underline hover:no-underline focus:outline-none"
                    >
                        {action.label}
                    </button>
                )}
            </div>

            {/* Close button */}
            {dismissible && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                    aria-label="Cerrar notificación"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

// Trading-specific toast components
export function OrderSuccessToast({
                                      orderType,
                                      amount,
                                      rate
                                  }: {
    orderType: 'buy' | 'sell';
    amount: number;
    rate: number;
}) {
    const { success } = useToastContext();
    const action = orderType === 'buy' ? 'compra' : 'venta';

    return (
        <button
            onClick={() => success(
                `Orden de ${action} creada por $${amount} a ${rate}`,
                {
                    title: '¡Orden creada!',
                    action: {
                        label: 'Ver mis órdenes',
                        onClick: () => {
                            // Navigate to orders page
                            window.location.href = '/my-operations';
                        }
                    }
                }
            )}
            className="hidden"
        />
    );
}

export function ExecutionToast({
                                   orderType,
                                   amount,
                                   rate
                               }: {
    orderType: 'buy' | 'sell';
    amount: number;
    rate: number;
}) {
    const { success } = useToastContext();
    const action = orderType === 'buy' ? 'Compra' : 'Venta';

    return (
        <button
            onClick={() => success(
                `${action} de $${amount} ejecutada a ${rate}`,
                {
                    title: '¡Operación ejecutada!',
                    action: {
                        label: 'Ver detalles',
                        onClick: () => {
                            // Navigate to operations page
                            window.location.href = '/my-operations';
                        }
                    }
                }
            )}
            className="hidden"
        />
    );
}

export function BalanceUpdateToast({
                                       newUsdBalance,
                                       newPenBalance
                                   }: {
    newUsdBalance: number;
    newPenBalance: number;
}) {
    const { info } = useToastContext();

    return (
        <button
            onClick={() => info(
                `Nuevo saldo: $${newUsdBalance.toFixed(2)} | S/.${newPenBalance.toFixed(2)}`,
                {
                    title: 'Saldo actualizado',
                    duration: 2000,
                }
            )}
            className="hidden"
        />
    );
}

// Error toast helpers
export function ErrorToast({ message }: { message: string }) {
    const { error } = useToastContext();

    return (
        <button
            onClick={() => error(message)}
            className="hidden"
        />
    );
}

export function NetworkErrorToast() {
    const { error } = useToastContext();

    return (
        <button
            onClick={() => error(
                'Error de conexión. Verifique su internet.',
                {
                    title: 'Sin conexión',
                    action: {
                        label: 'Reintentar',
                        onClick: () => {
                            window.location.reload();
                        }
                    }
                }
            )}
            className="hidden"
        />
    );
}

export default ToastProvider;
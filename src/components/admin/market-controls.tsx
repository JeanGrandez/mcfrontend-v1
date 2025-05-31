// src/components/admin/market-controls.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { useToast } from '@/hooks';

interface MarketControlsProps {
    currentStatus?: 'open' | 'closed';
    onStatusChange?: (status: 'open' | 'closed') => void;
}

export const MarketControls: React.FC<MarketControlsProps> = ({
                                                                  currentStatus = 'closed',
                                                                  onStatusChange,
                                                              }) => {
    const [status, setStatus] = useState<'open' | 'closed'>(currentStatus);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    const changeMarketStatus = async (newStatus: 'open' | 'closed') => {
        if (loading) return;

        try {
            setLoading(true);

            const response = await fetch('/api/market/status', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                setStatus(newStatus);
                onStatusChange?.(newStatus);

                showSuccess(
                    `Mercado ${newStatus === 'open' ? 'abierto' : 'cerrado'}`,
                    `El mercado está ahora ${newStatus === 'open' ? 'abierto para operaciones' : 'cerrado'}`
                );
            } else {
                throw new Error(data.message || 'Error al cambiar estado del mercado');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            showError('Error al cambiar estado', errorMessage);
            console.error('Error changing market status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        const newStatus = status === 'open' ? 'closed' : 'open';
        changeMarketStatus(newStatus);
    };

    return (
        <Card className="admin-panel">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Control del Mercado</span>
                    <Badge variant={status === 'open' ? 'success' : 'destructive'}>
                        {status === 'open' ? '🟢 Abierto' : '🔴 Cerrado'}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current Status */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                        <p className="font-medium">Estado actual del mercado</p>
                        <p className="text-sm text-muted-foreground">
                            {status === 'open'
                                ? 'Los usuarios pueden crear y ejecutar órdenes'
                                : 'Las operaciones están suspendidas'
                            }
                        </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${status === 'open' ? 'bg-trade-green animate-pulse' : 'bg-trade-red'}`}></div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                    <Button
                        onClick={handleToggle}
                        loading={loading}
                        variant={status === 'open' ? 'destructive' : 'success'}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? (
                            'Cambiando estado...'
                        ) : status === 'open' ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Cerrar Mercado
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Abrir Mercado
                            </>
                        )}
                    </Button>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => changeMarketStatus('open')}
                            disabled={loading || status === 'open'}
                        >
                            🟢 Abrir
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => changeMarketStatus('closed')}
                            disabled={loading || status === 'closed'}
                        >
                            🔴 Cerrar
                        </Button>
                    </div>
                </div>

                {/* Warning */}
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-warning-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-warning-800">Importante</p>
                            <p className="text-xs text-warning-700">
                                Cerrar el mercado cancelará todas las órdenes pendientes y suspenderá las operaciones.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
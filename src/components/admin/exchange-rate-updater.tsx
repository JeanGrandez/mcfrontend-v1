// src/components/admin/exchange-rate-updater.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';
import { useToast } from '@/hooks';

interface ExchangeRates {
    buyRate: number;
    sellRate: number;
}

export const ExchangeRateUpdater: React.FC = () => {
    const [rates, setRates] = useState<ExchangeRates>({ buyRate: 3.55, sellRate: 3.57 });
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    const handleRateChange = (field: keyof ExchangeRates, value: string) => {
        const numericValue = parseFloat(value) || 0;
        setRates(prev => ({ ...prev, [field]: numericValue }));
    };

    const updateRates = async () => {
        if (loading) return;

        // Validation
        if (rates.buyRate <= 0 || rates.sellRate <= 0) {
            showError('Valores inválidos', 'Los tipos de cambio deben ser mayores a 0');
            return;
        }

        if (rates.buyRate >= rates.sellRate) {
            showError('Valores inválidos', 'El tipo de compra debe ser menor al de venta');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('/api/admin/exchange-rates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    referenceBuyRate: rates.buyRate,
                    referenceSellRate: rates.sellRate,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                showSuccess(
                    'Tipos de cambio actualizados',
                    `Compra: S/${rates.buyRate.toFixed(3)} | Venta: S/${rates.sellRate.toFixed(3)}`
                );
            } else {
                throw new Error(data.message || 'Error al actualizar tipos de cambio');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            showError('Error al actualizar', errorMessage);
            console.error('Error updating exchange rates:', err);
        } finally {
            setLoading(false);
        }
    };

    const spread = rates.sellRate - rates.buyRate;
    const spreadPercentage = ((spread / rates.buyRate) * 100);

    return (
        <Card className="admin-panel">
            <CardHeader>
                <CardTitle>Actualizar Tipo de Cambio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Exchange Rate Inputs */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="TC Compra"
                        type="number"
                        step="0.001"
                        min="0"
                        value={rates.buyRate}
                        onChange={(e) => handleRateChange('buyRate', e.target.value)}
                        leftIcon={<span className="text-trade-green font-bold">S/</span>}
                        helperText="Precio de compra USD"
                    />
                    <Input
                        label="TC Venta"
                        type="number"
                        step="0.001"
                        min="0"
                        value={rates.sellRate}
                        onChange={(e) => handleRateChange('sellRate', e.target.value)}
                        leftIcon={<span className="text-trade-red font-bold">S/</span>}
                        helperText="Precio de venta USD"
                    />
                </div>

                {/* Spread Info */}
                <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Spread:</span>
                        <span className="font-medium">
              S/{spread.toFixed(3)} ({spreadPercentage.toFixed(2)}%)
            </span>
                    </div>
                </div>

                {/* Update Button */}
                <Button
                    onClick={updateRates}
                    loading={loading}
                    variant="primary"
                    className="w-full"
                    disabled={rates.buyRate <= 0 || rates.sellRate <= 0 || rates.buyRate >= rates.sellRate}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualizar Tipos de Cambio
                </Button>

                {/* Warning */}
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-warning-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <p className="text-xs text-warning-700">
                                Los nuevos tipos de cambio afectarán las próximas operaciones y el cálculo del ranking.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
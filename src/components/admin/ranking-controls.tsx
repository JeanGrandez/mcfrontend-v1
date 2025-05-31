// src/components/admin/ranking-controls.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal } from '@/components/ui';
import { useToast, useRanking } from '@/hooks';

export const RankingControls: React.FC = () => {
    const [showResetModal, setShowResetModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError, showWarning } = useToast();
    const { recalculate } = useRanking({ autoRefresh: false });

    const handleRecalculate = async () => {
        try {
            setLoading(true);
            await recalculate();
            showSuccess('Ranking recalculado', 'El ranking se ha actualizado correctamente');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            showError('Error al recalcular', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/market/ranking/reset', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                setShowResetModal(false);
                showSuccess(
                    'Ranking reseteado',
                    'Todos los saldos y posiciones han sido reiniciados'
                );
            } else {
                throw new Error(data.message || 'Error al resetear ranking');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            showError('Error al resetear', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="admin-panel">
            <CardHeader>
                <CardTitle>Control del Ranking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Recalculate Button */}
                <div className="space-y-2">
                    <Button
                        onClick={handleRecalculate}
                        loading={loading}
                        variant="primary"
                        className="w-full"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Recalcular Ranking
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Actualiza las posiciones basándose en las ganancias actuales
                    </p>
                </div>

                {/* Reset Button */}
                <div className="space-y-2">
                    <Button
                        onClick={() => setShowResetModal(true)}
                        variant="destructive"
                        className="w-full"
                        disabled={loading}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Resetear Ranking
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        ⚠️ Reinicia todos los saldos y posiciones a valores iniciales
                    </p>
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-800">Información</p>
                            <p className="text-xs text-blue-700">
                                El ranking se actualiza automáticamente cada vez que se ejecuta una operación.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Reset Confirmation Modal */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="⚠️ Confirmar Reset de Ranking"
                size="md"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm font-medium text-destructive mb-2">
                            Esta acción no se puede deshacer
                        </p>
                        <ul className="text-sm text-destructive/80 space-y-1">
                            <li>• Todos los usuarios volverán a sus saldos iniciales</li>
                            <li>• Las posiciones del ranking se resetearán</li>
                            <li>• Las ganancias/pérdidas se reiniciarán a 0%</li>
                            <li>• El historial de operaciones se mantendrá</li>
                        </ul>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowResetModal(false)}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReset}
                            loading={loading}
                            className="flex-1"
                        >
                            Sí, Resetear Todo
                        </Button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
};
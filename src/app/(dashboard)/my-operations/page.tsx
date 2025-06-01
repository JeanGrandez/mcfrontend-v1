// src/app/(dashboard)/my-operations/page.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';
import { OperationsTable } from '@/components/trading';
import { BalanceCard } from '@/components/account';
import { Breadcrumbs } from '@/components/layout';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useUserBalance } from '@/hooks/useWebSocket';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function MyOperationsPage() {
    const { user } = useAuthContext();
    const userBalance = useUserBalance();
    const [showAllOperations, setShowAllOperations] = useState(false);

    // Use real-time balance if available, otherwise use user data
    const currentBalance = userBalance || (user ? {
        usdBalance: user.usdBalance,
        penBalance: user.penBalance,
        profitPercentage: user.profitPercentage,
    } : null);

    const calculatePortfolioValue = () => {
        if (!currentBalance || !user) return null;

        const initialValue = 1000 + (3500 / 3.5); // Approximate initial value in USD
        const currentValue = currentBalance.usdBalance + (currentBalance.penBalance / 3.5); // Approximate current value

        return {
            initialValue,
            currentValue,
            profitLoss: currentValue - initialValue,
            profitPercentage: ((currentValue - initialValue) / initialValue) * 100
        };
    };

    const portfolio = calculatePortfolioValue();

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mis Operaciones</h1>
                    <p className="text-muted-foreground mt-1">
                        Historial completo de tus transacciones
                    </p>
                </div>

                {user && (
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Ranking Actual</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                #{user.rankingPosition || '--'}
                            </Badge>
                        </div>
                    </div>
                )}
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Current Balance */}
                <div className="lg:col-span-1">
                    <BalanceCard showDetails={true} />
                </div>

                {/* Portfolio Performance */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rendimiento del Portfolio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {portfolio && currentBalance ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Valor Inicial</p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(portfolio.initialValue, 'USD')}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Valor Actual</p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(portfolio.currentValue, 'USD')}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Ganancia/Pérdida</p>
                                        <p className={`text-xl font-bold ${
                                            portfolio.profitLoss >= 0 ? 'text-trade-green' : 'text-trade-red'
                                        }`}>
                                            {portfolio.profitLoss >= 0 ? '+' : ''}
                                            {formatCurrency(portfolio.profitLoss, 'USD')}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Rendimiento</p>
                                        <p className={`text-xl font-bold ${
                                            currentBalance.profitPercentage >= 0 ? 'text-trade-green' : 'text-trade-red'
                                        }`}>
                                            {formatPercentage(currentBalance.profitPercentage)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-4">
                                    <p>Cargando información del portfolio...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Trading Stats */}
            {user && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Operaciones Completadas</p>
                                    <p className="text-2xl font-bold">{user.completedOperations}</p>
                                </div>
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Posición Ranking</p>
                                    <p className="text-2xl font-bold">#{user.rankingPosition || '--'}</p>
                                </div>
                                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Tasa de Comisión</p>
                                    <p className="text-2xl font-bold">{((user.commissionRate || 0.005) * 100).toFixed(2)}%</p>
                                </div>
                                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Operations Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Historial de Operaciones</span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowAllOperations(!showAllOperations)}
                        >
                            {showAllOperations ? 'Ver Menos' : 'Ver Todas'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <OperationsTable
                        showFilters={true}
                        maxRows={showAllOperations ? undefined : 10}
                        userId={user?.id}
                    />
                </CardContent>
            </Card>

            {/* Empty State */}
            {user && user.completedOperations === 0 && (
                <Card className="border-dashed border-2 border-muted-foreground/25">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No hay operaciones aún</h3>
                        <p className="text-muted-foreground mb-6">
                            Comienza a hacer trading para ver tu historial de operaciones aquí.
                            Tienes fondos virtuales listos para usar.
                        </p>
                        <Button asChild>
                            <a href="/market">
                                Ir al Mercado
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Quick Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="secondary" asChild className="h-auto p-4">
                            <a href="/market" className="flex flex-col items-center text-center">
                                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="font-medium">Ir al Mercado</span>
                                <span className="text-xs text-muted-foreground">Crear nuevas órdenes</span>
                            </a>
                        </Button>

                        <Button variant="secondary" asChild className="h-auto p-4">
                            <a href="/ranking" className="flex flex-col items-center text-center">
                                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span className="font-medium">Ver Ranking</span>
                                <span className="text-xs text-muted-foreground">Tu posición actual</span>
                            </a>
                        </Button>

                        <Button variant="secondary" className="h-auto p-4" onClick={() => window.location.reload()}>
                            <div className="flex flex-col items-center text-center">
                                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="font-medium">Actualizar</span>
                                <span className="text-xs text-muted-foreground">Recargar datos</span>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
// src/app/(dashboard)/market/page.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { OrderBookTable, OrderForm } from '@/components/trading';
import { BalanceCard } from '@/components/account';
import { Breadcrumbs } from '@/components/layout';
import { useMarketData, useMarketStatus } from '@/hooks/useWebSocket';
import { useAuthContext } from '@/components/providers/auth-provider';

export default function MarketPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const { user } = useAuthContext();
    const { orderBook } = useMarketData();
    const marketStatus = useMarketStatus();

    const handleOrderCreated = () => {
        // Trigger refresh of market data
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mercado en Vivo</h1>
                    <p className="text-muted-foreground mt-1">
                        Trading de USD/PEN en tiempo real
                    </p>
                </div>

                {/* Market Status Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Estado del Mercado</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                                marketStatus === 'open' ? 'bg-trade-green animate-pulse' : 'bg-trade-red'
                            }`}></div>
                            <span className="font-medium">
                                {marketStatus === 'open' ? 'Abierto' : 'Cerrado'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Grid - Balance and Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* User Balance */}
                <div className="lg:col-span-1">
                    <BalanceCard showDetails={true} />
                </div>

                {/* Market Summary */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen del Mercado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Mejor Compra</p>
                                    <p className="text-xl font-bold text-trade-green">
                                        {orderBook?.bestBuyRate ? orderBook.bestBuyRate.toFixed(3) : '--'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Mejor Venta</p>
                                    <p className="text-xl font-bold text-trade-red">
                                        {orderBook?.bestSellRate ? orderBook.bestSellRate.toFixed(3) : '--'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Órdenes Compra</p>
                                    <p className="text-xl font-bold text-primary">
                                        {orderBook?.buyOrders.length || 0}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Órdenes Venta</p>
                                    <p className="text-xl font-bold text-primary">
                                        {orderBook?.sellOrders.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Trading Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Order Form */}
                <div className="xl:col-span-1">
                    <OrderForm
                        onOrderCreated={handleOrderCreated}
                        className="sticky top-4"
                    />
                </div>

                {/* Order Book */}
                <div className="xl:col-span-3">
                    <OrderBookTable
                        key={refreshKey}
                        onCreateOrder={handleOrderCreated}
                    />
                </div>
            </div>

            {/* Market Closed Notice */}
            {marketStatus === 'closed' && (
                <Card className="border-warning-200 bg-warning-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-warning-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-warning-800">Mercado Cerrado</h3>
                                <p className="text-sm text-warning-700">
                                    El mercado está cerrado. No se pueden crear nuevas órdenes en este momento.
                                    Puedes consultar el libro de órdenes y ver las operaciones existentes.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions for Mobile */}
            <div className="xl:hidden">
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="p-4 bg-trade-green/10 border border-trade-green/20 rounded-lg hover:bg-trade-green/20 transition-colors text-left"
                                disabled={marketStatus === 'closed'}
                            >
                                <div className="text-trade-green font-medium">Comprar USD</div>
                                <div className="text-sm text-muted-foreground">
                                    Al mejor precio: {orderBook?.bestSellRate?.toFixed(3) || '--'}
                                </div>
                            </button>

                            <button
                                className="p-4 bg-trade-red/10 border border-trade-red/20 rounded-lg hover:bg-trade-red/20 transition-colors text-left"
                                disabled={marketStatus === 'closed'}
                            >
                                <div className="text-trade-red font-medium">Vender USD</div>
                                <div className="text-sm text-muted-foreground">
                                    Al mejor precio: {orderBook?.bestBuyRate?.toFixed(3) || '--'}
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Info for First Time */}
            {user && user.completedOperations === 0 && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-primary">¡Bienvenido al Trading Simulator!</h3>
                                <p className="text-sm text-primary/80 mt-1">
                                    Tienes ${user.usdBalance.toFixed(2)} USD y S/{user.penBalance.toFixed(2)} PEN para comenzar.
                                    Puedes crear órdenes de compra/venta usando el formulario de la izquierda o haciendo clic en las órdenes del libro.
                                </p>
                                <div className="mt-3 space-y-1 text-xs text-primary/70">
                                    <p>💡 <strong>Consejo:</strong> Observa el spread entre compra y venta para encontrar oportunidades</p>
                                    <p>📊 <strong>Objetivo:</strong> Maximiza tu ganancia porcentual para subir en el ranking</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
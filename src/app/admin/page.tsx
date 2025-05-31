// src/app/admin/page.tsx
'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { AdminStats } from '@/components/admin';

export default function AdminMarketPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Vista del Mercado - Admin</h1>
                <p className="text-muted-foreground mt-1">
                    Monitoreo en tiempo real del mercado de trading
                </p>
            </div>

            {/* System Stats */}
            <AdminStats refreshInterval={30000} showRealTime={true} />

            {/* Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Orders Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Activas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Órdenes de Compra</span>
                                <span className="text-lg font-bold text-trade-green">24</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Órdenes de Venta</span>
                                <span className="text-lg font-bold text-trade-red">18</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2">
                                <span className="text-sm font-medium">Total Activas</span>
                                <span className="text-xl font-bold">42</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-sm">
                                <div className="w-2 h-2 bg-trade-green rounded-full"></div>
                                <span className="text-muted-foreground">Operación ejecutada</span>
                                <span className="font-medium">$250 a S/3.52</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-muted-foreground">Nuevo usuario</span>
                                <span className="font-medium">Juan Pérez registrado</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-muted-foreground">Orden cancelada</span>
                                <span className="font-medium">$100 a S/3.55</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <div className="w-2 h-2 bg-trade-green rounded-full"></div>
                                <span className="text-muted-foreground">Operación ejecutada</span>
                                <span className="font-medium">$500 a S/3.51</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <p className="font-medium">Panel de Control</p>
                            <p className="text-xs text-muted-foreground">Controles del sistema</p>
                        </button>

                        <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left">
                            <div className="w-8 h-8 bg-trade-green/20 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-4 h-4 text-trade-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="font-medium">Exportar Datos</p>
                            <p className="text-xs text-muted-foreground">Descargar Excel</p>
                        </button>

                        <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left">
                            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <p className="font-medium">Recalcular Ranking</p>
                            <p className="text-xs text-muted-foreground">Actualizar posiciones</p>
                        </button>

                        <button className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mb-2">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <p className="font-medium">Tipo de Cambio</p>
                            <p className="text-xs text-muted-foreground">Actualizar precios</p>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


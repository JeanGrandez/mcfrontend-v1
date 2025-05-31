// src/app/admin/panel/page.tsx
'use client';
import React from 'react';
import {
    AdminStats,
    MarketControls,
    RankingControls,
    ExchangeRateUpdater
} from '@/components/admin';

export default function AdminPanelPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
                <p className="text-muted-foreground mt-1">
                    Gestión completa del sistema de trading
                </p>
            </div>

            {/* System Overview */}
            <AdminStats refreshInterval={30000} showRealTime={true} />

            {/* Control Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Market Controls */}
                <MarketControls
                    currentStatus="closed"
                    onStatusChange={(status) => {
                        console.log('Market status changed to:', status);
                    }}
                />

                {/* Exchange Rate Updater */}
                <ExchangeRateUpdater />
            </div>

            {/* Ranking Controls */}
            <div className="grid grid-cols-1 gap-6">
                <RankingControls />
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="admin-stat">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Estado del Sistema</p>
                            <p className="text-lg font-bold text-trade-green">Operativo</p>
                        </div>
                        <div className="w-3 h-3 bg-trade-green rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="admin-stat">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Base de Datos</p>
                            <p className="text-lg font-bold text-trade-green">Conectada</p>
                        </div>
                        <div className="w-3 h-3 bg-trade-green rounded-full"></div>
                    </div>
                </div>

                <div className="admin-stat">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">WebSocket</p>
                            <p className="text-lg font-bold text-trade-green">Activo</p>
                        </div>
                        <div className="w-3 h-3 bg-trade-green rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

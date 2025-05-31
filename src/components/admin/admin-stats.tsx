// src/components/admin/admin-stats.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from '@/components/ui';
import { useToast } from '@/hooks';

interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    totalOperations: number;
    totalVolume: number;
    marketStatus: 'open' | 'closed';
    lastUpdate: string;
}

interface AdminStatsProps {
    refreshInterval?: number;
    showRealTime?: boolean;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
                                                          refreshInterval = 30000,
                                                          showRealTime = true,
                                                      }) => {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useToast();

    const fetchStats = async () => {
        try {
            setError(null);

            const response = await fetch('/api/admin/stats', {
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
                setStats(data.data);
            } else {
                throw new Error(data.message || 'Error al obtener estadísticas');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            showError('Error al cargar estadísticas', errorMessage);
            console.error('Error fetching admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (!showRealTime) return;

        const interval = setInterval(fetchStats, refreshInterval);
        return () => clearInterval(interval);
    }, [showRealTime, refreshInterval]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="admin-stat">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center h-20">
                                <Spinner size="md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error || !stats) {
        return (
            <Card className="admin-stat">
                <CardContent className="p-6 text-center">
                    <div className="text-destructive mb-4">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="font-medium">Error al cargar estadísticas</p>
                        <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Reintentar
                    </button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <Card className="admin-stat">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            </div>
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Users */}
                <Card className="admin-stat">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Usuarios Activos</p>
                                <p className="text-2xl font-bold text-trade-green">{stats.activeUsers}</p>
                            </div>
                            <div className="w-8 h-8 bg-trade-green/20 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-trade-green rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Operations */}
                <Card className="admin-stat">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Operaciones</p>
                                <p className="text-2xl font-bold">{stats.totalOperations}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Volume */}
                <Card className="admin-stat">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Volumen Total</p>
                                <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
                            </div>
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Badge variant={stats.marketStatus === 'open' ? 'success' : 'destructive'}>
                                {stats.marketStatus === 'open' ? '🟢 Mercado Abierto' : '🔴 Mercado Cerrado'}
                            </Badge>
                            {showRealTime && (
                                <Badge variant="secondary" size="sm">
                                    <div className="w-2 h-2 bg-trade-green rounded-full animate-pulse mr-1"></div>
                                    En vivo
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Última actualización: {formatDateTime(stats.lastUpdate)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
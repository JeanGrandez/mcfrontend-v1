// src/app/(dashboard)/ranking/page.tsx
'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { RankingTable } from '@/components/ranking';
import { Breadcrumbs } from '@/components/layout';
import { useRanking } from '@/hooks';

export default function RankingPage() {
    const { currentUserPosition, ranking } = useRanking();

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Ranking de Traders</h1>
                    <p className="text-muted-foreground mt-1">
                        Clasificación de participantes ordenada por ganancias
                    </p>
                </div>

                {currentUserPosition && (
                    <Card className="bg-primary/10 border-primary/20">
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Tu posición</p>
                                <p className="text-2xl font-bold text-primary">#{currentUserPosition}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Ranking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Participantes</p>
                                <p className="text-2xl font-bold">{ranking.length}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ganancia Promedio</p>
                                <p className="text-2xl font-bold text-trade-green">
                                    +{ranking.length > 0 ? (ranking.reduce((sum, user) => sum + user.profitPercentage, 0) / ranking.length).toFixed(2) : '0.00'}%
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-trade-green/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-trade-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7h-10" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Operaciones</p>
                                <p className="text-2xl font-bold">
                                    {ranking.reduce((sum, user) => sum + user.operations, 0)}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Ranking Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Ranking Completo</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <RankingTable showTopThree={true} />
                </CardContent>
            </Card>
        </div>
    );
}


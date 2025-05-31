// src/components/ranking/ranking-table.tsx
'use client';
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, Spinner } from '@/components/ui';
import { useRanking } from '@/hooks';
import { RankingRow } from './ranking-row';
import { TopThreeHighlight } from './top-three-highlight';

interface RankingTableProps {
    showTopThree?: boolean;
    compact?: boolean;
    maxRows?: number;
}

export const RankingTable: React.FC<RankingTableProps> = ({
                                                              showTopThree = true,
                                                              compact = false,
                                                              maxRows,
                                                          }) => {
    const { ranking, loading, error, refetch } = useRanking();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-muted-foreground">Cargando ranking...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-destructive mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-medium">Error al cargar ranking</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <button
                    onClick={refetch}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (ranking.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium">No hay datos de ranking</p>
                    <p className="text-sm mt-1">Los rankings aparecerán cuando haya operaciones</p>
                </div>
            </div>
        );
    }

    const displayedRanking = maxRows ? ranking.slice(0, maxRows) : ranking;
    const topThree = ranking.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Top 3 Highlight */}
            {showTopThree && topThree.length >= 3 && !compact && (
                <TopThreeHighlight users={topThree} />
            )}

            {/* Main Ranking Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableHead className="w-16">Pos.</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead className="text-right">Ganancia</TableHead>
                            {!compact && <TableHead className="text-right">Operaciones</TableHead>}
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {displayedRanking.map((user, index) => (
                            <RankingRow
                                key={user.id}
                                user={user}
                                compact={compact}
                                isTopThree={user.position <= 3}
                                showAnimation={index < 10} // Only animate top 10 for performance
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Show more indicator */}
            {maxRows && ranking.length > maxRows && (
                <div className="text-center text-sm text-muted-foreground">
                    Y {ranking.length - maxRows} participantes más...
                </div>
            )}
        </div>
    );
};
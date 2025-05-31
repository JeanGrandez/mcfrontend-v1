// src/hooks/useRanking.ts
'use client';
import { useState, useEffect, useCallback } from 'react';

export interface RankingUser {
    id: string;
    name: string;
    position: number;
    profitPercentage: number;
    operations: number;
    isCurrentUser?: boolean;
}

interface UseRankingOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
}

interface UseRankingReturn {
    ranking: RankingUser[];
    loading: boolean;
    error: string | null;
    currentUserPosition: number | null;
    refetch: () => Promise<void>;
    recalculate: () => Promise<void>;
}

export const useRanking = (options: UseRankingOptions = {}): UseRankingReturn => {
    const { autoRefresh = true, refreshInterval = 30000 } = options;

    const [ranking, setRanking] = useState<RankingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null);

    const fetchRanking = useCallback(async () => {
        try {
            setError(null);

            // TODO: Replace with actual API call
            const response = await fetch('/api/market/ranking', {
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
                const rankingData = data.data.ranking || [];
                setRanking(rankingData);

                // Find current user position
                const currentUser = rankingData.find((user: RankingUser) => user.isCurrentUser);
                setCurrentUserPosition(currentUser?.position || null);
            } else {
                throw new Error(data.message || 'Error al obtener ranking');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error fetching ranking:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const recalculate = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/market/ranking/recalculate', {
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
                await fetchRanking(); // Refresh data after recalculation
            } else {
                throw new Error(data.message || 'Error al recalcular ranking');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error recalculating ranking:', err);
        }
    }, [fetchRanking]);

    // Initial fetch
    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    // Auto refresh
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(fetchRanking, refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchRanking]);

    // WebSocket integration (for real-time updates)
    useEffect(() => {
        // TODO: Connect to WebSocket for real-time ranking updates
        // This would be handled by a separate WebSocket hook from Programador A

        const handleRankingUpdate = (event: CustomEvent) => {
            if (event.detail?.ranking) {
                setRanking(event.detail.ranking);
                const currentUser = event.detail.ranking.find((user: RankingUser) => user.isCurrentUser);
                setCurrentUserPosition(currentUser?.position || null);
            }
        };

        // Listen for WebSocket events via custom events
        window.addEventListener('ranking:updated', handleRankingUpdate as EventListener);

        return () => {
            window.removeEventListener('ranking:updated', handleRankingUpdate as EventListener);
        };
    }, []);

    return {
        ranking,
        loading,
        error,
        currentUserPosition,
        refetch: fetchRanking,
        recalculate,
    };
};

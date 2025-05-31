// src/hooks/useRanking.ts - Hook de ranking (Programador B)

import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/lib/api';
import { useRankingUpdates } from './useWebSocket';
import type { RankingData, RankingUser } from '@/types';

interface UseRankingReturn {
    ranking: RankingUser[];
    isLoading: boolean;
    error: string | null;
    refreshRanking: () => Promise<void>;
    currentUserPosition: number | null;
}

export function useRanking(): UseRankingReturn {
    const [ranking, setRanking] = useState<RankingUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen for real-time ranking updates
    const rankingUpdates = useRankingUpdates();

    // Load initial ranking data
    const loadRanking = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await ApiService.getRanking();
            setRanking(data.ranking || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading ranking');
            console.error('Error loading ranking:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadRanking();
    }, [loadRanking]);

    // Update ranking when WebSocket updates arrive
    useEffect(() => {
        if (rankingUpdates) {
            setRanking(rankingUpdates.ranking || []);
        }
    }, [rankingUpdates]);

    // Find current user position
    const currentUserPosition = ranking.find(user => user.isCurrentUser)?.position || null;

    return {
        ranking,
        isLoading,
        error,
        refreshRanking: loadRanking,
        currentUserPosition,
    };
}

export default useRanking;
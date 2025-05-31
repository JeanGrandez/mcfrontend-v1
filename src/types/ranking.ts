// src/types/ranking.ts
export interface RankingUser {
    id: string;
    name: string;
    position: number;
    profitPercentage: number;
    operations: number;
    isCurrentUser?: boolean;
    avatar?: string;
    lastActive?: string;
}

export interface RankingUpdate {
    rankings: RankingUser[];
    lastUpdate: string;
    totalParticipants: number;
    averageProfit: number;
}

export interface UserPortfolio {
    userId: string;
    usdBalance: number;
    penBalance: number;
    initialUsd: number;
    initialPen: number;
    currentValue: number;
    initialValue: number;
    profitLoss: number;
    profitPercentage: number;
}

export interface RankingPeriod {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface RankingFilters {
    period?: string;
    minOperations?: number;
    userRole?: 'user' | 'trader';
    sortBy?: 'profit' | 'operations' | 'name';
    sortOrder?: 'asc' | 'desc';
}
// src/types/ranking.ts - Tipos para ranking (Programador B)

export interface RankingUser {
    id: string;
    name: string;
    profit: string;
    position: number;
    operations: number;
    isCurrentUser?: boolean;
}

export interface RankingData {
    ranking: RankingUser[];
}
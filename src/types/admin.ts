// src/types/admin.ts - Tipos para admin (Programador B)

export interface AdminStats {
    totalUsers: number;
    totalOperations: number;
    totalVolume: number;
    averagePrice: number;
    marketStatus: 'open' | 'closed';
}

export interface MarketConfig {
    marketStatus: 'open' | 'closed';
    baseCommissionRate: number;
    minOperationAmount: number;
    maxActiveOrders: number;
    referenceBuyRate: number;
    referenceSellRate: number;
}

export interface UserManagement {
    users: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        usdBalance: number;
        penBalance: number;
        profitPercentage: number;
        completedOperations: number;
    }>;
}
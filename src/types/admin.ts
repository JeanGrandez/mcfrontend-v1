// src/types/admin.ts
export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalOperations: number;
    totalVolume: number;
    marketStatus: 'open' | 'closed';
    lastUpdate: string;
    averageOperationSize?: number;
    topTraders?: Array<{
        name: string;
        profit: number;
    }>;
}

export interface ExchangeRateUpdate {
    referenceBuyRate: number;
    referenceSellRate: number;
    lastUpdate?: string;
    updatedBy?: string;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    dni: string;
    phone: string;
    usdBalance: number;
    penBalance: number;
    profitPercentage: number;
    rankingPosition: number;
    completedOperations: number;
    role: 'user' | 'trader' | 'admin';
    registrationDate: string;
    lastLogin?: string;
}

export interface MarketControl {
    status: 'open' | 'closed';
    lastChanged: string;
    changedBy: string;
    reason?: string;
}

export interface SystemHealth {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memoryUsage: number;
    databaseConnected: boolean;
    websocketConnected: boolean;
    lastCheck: string;
}

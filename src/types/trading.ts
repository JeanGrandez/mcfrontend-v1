// src/types/trading.ts - Tipos para trading (Programador A)

export type OrderType = 'buy' | 'sell';
export type OrderStatus = 'active' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    userId: string;
    type: OrderType;
    usdAmount: number;
    exchangeRate: number;
    status: OrderStatus;
    creationDate: string;
    executionDate?: string;
    isOwn?: boolean; // Para identificar órdenes propias en el frontend
}

export interface OrderFormData {
    type: OrderType;
    usdAmount: number;
    exchangeRate: number;
    isMarketPrice?: boolean;
}

export interface Operation {
    id: string;
    buyOrderId: string;
    sellOrderId: string;
    buyerId: string;
    sellerId: string;
    usdAmount: number;
    exchangeRate: number;
    date: string;
    buyerCommission: number;
    sellerCommission: number;
}

export interface OrderBook {
    buyOrders: Order[];
    sellOrders: Order[];
    marketStatus: 'open' | 'closed';
    bestBuyRate: number;
    bestSellRate: number;
    lastOperation?: {
        amount: number;
        rate: number;
        date: string;
    };
}

export interface UserBalance {
    usdBalance: number;
    penBalance: number;
    profitPercentage: number;
}

export interface MarketData {
    orderBook: OrderBook;
    userBalance: UserBalance;
    userOrders: {
        buyOrders: Order[];
        sellOrders: Order[];
    };
}

// WebSocket Events
export interface WebSocketEvents {
    'market:update': OrderBook;
    'balance:update': UserBalance;
    'order:created': Order;
    'order:executed': Operation;
    'order:cancelled': Order;
    'market:status': { status: 'open' | 'closed' };
    'ranking:update': never; // Definido por Programador B
}

export interface OrderCalculation {
    penAmount: number;
    commission: number;
    totalToReceive: number;
    totalToPay: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
// src/types/index.ts - Exportaciones principales (Programador A)

// Auth types
export type {
    User,
    LoginCredentials,
    RegisterData,
    AuthResponse,
    AuthContextType,
    AuthError
} from './auth';

// Trading types
export type {
    OrderType,
    OrderStatus,
    Order,
    OrderFormData,
    Operation,
    OrderBook,
    UserBalance,
    MarketData,
    WebSocketEvents,
    OrderCalculation,
    ApiResponse
} from './trading';

// Ranking types (para uso del Programador B)
export type {
    RankingUser,
    RankingData
} from './ranking';

// Admin types (para uso del Programador B)
export type {
    AdminStats,
    MarketConfig,
    UserManagement
} from './admin';
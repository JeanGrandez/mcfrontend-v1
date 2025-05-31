
// src/lib/constants.ts - Constantes del sistema (Programador A)

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
} as const;

// Trading Constants
export const TRADING = {
    MIN_USD_AMOUNT: 0.01,
    MAX_USD_AMOUNT: 1000000,
    MIN_EXCHANGE_RATE: 0.001,
    MAX_EXCHANGE_RATE: 20,
    MAX_ACTIVE_ORDERS: 5,
    DEFAULT_COMMISSION_RATE: 0.005,
    INITIAL_USD_BALANCE: 1000,
    INITIAL_PEN_BALANCE: 3500,
} as const;

// Order Types

// src/lib/constants.ts
export const APP_CONFIG = {
    NAME: 'Trading Simulator',
    VERSION: '1.0.0',
    DESCRIPTION: 'Simulador de trading para evento fintech',
    API_VERSION: 'v1',
} as const;

export const CURRENCIES = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'Dólar Americano',
        precision: 2,
    },
    PEN: {
        code: 'PEN',
        symbol: 'S/',
        name: 'Sol Peruano',
        precision: 2,
    },
} as const;

export const MARKET_STATUS = {
    OPEN: 'open',
    CLOSED: 'closed',
} as const;


export const ORDER_TYPES = {
    BUY: 'buy',
    SELL: 'sell',
} as const;

export const ORDER_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;


export const USER_ROLES = {
    USER: 'user',
    TRADER: 'trader',
    ADMIN: 'admin',
} as const;


// Market Status
export const MARKET_STATUS = {
    OPEN: 'open',
    CLOSED: 'closed',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'trading_auth_token',
    USER_DATA: 'trading_user_data',
    LAST_LOGIN: 'trading_last_login',
} as const;

// WebSocket Events
export const WS_EVENTS = {
    // Client to Server
    SUBSCRIBE_MARKET: 'subscribe:market',
    SUBSCRIBE_RANKING: 'subscribe:ranking',

    // Server to Client
    MARKET_UPDATE: 'market:update',
    BALANCE_UPDATE: 'balance:update',
    ORDER_CREATED: 'order:created',
    ORDER_EXECUTED: 'order:executed',
    ORDER_CANCELLED: 'order:cancelled',
    MARKET_STATUS: 'market:status',
    RANKING_UPDATE: 'ranking:update',
} as const;

// Form Validation
export const VALIDATION = {
    DNI_PATTERN: /^\d{8}$/,
    PHONE_PATTERN: /^9\d{8}$/,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NAME_PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Verifique su internet.',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    MARKET_CLOSED: 'El mercado está cerrado',
    INSUFFICIENT_FUNDS: 'Fondos insuficientes',
    INVALID_AMOUNT: 'Monto inválido',
    MAX_ORDERS_REACHED: 'Máximo de órdenes activas alcanzado',
    REQUIRED_FIELD: 'Este campo es requerido',
    INVALID_EMAIL: 'Email inválido',
    INVALID_DNI: 'DNI debe tener 8 dígitos',
    INVALID_PHONE: 'Teléfono debe tener 9 dígitos y empezar con 9',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    ORDER_CREATED: 'Orden creada exitosamente',
    ORDER_CANCELLED: 'Orden cancelada exitosamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    REGISTER_SUCCESS: 'Registro exitoso',
    LOGOUT_SUCCESS: 'Sesión cerrada',
} as const;

// App Configuration
export const APP_CONFIG = {
    NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Trading Simulator',
    VERSION: '1.0.0',
    REFRESH_INTERVAL: 5000, // 5 seconds
    TOAST_DURATION: 3000, // 3 seconds
}

export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        PROFILE: '/api/auth/profile',
    },
    MARKET: {
        STATUS: '/api/market',
        RANKING: '/api/market/ranking',
        RANKING_RECALCULATE: '/api/market/ranking/recalculate',
        RANKING_RESET: '/api/market/ranking/reset',
    },
    ORDERS: {
        CREATE: '/api/orders',
        CANCEL: '/api/orders',
        USER_ORDERS: '/api/orders/my-orders',
        BALANCE: '/api/orders/balance',
    },
    ADMIN: {
        STATS: '/api/admin/stats',
        EXPORT: '/api/admin/export',
        EXCHANGE_RATES: '/api/admin/exchange-rates',
    },
} as const;

export const VALIDATION_RULES = {
    USER: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
        DNI_LENGTH: 8,
        PHONE_LENGTH: 9,
    },
    ORDER: {
        MIN_USD_AMOUNT: 0.01,
        MAX_USD_AMOUNT: 1000000,
        MIN_EXCHANGE_RATE: 0.001,
        MAX_EXCHANGE_RATE: 20,
        MAX_ACTIVE_ORDERS: 5,
    },
    TRADING: {
        INITIAL_USD_BALANCE: 1000,
        INITIAL_PEN_BALANCE: 3500,
        BASE_COMMISSION_RATE: 0.005,
        MIN_OPERATION_AMOUNT: 100,
    },
} as const;

export const UI_CONFIG = {
    TOAST: {
        DEFAULT_DURATION: 5000,
        MAX_TOASTS: 5,
    },
    REFRESH_INTERVALS: {
        RANKING: 30000, // 30 seconds
        MARKET_DATA: 5000, // 5 seconds
        ADMIN_STATS: 30000, // 30 seconds
    },
    ANIMATION: {
        DURATION_SHORT: 150,
        DURATION_MEDIUM: 300,
        DURATION_LONG: 500,
    },
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    MARKET: '/market',
    RANKING: '/ranking',
    MY_OPERATIONS: '/my-operations',
    ADMIN: '/admin',
    ADMIN_PANEL: '/admin/panel',
    ADMIN_USERS: '/admin/usuarios',

} as const;
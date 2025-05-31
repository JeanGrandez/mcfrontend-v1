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
export const ORDER_TYPES = {
    BUY: 'buy',
    SELL: 'sell',
} as const;

export const ORDER_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

// User Roles
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
} as const;
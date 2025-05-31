
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

// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency with proper locale
 */
export function formatCurrency(
    amount: number,
    currency: 'USD' | 'PEN' = 'USD',
    options: Intl.NumberFormatOptions = {}
): string {
    const locale = currency === 'PEN' ? 'es-PE' : 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...options,
    }).format(amount);
}

/**
 * Format number with locale-specific formatting
 */
export function formatNumber(
    value: number,
    options: Intl.NumberFormatOptions = {}
): string {
    return new Intl.NumberFormat('es-PE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
    }).format(value);
}

/**
 * Format percentage with sign
 */
export function formatPercentage(
    value: number,
    decimals: number = 2,
    showSign: boolean = true
): string {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format date for display
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options,
    });
}

/**
 * Format datetime for display
 */
export function formatDateTime(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    });
}

/**
 * Debounce function for input handling
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function for scroll/resize events
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
    return Math.random().toString(36).substr(2, length);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
    if (typeof obj === 'object') {
        const clonedObj = {} as T;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

/**
 * Calculate portfolio value in USD
 */
export function calculatePortfolioValue(
    usdBalance: number,
    penBalance: number,
    exchangeRate: number
): number {
    return usdBalance + (penBalance / exchangeRate);
}

/**
 * Calculate profit percentage
 */
export function calculateProfitPercentage(
    initialValue: number,
    currentValue: number
): number {
    if (initialValue === 0) return 0;
    return ((currentValue - initialValue) / initialValue) * 100;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate DNI format (8 digits)
 */
export function isValidDNI(dni: string): boolean {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
}

/**
 * Validate phone format (9 digits starting with 9)
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^9\d{8}$/;
    return phoneRegex.test(phone);
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}


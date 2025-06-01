// src/lib/utils.ts

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCIES, TRADING, ERROR_MESSAGES } from './constants'; // Asegúrate de que constants.ts exporte estos

/**
 * Utility function to merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Format currency with proper locale and symbol.
 */
export function formatCurrency(
    amount: number,
    currencyCode: 'USD' | 'PEN',
    options: Intl.NumberFormatOptions = {}
): string {
    const currencyInfo = CURRENCIES[currencyCode];
    const locale = currencyCode === 'PEN' ? 'es-PE' : 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyInfo.precision,
        maximumFractionDigits: currencyInfo.precision,
        ...options,
    }).format(amount);
}

/**
 * Format number with locale-specific formatting.
 */
export function formatNumber(
    value: number,
    options: Intl.NumberFormatOptions = {}
): string {
    return new Intl.NumberFormat('es-PE', { // Default locale, puede ser configurable
        minimumFractionDigits: 0,
        maximumFractionDigits: 2, // Default, ajustar según necesidad
        ...options,
    }).format(value);
}

/**
 * Format percentage with sign and specified decimal places.
 */
export function formatPercentage(
    value: number, // Asume que value es el porcentaje (ej. 25 para 25%)
    decimals: number = 2,
    showSign: boolean = true
): string {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format exchange rate with proper decimals (versión del último prompt)
 */
export function formatExchangeRate(rate: number): string {
    return rate.toFixed(3);
}

/**
 * Get profit color class (versión del último prompt)
 */
export function getProfitColor(percentage: number): string {
    if (percentage > 0) return 'text-trade-green';
    if (percentage < 0) return 'text-trade-red';
    return 'text-muted-foreground';
}

/**
 * Format date for display (e.g., DD/MM/YYYY).
 */
export function formatDate(
    date: Date | string | number, // Acepta timestamp numérico
    options: Intl.DateTimeFormatOptions = {}
): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-PE', { // Default locale
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options,
    });
}

/**
 * Format datetime for display (e.g., DD/MM/YYYY HH:MM).
 */
export function formatDateTime(
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('es-PE', { // Default locale
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Usar formato 24h o configurable
        ...options,
    });
}

/**
 * Debounce function delays invoking a function until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
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
 * Throttle function ensures a function is called at most once per limit period.
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Generate a simple random ID. For UUIDs, use a dedicated library.
 */
export function generateId(prefix: string = 'id'): string {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object. Note: Does not handle functions, Maps, Sets, etc.
 * For complex scenarios, consider libraries like lodash.cloneDeep.
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T;

    const clonedObj = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
}

/**
 * Safely parse JSON string, returning a fallback value if parsing fails.
 */
export function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
    if (str === null || str === undefined) return fallback;
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text to a specified length and add an ellipsis if truncated.
 */
export function truncate(str: string, length: number, ellipsis: string = '...'): string {
    if (!str || str.length <= length) return str;
    return str.substring(0, length - ellipsis.length) + ellipsis;
}

/**
 * Get initials from a name (e.g., "John Doe" -> "JD").
 */
export function getInitials(name: string, limit: number = 2): string {
    if (!name) return '';
    return name
        .split(' ')
        .filter(Boolean) // Remover espacios vacíos si hay múltiples
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, limit)
        .join('');
}

/**
 * Calculate portfolio value in a target currency (default USD).
 * Assumes PEN to USD conversion if exchangeRate is for PEN/USD.
 */
export function calculatePortfolioValue(
    usdBalance: number,
    penBalance: number,
    penToUsdExchangeRate: number // e.g., if 1 USD = 3.7 PEN, this rate is 3.7
): number {
    if (penToUsdExchangeRate === 0) return usdBalance; // Evitar división por cero
    return usdBalance + (penBalance / penToUsdExchangeRate);
}

/**
 * Calculate profit percentage.
 */
export function calculateProfitPercentage(
    initialValue: number,
    currentValue: number
): number {
    if (initialValue === 0) {
        if (currentValue > 0) return Infinity;
        if (currentValue < 0) return -Infinity;
        return 0; // O manejar como 0% o 100% si se prefiere
    }
    return ((currentValue - initialValue) / Math.abs(initialValue)) * 100;
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex
    return emailRegex.test(email);
}

/**
 * Validate DNI format (8 digits for Peru).
 */
export function isValidDNI(dni: string): boolean {
    const dniRegex = /^\d{8}$/;
    return dniRegex.test(dni);
}

/**
 * Validate phone format (9 digits starting with 9 for Peru).
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^9\d{8}$/;
    return phoneRegex.test(phone);
}

/**
 * Sleep function for async operations (e.g., for testing UI delays).
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Pluralize a word based on a count.
 * Simple version, for complex i18n use a dedicated library.
 */
export function pluralize(count: number, singular: string, plural: string): string {
    return count === 1 ? singular : plural;
}

/**
 * Formats a date object into a relative time string (e.g., "hace 5 minutos", "ayer").
 * Basic implementation. For robust relative time, use a library like `date-fns` or `dayjs`.
 */
export function formatRelativeTime(date: Date | string | number): string {
    const then = new Date(date).getTime();
    const now = new Date().getTime();
    const seconds = Math.round(Math.abs(now - then) / 1000); // Usar Math.abs para futuro/pasado
    const prefix = now >= then ? "hace " : "en ";
    const suffix = now >= then ? "" : "";


    if (seconds < 5) return "justo ahora";
    if (seconds < 60) return `${prefix}${seconds} segundos${suffix}`;

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${prefix}${minutes} ${pluralize(minutes, "minuto", "minutos")}${suffix}`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${prefix}${hours} ${pluralize(hours, "hora", "horas")}${suffix}`;

    const days = Math.round(hours / 24);
    if (days < 7) return `${prefix}${days} ${pluralize(days, "día", "días")}${suffix}`;

    // For older/future dates, return formatted date
    return formatDate(new Date(date));
}

// --- Funciones añadidas/actualizadas del último prompt ---

/**
 * Calculate order totals
 */
export function calculateOrderTotals(
    amount: number, // Cantidad en USD
    rate: number,   // Tasa de cambio PEN por USD
    type: 'buy' | 'sell',
    commissionRate: number = TRADING.DEFAULT_COMMISSION_RATE // Usar la constante definida
) {
    const penAmount = amount * rate; // Costo/Ingreso base en PEN
    const commissionBase = penAmount; // La comisión se calcula sobre el monto en PEN
    const commission = commissionBase * commissionRate;

    if (type === 'buy') { // Comprar USD (pagar con PEN)
        return {
            usdAmount: amount, // Lo que se recibe en USD
            penAmount: penAmount, // Costo base en PEN sin comisión
            commission, // Comisión en PEN
            totalToPay: penAmount + commission, // Total a pagar en PEN
            totalToReceive: amount // Total a recibir en USD
        };
    } else { // Vender USD (recibir PEN)
        return {
            usdAmount: amount, // Lo que se entrega en USD
            penAmount: penAmount, // Ingreso base en PEN sin comisión
            commission, // Comisión en PEN
            totalToPay: amount, // Total a pagar en USD
            totalToReceive: penAmount - commission // Total a recibir en PEN
        };
    }
}

/**
 * Validate trading constraints
 */
export function validateTradingOrder(
    amount: number, // Cantidad en USD
    rate: number,   // Tasa de cambio PEN por USD
    userBalance: { usdBalance: number; penBalance: number },
    type: 'buy' | 'sell'
): { isValid: boolean; error?: string } {
    // Validar montos y tasas mínimas/máximas primero
    if (amount <= 0 || rate <= 0) { // Añadir validación de positividad
        return {
            isValid: false,
            error: 'El monto y la tasa de cambio deben ser positivos.'
        };
    }
    if (amount < TRADING.MIN_USD_AMOUNT || amount > TRADING.MAX_USD_AMOUNT) {
        return {
            isValid: false,
            error: `El monto en USD debe estar entre ${TRADING.MIN_USD_AMOUNT} y ${TRADING.MAX_USD_AMOUNT}.`
        };
    }
    if (rate < TRADING.MIN_EXCHANGE_RATE || rate > TRADING.MAX_EXCHANGE_RATE) {
        return {
            isValid: false,
            error: `La tasa de cambio debe estar entre ${TRADING.MIN_EXCHANGE_RATE} y ${TRADING.MAX_EXCHANGE_RATE}.`
        };
    }

    const totals = calculateOrderTotals(amount, rate, type);

    if (type === 'buy') { // Comprar USD, pagar con PEN
        if (userBalance.penBalance < totals.totalToPay) {
            return {
                isValid: false,
                error: ERROR_MESSAGES.INSUFFICIENT_FUNDS + ' en PEN.'
            };
        }
    } else { // Vender USD, recibir PEN
        if (userBalance.usdBalance < totals.totalToPay) { // totalToPay es el 'amount' en USD
            return {
                isValid: false,
                error: ERROR_MESSAGES.INSUFFICIENT_FUNDS + ' en USD.'
            };
        }
    }

    return { isValid: true };
}
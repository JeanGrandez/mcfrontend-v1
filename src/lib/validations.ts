// src/lib/validations.ts - Esquemas de validación (Programador A)

import { z } from 'zod';
import { TRADING, VALIDATION, ERROR_MESSAGES } from './constants';

// Auth Validations
export const registerSchema = z.object({
    name: z
        .string()
        .min(VALIDATION.MIN_NAME_LENGTH, ERROR_MESSAGES.REQUIRED_FIELD)
        .max(VALIDATION.MAX_NAME_LENGTH, `Máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`)
        .regex(VALIDATION.NAME_PATTERN, 'Solo se permiten letras y espacios'),

    email: z
        .string()
        .email(ERROR_MESSAGES.INVALID_EMAIL),

    dni: z
        .string()
        .regex(VALIDATION.DNI_PATTERN, ERROR_MESSAGES.INVALID_DNI),

    phone: z
        .string()
        .regex(VALIDATION.PHONE_PATTERN, ERROR_MESSAGES.INVALID_PHONE),
});

export const loginSchema = z.object({
    email: z.string().email(ERROR_MESSAGES.INVALID_EMAIL).optional(),
    dni: z.string().regex(VALIDATION.DNI_PATTERN, ERROR_MESSAGES.INVALID_DNI).optional(),
}).refine(data => data.email || data.dni, {
    message: "Debe proporcionar email o DNI",
});

// Trading Validations
export const orderSchema = z.object({
    type: z.enum(['buy', 'sell'], {
        required_error: 'Tipo de orden requerido',
    }),

    usdAmount: z
        .number({
            required_error: ERROR_MESSAGES.REQUIRED_FIELD,
            invalid_type_error: 'Debe ser un número',
        })
        .min(TRADING.MIN_USD_AMOUNT, `Monto mínimo: $${TRADING.MIN_USD_AMOUNT}`)
        .max(TRADING.MAX_USD_AMOUNT, `Monto máximo: $${TRADING.MAX_USD_AMOUNT}`)
        .multipleOf(0.01, 'Máximo 2 decimales'),

    exchangeRate: z
        .number({
            required_error: ERROR_MESSAGES.REQUIRED_FIELD,
            invalid_type_error: 'Debe ser un número',
        })
        .min(TRADING.MIN_EXCHANGE_RATE, `Tipo de cambio mínimo: ${TRADING.MIN_EXCHANGE_RATE}`)
        .max(TRADING.MAX_EXCHANGE_RATE, `Tipo de cambio máximo: ${TRADING.MAX_EXCHANGE_RATE}`)
        .multipleOf(0.001, 'Máximo 3 decimales'),

    isMarketPrice: z.boolean().optional(),
});

// Form Data Types
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;

// Validation Functions
export function validateRegister(data: unknown): RegisterFormData {
    return registerSchema.parse(data);
}

export function validateLogin(data: unknown): LoginFormData {
    return loginSchema.parse(data);
}

export function validateOrder(data: unknown): OrderFormData {
    return orderSchema.parse(data);
}

// Safe validation functions (return errors instead of throwing)
export function safeValidateRegister(data: unknown) {
    return registerSchema.safeParse(data);
}

export function safeValidateLogin(data: unknown) {
    return loginSchema.safeParse(data);
}

export function safeValidateOrder(data: unknown) {
    return orderSchema.safeParse(data);
}

// Custom validation helpers
export function isValidEmail(email: string): boolean {
    return VALIDATION.EMAIL_PATTERN.test(email);
}

export function isValidDNI(dni: string): boolean {
    return VALIDATION.DNI_PATTERN.test(dni);
}

export function isValidPhone(phone: string): boolean {
    return VALIDATION.PHONE_PATTERN.test(phone);
}

export function isValidUSDAmount(amount: number): boolean {
    return amount >= TRADING.MIN_USD_AMOUNT &&
        amount <= TRADING.MAX_USD_AMOUNT &&
        Number.isFinite(amount);
}

export function isValidExchangeRate(rate: number): boolean {
    return rate >= TRADING.MIN_EXCHANGE_RATE &&
        rate <= TRADING.MAX_EXCHANGE_RATE &&
        Number.isFinite(rate);
}

// Error message extractors
export function extractErrorMessage(error: z.ZodError): string {
    return error.errors[0]?.message || 'Error de validación';
}

export function extractAllErrorMessages(error: z.ZodError): string[] {
    return error.errors.map(err => err.message);
}

// Field-specific error extractors
export function extractFieldErrors(error: z.ZodError): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    error.errors.forEach(err => {
        const fieldName = err.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
            fieldErrors[fieldName] = err.message;
        }
    });

    return fieldErrors;
}
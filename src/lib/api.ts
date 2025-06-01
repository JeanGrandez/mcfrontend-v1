// src/lib/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from './constants';

// Types for API responses
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    errors?: string[];
}

export interface LoginRequest {
    email?: string;
    dni?: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    dni: string;
    phone: string;
}

export interface OrderRequest {
    type: 'buy' | 'sell';
    usdAmount: number;
    exchangeRate: number;
    isMarketPrice?: boolean;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    dni: string;
    phone: string;
    role: 'user' | 'trader' | 'admin';
    usdBalance: number;
    penBalance: number;
    commissionRate: number;
    profitPercentage: number;
    rankingPosition: number;
    completedOperations: number;
    registrationDate: string;
}

export interface OrderBook {
    buyOrders: Array<{
        id: string;
        userId: string;
        type: 'buy';
        usdAmount: number;
        exchangeRate: number;
        status: 'active';
        creationDate: string;
        isOwn?: boolean;
    }>;
    sellOrders: Array<{
        id: string;
        userId: string;
        type: 'sell';
        usdAmount: number;
        exchangeRate: number;
        status: 'active';
        creationDate: string;
        isOwn?: boolean;
    }>;
    marketStatus: 'open' | 'closed';
    bestBuyRate: number;
    bestSellRate: number;
    lastOperation?: {
        amount: number;
        rate: number;
        date: string;
    };
}

export interface UserOperation {
    id: string;
    type: 'buy' | 'sell';
    usdAmount: number;
    exchangeRate: number;
    penAmount: number;
    status: 'completed';
    date: string;
    commission: number;
    counterparty?: string;
}

// Custom API Error class
export class ApiError extends Error {
    public status: number;
    public errors?: string[];

    constructor(message: string, status: number = 500, errors?: string[]) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

// Token Manager
export class TokenManager {
    private static readonly TOKEN_KEY = 'trading_auth_token';

    static getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static removeToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static hasToken(): boolean {
        return !!this.getToken();
    }
}

// User Data Manager
export class UserDataManager {
    private static readonly USER_KEY = 'trading_user_data';

    static getUserData(): UserProfile | null {
        if (typeof window === 'undefined') return null;

        try {
            const data = localStorage.getItem(this.USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    static setUserData(user: UserProfile): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    static removeUserData(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.USER_KEY);
    }
}

// HTTP Client Class
class HttpClient {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor - Add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = TokenManager.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - Handle errors
        this.api.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => response,
            (error: AxiosError<ApiResponse>) => {
                const message = error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR;
                const status = error.response?.status || 500;
                const errors = error.response?.data?.errors;

                // Handle auth errors
                if (status === 401) {
                    TokenManager.removeToken();
                    UserDataManager.removeUserData();

                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }

                throw new ApiError(message, status, errors);
            }
        );
    }

    // Generic request methods
    async get<T>(url: string): Promise<ApiResponse<T>> {
        const response = await this.api.get<ApiResponse<T>>(url);
        return response.data;
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.api.post<ApiResponse<T>>(url, data);
        return response.data;
    }

    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.api.put<ApiResponse<T>>(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        const response = await this.api.delete<ApiResponse<T>>(url);
        return response.data;
    }
}

// API Service Class
export class ApiService {
    private static client = new HttpClient();

    // Authentication endpoints
    static async login(credentials: LoginRequest): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
        return this.client.post('/api/auth/login', credentials);
    }

    static async updateUserStatus(userId: string, status: { isActive: boolean }): Promise<ApiResponse<{}>> {
        return this.client.put(`/api/admin/users/${userId}/status`, status);
    }

    static async resetUserBalance(userId: string): Promise<ApiResponse<{}>> {
        return this.client.post(`/api/admin/users/${userId}/reset`);
    }

    static async updateUser(userId: string, userData: any): Promise<ApiResponse<{}>> {
        return this.client.put(`/api/admin/users/${userId}`, userData);
    }

    static async getUserDetails(userId: string): Promise<ApiResponse<{ user: any }>> {
        return this.client.get(`/api/admin/users/${userId}`);
    }

    static async getSystemLogs(): Promise<ApiResponse<{ logs: any[] }>> {
        return this.client.get('/api/admin/logs');
    }

    static async backupData(): Promise<ApiResponse<{}>> {
        return this.client.post('/api/admin/backup');
    }

    static async register(userData: RegisterRequest): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
        return this.client.post('/api/auth/register', userData);
    }

    static async getProfile(): Promise<ApiResponse<{ user: UserProfile }>> {
        return this.client.get('/api/auth/profile');
    }

    static async logout(): Promise<ApiResponse<{}>> {
        return this.client.post('/api/auth/logout');
    }

    // Market endpoints
    static async getMarketData(): Promise<ApiResponse<{ orderBook: OrderBook; userBalance: any }>> {
        return this.client.get('/api/market');
    }

    static async createOrder(order: OrderRequest): Promise<ApiResponse<{ order: any }>> {
        return this.client.post('/api/orders', order);
    }

    static async cancelOrder(orderId: string): Promise<ApiResponse<{}>> {
        return this.client.delete(`/api/orders/${orderId}`);
    }

    static async getUserOrders(): Promise<ApiResponse<{ orders: any[] }>> {
        return this.client.get('/api/orders/my-orders');
    }

    static async getUserOperations(): Promise<ApiResponse<{ operations: UserOperation[] }>> {
        return this.client.get('/api/operations/my-operations');
    }

    static async getUserBalance(): Promise<ApiResponse<{ balance: any }>> {
        return this.client.get('/api/orders/balance');
    }

    // Ranking endpoints
    static async getRanking(): Promise<ApiResponse<{ ranking: any[] }>> {
        return this.client.get('/api/market/ranking');
    }

    // Admin endpoints
    static async getAdminStats(): Promise<ApiResponse<{ stats: any }>> {
        return this.client.get('/api/admin/stats');
    }

    static async getAllUsers(): Promise<ApiResponse<{ users: any[] }>> {
        return this.client.get('/api/admin/users');
    }

    static async updateMarketStatus(status: 'open' | 'closed'): Promise<ApiResponse<{}>> {
        return this.client.post('/api/market/status', { status });
    }

    static async updateExchangeRates(rates: { referenceBuyRate: number; referenceSellRate: number }): Promise<ApiResponse<{}>> {
        return this.client.post('/api/admin/exchange-rates', rates);
    }


    static async recalculateRanking(): Promise<ApiResponse<{}>> {
        return this.client.post('/api/market/ranking/recalculate');
    }

    static async resetRanking(): Promise<ApiResponse<{}>> {
        return this.client.post('/api/market/ranking/reset');
    }

    static async exportData(options: { includeOperations: boolean; format: string }): Promise<Blob> {
        const response = await this.client.api.post('/api/admin/export', options, {
            responseType: 'blob',
        });
        return response.data;
    }
}

// Utility functions for error handling
export const handleApiError = (error: unknown): string => {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return ERROR_MESSAGES.NETWORK_ERROR;
};

export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};

// Retry utility for failed requests
export const retryRequest = async <T>(
    requestFn: () => Promise<T>,
    maxAttempts: number = API_CONFIG.RETRY_ATTEMPTS,
    delay: number = 1000
): Promise<T> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxAttempts) {
                throw lastError;
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }

    throw lastError!;
};

// Default export
export default ApiService;
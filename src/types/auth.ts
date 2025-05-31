// src/types/auth.ts - Tipos para autenticación (Programador A)

export interface User {
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

export interface LoginCredentials {
    email?: string;
    dni?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    dni: string;
    phone: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export interface AuthError {
    message: string;
    errors?: string[];
}
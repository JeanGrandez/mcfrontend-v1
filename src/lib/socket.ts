// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { API_CONFIG, WS_EVENTS } from './constants';
import { TokenManager } from './api';
import type { WebSocketEvents } from '@/types';

// Socket Manager Class
export class SocketManager {
    private socket: Socket | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private eventHandlers = new Map<string, Set<Function>>();

    constructor() {
        this.connect();
    }

    // Connect to WebSocket server
    connect(): void {
        if (this.socket?.connected) {
            return;
        }

        const token = TokenManager.getToken();
        if (!token) {
            console.warn('No auth token found, WebSocket connection delayed');
            return;
        }

        this.socket = io(API_CONFIG.WS_URL, {
            auth: {
                token,
            },
            transports: ['websocket', 'polling'],
            timeout: 10000,
            forceNew: true,
        });

        this.setupEventHandlers();
    }

    // Disconnect from WebSocket server
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Reconnect with new token
    reconnectWithToken(token: string): void {
        this.disconnect();

        setTimeout(() => {
            this.connect();
        }, 100);
    }

    // Setup built-in event handlers
    private setupEventHandlers(): void {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Subscribe to market updates
            this.emit(WS_EVENTS.SUBSCRIBE_MARKET);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket disconnected:', reason);
            this.isConnected = false;

            // Try to reconnect if it wasn't a manual disconnect
            if (reason !== 'io client disconnect') {
                this.handleReconnect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔴 WebSocket connection error:', error.message);
            this.handleReconnect();
        });

        // Auth events
        this.socket.on('error', (error) => {
            console.error('🔴 WebSocket error:', error);

            if (error.message === 'Authentication required' ||
                error.message === 'Invalid token') {
                this.handleAuthError();
            }
        });

        // Market events - These will be handled by components through subscriptions
        this.socket.on(WS_EVENTS.MARKET_UPDATE, (data) => {
            this.notifyHandlers(WS_EVENTS.MARKET_UPDATE, data);
        });

        this.socket.on(WS_EVENTS.BALANCE_UPDATE, (data) => {
            this.notifyHandlers(WS_EVENTS.BALANCE_UPDATE, data);
        });

        this.socket.on(WS_EVENTS.ORDER_CREATED, (data) => {
            this.notifyHandlers(WS_EVENTS.ORDER_CREATED, data);
        });

        this.socket.on(WS_EVENTS.ORDER_EXECUTED, (data) => {
            this.notifyHandlers(WS_EVENTS.ORDER_EXECUTED, data);
        });

        this.socket.on(WS_EVENTS.ORDER_CANCELLED, (data) => {
            this.notifyHandlers(WS_EVENTS.ORDER_CANCELLED, data);
        });

        this.socket.on(WS_EVENTS.MARKET_STATUS, (data) => {
            this.notifyHandlers(WS_EVENTS.MARKET_STATUS, data);
        });

        this.socket.on(WS_EVENTS.RANKING_UPDATE, (data) => {
            this.notifyHandlers(WS_EVENTS.RANKING_UPDATE, data);
        });
    }

    // Handle reconnection logic
    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('🚨 Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * this.reconnectAttempts;

        console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

        setTimeout(() => {
            this.connect();
        }, delay);
    }

    // Handle authentication errors
    private handleAuthError(): void {
        console.error('🔒 WebSocket authentication failed');
        this.disconnect();

        // Remove invalid token
        TokenManager.removeToken();

        // Redirect to login or show error
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    // Emit event to server
    emit(event: string, data?: any): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('⚠️ Cannot emit event, socket not connected:', event);
        }
    }

    // Subscribe to events
    on<K extends keyof WebSocketEvents>(
        event: K,
        handler: (data: WebSocketEvents[K]) => void
    ): () => void {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }

        this.eventHandlers.get(event)!.add(handler);

        // Return unsubscribe function
        return () => {
            const handlers = this.eventHandlers.get(event);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.eventHandlers.delete(event);
                }
            }
        };
    }

    // Notify all handlers for an event
    private notifyHandlers(event: string, data: any): void {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    // Get connection status
    get connected(): boolean {
        return this.isConnected && this.socket?.connected === true;
    }

    // Subscribe to specific market data
    subscribeToMarket(): void {
        this.emit(WS_EVENTS.SUBSCRIBE_MARKET);
    }

    subscribeToRanking(): void {
        this.emit(WS_EVENTS.SUBSCRIBE_RANKING);
    }

    // Get socket instance (for advanced usage)
    getSocket(): Socket | null {
        return this.socket;
    }
}

// Create singleton instance
let socketManager: SocketManager | null = null;

export function getSocketManager(): SocketManager {
    if (!socketManager) {
        socketManager = new SocketManager();
    }
    return socketManager;
}

// Convenience functions
export function connectSocket(): void {
    getSocketManager().connect();
}

export function disconnectSocket(): void {
    getSocketManager().disconnect();
}

export function reconnectSocket(token: string): void {
    getSocketManager().reconnectWithToken(token);
}

export function emitSocketEvent(event: string, data?: any): void {
    getSocketManager().emit(event, data);
}

export function subscribeToSocketEvent<K extends keyof WebSocketEvents>(
    event: K,
    handler: (data: WebSocketEvents[K]) => void
): () => void {
    return getSocketManager().on(event, handler);
}

export function isSocketConnected(): boolean {
    return getSocketManager().connected;
}

// Export socket manager for direct access
export { socketManager };

// Default export
export default getSocketManager;
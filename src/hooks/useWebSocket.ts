// src/hooks/useWebSocket.ts - Updated with specific market hooks
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocketManager } from '@/lib/socket';
import { WS_EVENTS } from '@/lib/constants';
import type {
    WebSocketEvents,
    OrderBook,
    UserBalance,
    Order,
    Operation
} from '@/types';

interface UseWebSocketReturn {
    isConnected: boolean;
    lastMessage: any;
    error: string | null;
    subscribe: <K extends keyof WebSocketEvents>(
        event: K,
        handler: (data: WebSocketEvents[K]) => void
    ) => () => void;
    emit: (event: string, data?: any) => void;
    reconnect: () => void;
}

export function useWebSocket(): UseWebSocketReturn {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const socketManager = useRef(getSocketManager());
    const subscriptions = useRef<(() => void)[]>([]);

    // Update connection status
    useEffect(() => {
        const updateConnectionStatus = () => {
            setIsConnected(socketManager.current.connected);
        };

        // Check initial status
        updateConnectionStatus();

        // Subscribe to connection events
        const unsubscribeConnect = socketManager.current.on('connect' as any, () => {
            setIsConnected(true);
            setError(null);
        });

        const unsubscribeDisconnect = socketManager.current.on('disconnect' as any, () => {
            setIsConnected(false);
        });

        const unsubscribeError = socketManager.current.on('error' as any, (errorData: any) => {
            setError(errorData.message || 'WebSocket error');
        });

        // Store subscriptions for cleanup
        subscriptions.current.push(unsubscribeConnect, unsubscribeDisconnect, unsubscribeError);

        return () => {
            // Cleanup all subscriptions
            subscriptions.current.forEach(unsubscribe => unsubscribe());
            subscriptions.current = [];
        };
    }, []);

    // Subscribe to events
    const subscribe = useCallback(<K extends keyof WebSocketEvents>(
        event: K,
        handler: (data: WebSocketEvents[K]) => void
    ) => {
        const unsubscribe = socketManager.current.on(event, (data) => {
            setLastMessage({ event, data, timestamp: Date.now() });
            handler(data);
        });

        subscriptions.current.push(unsubscribe);
        return unsubscribe;
    }, []);

    // Emit events
    const emit = useCallback((event: string, data?: any) => {
        socketManager.current.emit(event, data);
    }, []);

    // Reconnect
    const reconnect = useCallback(() => {
        socketManager.current.connect();
    }, []);

    return {
        isConnected,
        lastMessage,
        error,
        subscribe,
        emit,
        reconnect,
    };
}

// Specific hooks for different data types
export function useMarketData() {
    const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { subscribe, isConnected } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe(WS_EVENTS.MARKET_UPDATE, (data) => {
            setOrderBook(data);
            setIsLoading(false);
        });

        return unsubscribe;
    }, [subscribe]);

    // Subscribe to market updates when connected
    useEffect(() => {
        if (isConnected) {
            getSocketManager().subscribeToMarket();
        }
    }, [isConnected]);

    return {
        orderBook,
        isLoading: isLoading || !isConnected,
    };
}

export function useUserBalance() {
    const [balance, setBalance] = useState<UserBalance | null>(null);
    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe(WS_EVENTS.BALANCE_UPDATE, (data) => {
            setBalance(data);
        });

        return unsubscribe;
    }, [subscribe]);

    return balance;
}

export function useOrderUpdates() {
    const [orderUpdates, setOrderUpdates] = useState<{
        created: Order | null;
        executed: Operation | null;
        cancelled: Order | null;
    }>({
        created: null,
        executed: null,
        cancelled: null,
    });

    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribeCreated = subscribe(WS_EVENTS.ORDER_CREATED, (order) => {
            setOrderUpdates(prev => ({ ...prev, created: order }));
        });

        const unsubscribeExecuted = subscribe(WS_EVENTS.ORDER_EXECUTED, (operation) => {
            setOrderUpdates(prev => ({ ...prev, executed: operation }));
        });

        const unsubscribeCancelled = subscribe(WS_EVENTS.ORDER_CANCELLED, (order) => {
            setOrderUpdates(prev => ({ ...prev, cancelled: order }));
        });

        return () => {
            unsubscribeCreated();
            unsubscribeExecuted();
            unsubscribeCancelled();
        };
    }, [subscribe]);

    // Clear updates after they've been processed
    const clearUpdates = useCallback(() => {
        setOrderUpdates({
            created: null,
            executed: null,
            cancelled: null,
        });
    }, []);

    return {
        ...orderUpdates,
        clearUpdates,
    };
}

export function useMarketStatus() {
    const [marketStatus, setMarketStatus] = useState<'open' | 'closed'>('closed');
    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe(WS_EVENTS.MARKET_STATUS, (data) => {
            setMarketStatus(data.status);
        });

        return unsubscribe;
    }, [subscribe]);

    return marketStatus;
}

export function useRankingUpdates() {
    const [rankingData, setRankingData] = useState<any>(null);
    const { subscribe } = useWebSocket();

    useEffect(() => {
        const unsubscribe = subscribe(WS_EVENTS.RANKING_UPDATE, (data) => {
            setRankingData(data);
        });

        return unsubscribe;
    }, [subscribe]);

    return rankingData;
}

// Connection status hook
export function useConnectionStatus() {
    const [status, setStatus] = useState<{
        isConnected: boolean;
        isReconnecting: boolean;
        error: string | null;
    }>({
        isConnected: false,
        isReconnecting: false,
        error: null,
    });

    const { isConnected, error } = useWebSocket();

    useEffect(() => {
        setStatus(prev => ({
            ...prev,
            isConnected,
            error,
        }));
    }, [isConnected, error]);

    return status;
}

export default useWebSocket;
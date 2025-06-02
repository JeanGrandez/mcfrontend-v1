'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { getSocketManager } from '@/lib/socket';
import { useAuthContext } from './auth-provider';
import { useTradingToasts } from '@/hooks/useToast';

interface SocketContextType {
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    lastConnectionError: string | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
    const { isAuthenticated, token } = useAuthContext();
    const tradingToasts = useTradingToasts();

    const [connectionState, setConnectionState] = useState<{
        isConnected: boolean;
        status: 'connecting' | 'connected' | 'disconnected' | 'error';
        lastError: string | null;
    }>({
        isConnected: false,
        status: 'disconnected',
        lastError: null,
    });

    useEffect(() => {
        if (!isAuthenticated || !token) {
            // Disconnect socket if not authenticated
            getSocketManager().disconnect();
            setConnectionState({
                isConnected: false,
                status: 'disconnected',
                lastError: null,
            });
            return;
        }

        // Connect socket when authenticated
        const socketManager = getSocketManager();

        // Set up connection event handlers
        const handleConnect = () => {
            console.log('✅ Socket connected');
            setConnectionState(prev => ({
                ...prev,
                isConnected: true,
                status: 'connected',
                lastError: null,
            }));
            tradingToasts.connectionRestored();
        };

        const handleDisconnect = (reason: string) => {
            console.log('❌ Socket disconnected:', reason);
            setConnectionState(prev => ({
                ...prev,
                isConnected: false,
                status: 'disconnected',
            }));

            if (reason !== 'io client disconnect') {
                tradingToasts.connectionLost();
            }
        };

        const handleConnectError = (error: any) => {
            console.error('🔴 Socket connection error:', error);
            setConnectionState(prev => ({
                ...prev,
                isConnected: false,
                status: 'error',
                lastError: error.message || 'Connection error',
            }));
        };

        const handleError = (error: any) => {
            console.error('🔴 Socket error:', error);
            setConnectionState(prev => ({
                ...prev,
                lastError: error.message || 'Socket error',
            }));
        };

        // Subscribe to socket events
        const unsubscribeConnect = socketManager.on('connect' as any, handleConnect);
        const unsubscribeDisconnect = socketManager.on('disconnect' as any, handleDisconnect);
        const unsubscribeConnectError = socketManager.on('connect_error' as any, handleConnectError);
        const unsubscribeError = socketManager.on('error' as any, handleError);

        // Set connecting status
        setConnectionState(prev => ({
            ...prev,
            status: 'connecting',
        }));

        // Connect to socket
        socketManager.connect();

        // Cleanup on unmount or dependency change
        return () => {
            unsubscribeConnect();
            unsubscribeDisconnect();
            unsubscribeConnectError();
            unsubscribeError();
        };
    }, [isAuthenticated, token, tradingToasts]);

    const contextValue: SocketContextType = {
        isConnected: connectionState.isConnected,
        connectionStatus: connectionState.status,
        lastConnectionError: connectionState.lastError,
    };

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext(): SocketContextType {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
}

// Connection status indicator component
export function ConnectionStatus() {
    const { isConnected, connectionStatus } = useSocketContext();

    if (connectionStatus === 'connected') {
        return null; // Don't show anything when connected
    }

    const getStatusInfo = () => {
        switch (connectionStatus) {
            case 'connecting':
                return {
                    color: 'bg-yellow-500',
                    text: 'Conectando...',
                    pulse: true,
                };
            case 'disconnected':
                return {
                    color: 'bg-red-500',
                    text: 'Desconectado',
                    pulse: false,
                };
            case 'error':
                return {
                    color: 'bg-red-500',
                    text: 'Error de conexión',
                    pulse: false,
                };
            default:
                return {
                    color: 'bg-gray-500',
                    text: 'Desconocido',
                    pulse: false,
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`
        px-3 py-2 rounded-lg text-white text-sm font-medium
        ${statusInfo.color}
        ${statusInfo.pulse ? 'animate-pulse' : ''}
        shadow-lg
      `}>
                <div className="flex items-center gap-2">
                    <div className={`
            w-2 h-2 rounded-full bg-white
            ${statusInfo.pulse ? 'animate-ping' : ''}
          `} />
                    {statusInfo.text}
                </div>
            </div>
        </div>
    );
}

export default SocketProvider;
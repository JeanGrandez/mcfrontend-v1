// src/components/providers/index.ts - Exportaciones de providers (Programador A)

export {
    AuthProvider,
    useAuthContext,
    default as AuthProviderDefault
} from './auth-provider';

export {
    SocketProvider,
    useSocketContext,
    ConnectionStatus,
    default as SocketProviderDefault
} from './socket-provider';

export {
    ToastProvider,
    OrderSuccessToast,
    ExecutionToast,
    BalanceUpdateToast,
    ErrorToast,
    NetworkErrorToast,
    default as ToastProviderDefault
} from './toast-provider';
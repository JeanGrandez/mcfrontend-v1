// src/components/account/balance-card.tsx - Tarjeta de saldo (Programador A)

'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import { useUserBalance } from '@/hooks/useWebSocket';
import { formatCurrency, formatPercentage, getProfitColor, cn } from '@/lib/utils';
import type { UserBalance } from '@/types';

interface BalanceCardProps {
    className?: string;
    showDetails?: boolean;
}

export function BalanceCard({ className, showDetails = true }: BalanceCardProps) {
    const { user, updateUser } = useAuthContext();
    const realtimeBalance = useUserBalance();

    const [isVisible, setIsVisible] = useState(true);
    const [currentBalance, setCurrentBalance] = useState<UserBalance | null>(null);

    // Use real-time balance if available, otherwise use user data
    useEffect(() => {
        if (realtimeBalance) {
            setCurrentBalance(realtimeBalance);
            // Update user context with new balance
            updateUser({
                usdBalance: realtimeBalance.usdBalance,
                penBalance: realtimeBalance.penBalance,
                profitPercentage: realtimeBalance.profitPercentage,
            });
        } else if (user) {
            setCurrentBalance({
                usdBalance: user.usdBalance,
                penBalance: user.penBalance,
                profitPercentage: user.profitPercentage,
            });
        }
    }, [realtimeBalance, user, updateUser]);

    if (!currentBalance) {
        return (
            <div className={cn("bg-card rounded-lg p-4 border", className)}>
                <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    const { usdBalance, penBalance, profitPercentage } = currentBalance;
    const profitColor = getProfitColor(profitPercentage);
    const isProfit = profitPercentage >= 0;

    return (
        <div className={cn("bg-card rounded-lg p-4 border", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-medium text-foreground">
                        Mi Saldo
                    </h3>
                </div>

                {showDetails && (
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        aria-label={isVisible ? "Ocultar saldo" : "Mostrar saldo"}
                    >
                        {isVisible ? (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                    </button>
                )}
            </div>

            {/* Balance Display */}
            <div className="space-y-3">
                {/* USD Balance */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">USD:</span>
                    <span className="text-lg font-semibold text-foreground">
            {isVisible ? formatCurrency(usdBalance, 'USD') : '****'}
          </span>
                </div>

                {/* PEN Balance */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">PEN:</span>
                    <span className="text-lg font-semibold text-foreground">
            {isVisible ? formatCurrency(penBalance, 'PEN') : '****'}
          </span>
                </div>

                {/* Profit/Loss */}
                {showDetails && (
                    <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                {isProfit ? (
                                    <TrendingUp className="w-4 h-4 text-trade-green" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-trade-red" />
                                )}
                                <span className="text-sm text-muted-foreground">
                  Ganancia:
                </span>
                            </div>
                            <span className={cn("text-lg font-semibold", profitColor)}>
                {isVisible ? formatPercentage(profitPercentage) : '****'}
              </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Additional Info */}
            {showDetails && user && (
                <div className="mt-4 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Operaciones:</span>
                            <p className="font-medium">{user.completedOperations}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Ranking:</span>
                            <p className="font-medium">
                                #{user.rankingPosition || '-'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Compact version for mobile/sidebar
export function CompactBalanceCard({ className }: { className?: string }) {
    return (
        <BalanceCard
            className={cn("p-3", className)}
            showDetails={false}
        />
    );
}

// Balance summary for headers
export function BalanceSummary({ className }: { className?: string }) {
    const { user } = useAuthContext();
    const realtimeBalance = useUserBalance();

    const balance = realtimeBalance || (user ? {
        usdBalance: user.usdBalance,
        penBalance: user.penBalance,
        profitPercentage: user.profitPercentage,
    } : null);

    if (!balance) return null;

    const profitColor = getProfitColor(balance.profitPercentage);

    return (
        <div className={cn("flex items-center gap-4 text-sm", className)}>
            <div className="flex items-center gap-1">
                <span className="text-muted-foreground">USD:</span>
                <span className="font-medium">
          {formatCurrency(balance.usdBalance, 'USD')}
        </span>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-muted-foreground">PEN:</span>
                <span className="font-medium">
          {formatCurrency(balance.penBalance, 'PEN')}
        </span>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-muted-foreground">P&L:</span>
                <span className={cn("font-medium", profitColor)}>
          {formatPercentage(balance.profitPercentage)}
        </span>
            </div>
        </div>
    );
}

export default BalanceCard;
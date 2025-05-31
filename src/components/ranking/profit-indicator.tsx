// src/components/ranking/profit-indicator.tsx
'use client';
import React from 'react';
import { Badge } from '@/components/ui';
import { clsx } from 'clsx';

interface ProfitIndicatorProps {
    value: number;
    compact?: boolean;
    showTrend?: boolean;
    animate?: boolean;
}

export const ProfitIndicator: React.FC<ProfitIndicatorProps> = ({
                                                                    value,
                                                                    compact = false,
                                                                    showTrend = true,
                                                                    animate = true,
                                                                }) => {
    const isPositive = value > 0;
    const isZero = value === 0;

    const formatPercentage = (val: number) => {
        const formatted = Math.abs(val).toFixed(2);
        return `${val > 0 ? '+' : val < 0 ? '-' : ''}${formatted}%`;
    };

    const getVariant = () => {
        if (isZero) return 'secondary';
        return isPositive ? 'success' : 'destructive';
    };

    const getTrendIcon = () => {
        if (isZero) return null;

        if (isPositive) {
            return (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7h-10" />
                </svg>
            );
        } else {
            return (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
            );
        }
    };

    if (compact) {
        return (
            <div className={clsx(
                'inline-flex items-center space-x-1 px-2 py-1 rounded text-sm font-medium',
                isPositive && 'text-trade-green bg-trade-green/10',
                value < 0 && 'text-trade-red bg-trade-red/10',
                isZero && 'text-muted-foreground bg-muted',
                animate && !isZero && 'transition-colors duration-300'
            )}>
                {showTrend && getTrendIcon()}
                <span>{formatPercentage(value)}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end space-x-2">
            {showTrend && !isZero && (
                <div className={clsx(
                    'p-1 rounded-full',
                    isPositive && 'bg-trade-green/20 text-trade-green',
                    value < 0 && 'bg-trade-red/20 text-trade-red'
                )}>
                    {getTrendIcon()}
                </div>
            )}

            <Badge
                variant={getVariant()}
                className={clsx(
                    'font-mono text-sm',
                    animate && 'transition-all duration-300',
                    !isZero && animate && (isPositive ? 'animate-pulse-green' : 'animate-pulse-red')
                )}
            >
                {formatPercentage(value)}
            </Badge>
        </div>
    );
};

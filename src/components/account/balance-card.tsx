// src/components/account/balance-card.tsx
'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { CurrencyDisplay } from './currency-display';
import { clsx } from 'clsx';

interface BalanceCardProps {
    currency: 'USD' | 'PEN';
    amount: number;
    label?: string;
    showTrend?: boolean;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: number;
    compact?: boolean;
    animated?: boolean;
    onClick?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
                                                            currency,
                                                            amount,
                                                            label,
                                                            showTrend = false,
                                                            trend = 'neutral',
                                                            trendValue,
                                                            compact = false,
                                                            animated = true,
                                                            onClick,
                                                        }) => {
    const getCurrencyIcon = () => {
        if (currency === 'USD') {
            return (
                <div className="w-8 h-8 bg-trade-green rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">$</span>
                </div>
            );
        } else {
            return (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">S/</span>
                </div>
            );
        }
    };

    const getCurrencyLabel = () => {
        if (label) return label;
        return currency === 'USD' ? 'Dólares' : 'Soles';
    };

    const getTrendIcon = () => {
        if (trend === 'up') {
            return (
                <svg className="w-3 h-3 text-trade-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7h-10" />
                </svg>
            );
        } else if (trend === 'down') {
            return (
                <svg className="w-3 h-3 text-trade-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
            );
        }
        return null;
    };

    const cardContent = (
        <CardContent className={clsx('p-4', compact && 'p-3')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {getCurrencyIcon()}
                    <div>
                        <p className={clsx(
                            'font-medium text-foreground',
                            compact ? 'text-sm' : 'text-base'
                        )}>
                            {getCurrencyLabel()}
                        </p>
                        {showTrend && trendValue !== undefined && (
                            <div className="flex items-center space-x-1 mt-1">
                                {getTrendIcon()}
                                <span className={clsx(
                                    'text-xs font-medium',
                                    trend === 'up' && 'text-trade-green',
                                    trend === 'down' && 'text-trade-red',
                                    trend === 'neutral' && 'text-muted-foreground'
                                )}>
                  {trend === 'up' && '+'}
                                    <CurrencyDisplay amount={trendValue} currency={currency} compact />
                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    <CurrencyDisplay
                        amount={amount}
                        currency={currency}
                        className={clsx(
                            'font-semibold',
                            currency === 'USD' ? 'text-trade-green' : 'text-primary',
                            compact ? 'text-lg' : 'text-xl'
                        )}
                        animated={animated}
                    />
                </div>
            </div>
        </CardContent>
    );

    if (onClick) {
        return (
            <Card
                className={clsx(
                    'bg-muted/50 border-border hover:bg-muted/70 transition-colors cursor-pointer',
                    animated && 'hover:shadow-md'
                )}
                onClick={onClick}
            >
                {cardContent}
            </Card>
        );
    }

    return (
        <Card className="bg-muted/50 border-border">
            {cardContent}
        </Card>
    );
};

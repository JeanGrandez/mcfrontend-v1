'use client';

import { formatCurrency, formatExchangeRate, cn } from '@/lib/utils';
// src/components/account/currency-display.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';


interface CurrencyDisplayProps {
    amount: number;
    currency: 'USD' | 'PEN';
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showSymbol?: boolean;
    showFullName?: boolean;
}

export function CurrencyDisplay({
                                    amount,
                                    currency,
                                    className,
                                    size = 'md',
                                    showSymbol = true,
                                    showFullName = false,
                                }: CurrencyDisplayProps) {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg font-semibold',
    };

    const currencyInfo = {
        USD: {
            symbol: '$',
            name: 'Dólares',
            code: 'USD',
            color: 'text-trade-green',
        },
        PEN: {
            symbol: 'S/.',
            name: 'Soles',
            code: 'PEN',
            color: 'text-trade-blue',
        },
    };

    const info = currencyInfo[currency];
    const formattedAmount = formatCurrency(amount, currency);

    return (
        <span className={cn(
            sizeClasses[size],
            info.color,
            className
        )}>
      {showSymbol && formattedAmount}
            {!showSymbol && amount.toFixed(2)}
            {showFullName && (
                <span className="ml-1 text-muted-foreground text-sm">
          {info.name}
        </span>
            )}
    </span>
    );
}

interface ExchangeRateDisplayProps {
    rate: number;
    className?: string;
    label?: string;
    showLabel?: boolean;
}

export function ExchangeRateDisplay({
                                        rate,
                                        className,
                                        label = 'T.C.',
                                        showLabel = true,
                                    }: ExchangeRateDisplayProps) {
    return (
        <span className={cn("flex items-center gap-1", className)}>
      {showLabel && (
          <span className="text-sm text-muted-foreground">{label}</span>
      )}
            <span className="font-medium">
        {formatExchangeRate(rate)}
      </span>
    </span>
    );
}

interface CurrencyPairProps {
    usdAmount: number;
    penAmount: number;
    exchangeRate?: number;
    className?: string;
    layout?: 'horizontal' | 'vertical';
    showRate?: boolean;
}

export function CurrencyPair({
                                 usdAmount,
                                 penAmount,
                                 exchangeRate,
                                 className,
                                 layout = 'horizontal',
                                 showRate = false,
                             }: CurrencyPairProps) {
    const containerClass = layout === 'horizontal'
        ? 'flex items-center gap-4'
        : 'space-y-2';

    return (
        <div className={cn(containerClass, className)}>
            <CurrencyDisplay amount={usdAmount} currency="USD" />

            {layout === 'horizontal' && (
                <span className="text-muted-foreground">→</span>
            )}

            <CurrencyDisplay amount={penAmount} currency="PEN" />

            {showRate && exchangeRate && (
                <ExchangeRateDisplay rate={exchangeRate} />
            )}
        </div>
    );
}

interface AmountInputDisplayProps {
    value: number;
    currency: 'USD' | 'PEN';
    isEditing?: boolean;
    placeholder?: string;
    onChange?: (value: number) => void;
    className?: string;
    error?: boolean;
}

export function AmountInputDisplay({
                                       value,
                                       currency,
                                       isEditing = false,
                                       placeholder,
                                       onChange,
                                       className,
                                       error = false,
                                   }: AmountInputDisplayProps) {
    const currencyInfo = {
        USD: { symbol: '$', step: '0.01', max: 1000000 },
        PEN: { symbol: 'S/.', step: '0.01', max: 3000000 },
    };

    const info = currencyInfo[currency];

    if (isEditing && onChange) {
        return (
            <div className={cn("relative", className)}>
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {info.symbol}
        </span>
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    placeholder={placeholder}
                    step={info.step}
                    min="0"
                    max={info.max}
                    className={cn(
                        "w-full pl-8 pr-4 py-2 rounded border bg-background",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        error ? "border-destructive" : "border-border"
                    )}
                />
            </div>
    compact?: boolean;
    showSymbol?: boolean;
    animated?: boolean;
    precision?: number;
    className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
                                                                    amount,
                                                                    currency,
                                                                    compact = false,
                                                                    showSymbol = true,
                                                                    animated = false,
                                                                    precision,
                                                                    className,
                                                                }) => {
    const [displayAmount, setDisplayAmount] = useState(amount);
    const [isAnimating, setIsAnimating] = useState(false);

    // Animate number changes
    useEffect(() => {
        if (!animated || amount === displayAmount) return;

        setIsAnimating(true);
        const startValue = displayAmount;
        const difference = amount - startValue;
        const duration = 500; // ms
        const steps = 30;
        const stepValue = difference / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const newValue = startValue + (stepValue * currentStep);

            if (currentStep >= steps) {
                setDisplayAmount(amount);
                setIsAnimating(false);
                clearInterval(timer);
            } else {
                setDisplayAmount(newValue);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [amount, animated, displayAmount]);

    const formatCurrency = (value: number) => {
        const decimals = precision !== undefined ? precision : (compact ? 0 : 2);

        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(value);
        } else {
            return new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(value);
        }
    };

    const formatNumber = (value: number) => {
        const decimals = precision !== undefined ? precision : (compact ? 0 : 2);

        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    };

    const getCurrencySymbol = () => {
        return currency === 'USD' ? '$' : 'S/';
    };

    if (showSymbol) {
        return (
            <span className={clsx(
                'font-mono transition-all duration-300',
                isAnimating && 'scale-105',
                className
            )}>
        {formatCurrency(displayAmount)}
      </span>
        );
    }

    return (
        <CurrencyDisplay
            amount={value}
            currency={currency}
            className={className}
        />
    );
}

interface ProfitDisplayProps {
    percentage: number;
    amount?: number;
    currency?: 'USD' | 'PEN';
    className?: string;
    showAmount?: boolean;
}

export function ProfitDisplay({
                                  percentage,
                                  amount,
                                  currency = 'USD',
                                  className,
                                  showAmount = false,
                              }: ProfitDisplayProps) {
    const isProfit = percentage >= 0;
    const colorClass = isProfit ? 'text-trade-green' : 'text-trade-red';

    return (
        <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-medium", colorClass)}>
        {isProfit ? '+' : ''}{percentage.toFixed(2)}%
      </span>

            {showAmount && amount !== undefined && (
                <span className={cn("text-sm", colorClass)}>
          ({isProfit ? '+' : ''}{formatCurrency(amount, currency)})
        </span>
            )}
        </div>
    );
}

interface BalanceComparisonProps {
    initialUsd: number;
    initialPen: number;
    currentUsd: number;
    currentPen: number;
    exchangeRate: number;
    className?: string;
}

export function BalanceComparison({
                                      initialUsd,
                                      initialPen,
                                      currentUsd,
                                      currentPen,
                                      exchangeRate,
                                      className,
                                  }: BalanceComparisonProps) {
    // Calculate total values in USD
    const initialTotal = initialUsd + (initialPen / exchangeRate);
    const currentTotal = currentUsd + (currentPen / exchangeRate);
    const profitLoss = currentTotal - initialTotal;
    const profitPercentage = (profitLoss / initialTotal) * 100;

    return (
        <div className={cn("space-y-3", className)}>
            {/* Initial vs Current */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Inicial</h4>
                    <CurrencyPair
                        usdAmount={initialUsd}
                        penAmount={initialPen}
                        layout="vertical"
                    />
                </div>

                <div>
                    <h4 className="font-medium text-muted-foreground mb-2">Actual</h4>
                    <CurrencyPair
                        usdAmount={currentUsd}
                        penAmount={currentPen}
                        layout="vertical"
                    />
                </div>
            </div>

            {/* Profit/Loss Summary */}
            <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Resultado:</span>
                    <ProfitDisplay
                        percentage={profitPercentage}
                        amount={profitLoss}
                        currency="USD"
                        showAmount
                    />
                </div>
            </div>
        </div>
    );
}

export default CurrencyDisplay;
        <span className={clsx(
            'font-mono transition-all duration-300',
            isAnimating && 'scale-105',
            className
        )}>
      {!compact && <span className="text-muted-foreground mr-1">{getCurrencySymbol()}</span>}
            {formatNumber(displayAmount)}
    </span>
    );
};

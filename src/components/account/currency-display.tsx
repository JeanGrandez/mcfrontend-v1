// src/components/account/currency-display.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';

interface CurrencyDisplayProps {
    amount: number;
    currency: 'USD' | 'PEN';
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
// src/components/trading/order-form.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { Select } from '@/components/ui/select';
import { useMarketData, useUserBalance } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/useToast';
import { ApiService } from '@/lib/api';
import { orderSchema, type OrderFormData } from '@/lib/validations';
import { formatCurrency, cn } from '@/lib/utils';
import { TRADING } from '@/lib/constants';

interface OrderFormProps {
    className?: string;
    onOrderCreated?: () => void;
    defaultType?: 'buy' | 'sell';
    defaultRate?: number;
}

export const OrderForm: React.FC<OrderFormProps> = ({
                                                        className,
                                                        onOrderCreated,
                                                        defaultType = 'buy',
                                                        defaultRate
                                                    }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderType, setOrderType] = useState<'buy' | 'sell'>(defaultType);
    const [priceType, setPriceType] = useState<'market' | 'limit'>('market');

    const { orderBook } = useMarketData();
    const userBalance = useUserBalance();
    const { showSuccess, showError } = useToast();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<OrderFormData>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            type: defaultType,
            usdAmount: 100,
            exchangeRate: defaultRate || 3.55,
            isMarketPrice: true
        }
    });

    const watchedAmount = watch('usdAmount');
    const watchedRate = watch('exchangeRate');

    // Update form when market data changes
    useEffect(() => {
        if (orderBook && priceType === 'market') {
            const rate = orderType === 'buy' ? orderBook.bestSellRate : orderBook.bestBuyRate;
            if (rate) {
                setValue('exchangeRate', rate);
            }
        }
    }, [orderBook, orderType, priceType, setValue]);

    // Update rate when defaultRate changes
    useEffect(() => {
        if (defaultRate) {
            setValue('exchangeRate', defaultRate);
        }
    }, [defaultRate, setValue]);

    const calculateTotals = () => {
        const amount = watchedAmount || 0;
        const rate = watchedRate || 0;
        const penAmount = amount * rate;

        // Simple commission calculation (0.5%)
        const commission = penAmount * 0.005;

        if (orderType === 'buy') {
            return {
                penAmount,
                commission,
                totalToPay: penAmount + commission,
                totalToReceive: amount
            };
        } else {
            return {
                penAmount,
                commission,
                totalToPay: amount,
                totalToReceive: penAmount - commission
            };
        }
    };

    const totals = calculateTotals();

    const canAffordOrder = () => {
        if (!userBalance) return false;

        if (orderType === 'buy') {
            return userBalance.penBalance >= totals.totalToPay;
        } else {
            return userBalance.usdBalance >= totals.totalToPay;
        }
    };

    const getMarketRate = () => {
        if (!orderBook) return 0;
        return orderType === 'buy' ? orderBook.bestSellRate : orderBook.bestBuyRate;
    };

    const onSubmit = async (data: OrderFormData) => {
        try {
            setIsSubmitting(true);

            const orderData = {
                ...data,
                type: orderType,
                isMarketPrice: priceType === 'market'
            };

            const response = await ApiService.createOrder(orderData);

            if (response.success) {
                showSuccess(
                    'Orden creada exitosamente',
                    `Orden de ${orderType === 'buy' ? 'compra' : 'venta'} por ${formatCurrency(data.usdAmount, 'USD')}`
                );

                reset();
                onOrderCreated?.();
            }
        } catch (error) {
            showError(
                'Error al crear orden',
                error instanceof Error ? error.message : 'Error desconocido'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const isMarketClosed = orderBook?.marketStatus === 'closed';

    return (
        <Card className={cn("w-full max-w-md", className)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Nueva Orden</span>
                    {orderBook && (
                        <Badge variant={orderBook.marketStatus === 'open' ? 'success' : 'destructive'}>
                            {orderBook.marketStatus === 'open' ? 'Abierto' : 'Cerrado'}
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Order Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={orderType === 'buy' ? 'default' : 'secondary'}
                        onClick={() => setOrderType('buy')}
                        className={orderType === 'buy' ? 'bg-trade-green hover:bg-trade-green/90' : ''}
                    >
                        Comprar USD
                    </Button>
                    <Button
                        type="button"
                        variant={orderType === 'sell' ? 'default' : 'secondary'}
                        onClick={() => setOrderType('sell')}
                        className={orderType === 'sell' ? 'bg-trade-red hover:bg-trade-red/90' : ''}
                    >
                        Vender USD
                    </Button>
                </div>

                {/* Price Type Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant={priceType === 'market' ? 'default' : 'secondary'}
                        onClick={() => {
                            setPriceType('market');
                            setValue('isMarketPrice', true);
                            const rate = getMarketRate();
                            if (rate) setValue('exchangeRate', rate);
                        }}
                        size="sm"
                    >
                        Precio Mercado
                    </Button>
                    <Button
                        type="button"
                        variant={priceType === 'limit' ? 'default' : 'secondary'}
                        onClick={() => {
                            setPriceType('limit');
                            setValue('isMarketPrice', false);
                        }}
                        size="sm"
                    >
                        Precio Límite
                    </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Amount Input */}
                    <Input
                        label="Monto USD"
                        type="number"
                        step="0.01"
                        min={TRADING.MIN_USD_AMOUNT}
                        max={TRADING.MAX_USD_AMOUNT}
                        placeholder="100.00"
                        error={!!errors.usdAmount}
                        helperText={errors.usdAmount?.message}
                        leftIcon={<span className="text-trade-green font-bold">$</span>}
                        {...register('usdAmount', { valueAsNumber: true })}
                    />

                    {/* Exchange Rate Input */}
                    <Input
                        label="Tipo de Cambio"
                        type="number"
                        step="0.001"
                        min={TRADING.MIN_EXCHANGE_RATE}
                        max={TRADING.MAX_EXCHANGE_RATE}
                        placeholder="3.550"
                        disabled={priceType === 'market'}
                        error={!!errors.exchangeRate}
                        helperText={errors.exchangeRate?.message || (priceType === 'market' ? 'Precio automático del mercado' : '')}
                        leftIcon={<span className="text-muted-foreground">S/</span>}
                        {...register('exchangeRate', { valueAsNumber: true })}
                    />

                    {/* Order Summary */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium text-sm">Resumen de la Orden</h4>

                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    {orderType === 'buy' ? 'Pagas:' : 'Envías:'}
                                </span>
                                <span className="font-medium">
                                    {orderType === 'buy'
                                        ? formatCurrency(totals.totalToPay, 'PEN')
                                        : formatCurrency(totals.totalToPay, 'USD')
                                    }
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Comisión:</span>
                                <span className="font-medium">
                                    {formatCurrency(totals.commission, 'PEN')}
                                </span>
                            </div>

                            <div className="flex justify-between border-t pt-1">
                                <span className="text-muted-foreground">
                                    {orderType === 'buy' ? 'Recibes:' : 'Recibes:'}
                                </span>
                                <span className="font-semibold">
                                    {orderType === 'buy'
                                        ? formatCurrency(totals.totalToReceive, 'USD')
                                        : formatCurrency(totals.totalToReceive, 'PEN')
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Balance Check */}
                    {userBalance && (
                        <div className="text-sm">
                            <p className="text-muted-foreground">
                                Saldo disponible:
                                <span className="font-medium ml-1">
                                    {orderType === 'buy'
                                        ? formatCurrency(userBalance.penBalance, 'PEN')
                                        : formatCurrency(userBalance.usdBalance, 'USD')
                                    }
                                </span>
                            </p>
                            {!canAffordOrder() && (
                                <p className="text-destructive text-xs mt-1">
                                    Fondos insuficientes para esta orden
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        loading={isSubmitting}
                        disabled={isMarketClosed || !canAffordOrder() || isSubmitting}
                        variant={orderType === 'buy' ? 'default' : 'destructive'}
                    >
                        {isSubmitting ? 'Creando orden...' : (
                            isMarketClosed ? 'Mercado Cerrado' :
                                `${orderType === 'buy' ? 'Comprar' : 'Vender'} ${formatCurrency(watchedAmount || 0, 'USD')}`
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default OrderForm;
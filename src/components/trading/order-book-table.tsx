// src/components/trading/order-book-table.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Badge } from '@/components/ui';
import { useMarketData } from '@/hooks/useWebSocket';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import { ApiService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

interface OrderBookTableProps {
    onCreateOrder?: (type: 'buy' | 'sell', rate: number) => void;
    className?: string;
}

export const OrderBookTable: React.FC<OrderBookTableProps> = ({
                                                                  onCreateOrder,
                                                                  className
                                                              }) => {
    const { orderBook, isLoading } = useMarketData();
    const { showSuccess, showError } = useToast();
    const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

    const handleQuickOrder = async (type: 'buy' | 'sell', rate: number, amount: number, orderId: string) => {
        try {
            setLoadingOrderId(orderId);

            const response = await ApiService.createOrder({
                type,
                usdAmount: amount,
                exchangeRate: rate,
                isMarketPrice: true
            });

            if (response.success) {
                showSuccess(`Orden de ${type === 'buy' ? 'compra' : 'venta'} creada exitosamente`);
                onCreateOrder?.(type, rate);
            }
        } catch (error) {
            showError('Error al crear orden', error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoadingOrderId(null);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            setLoadingOrderId(orderId);

            const response = await ApiService.cancelOrder(orderId);

            if (response.success) {
                showSuccess('Orden cancelada exitosamente');
            }
        } catch (error) {
            showError('Error al cancelar orden', error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoadingOrderId(null);
        }
    };

    if (isLoading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Loading skeletons */}
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-card rounded-lg border p-4">
                            <div className="animate-pulse">
                                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="h-12 bg-muted rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!orderBook) {
        return (
            <div className={cn("text-center py-8", className)}>
                <p className="text-muted-foreground">No hay datos del mercado disponibles</p>
            </div>
        );
    }

    const { buyOrders, sellOrders, marketStatus, bestBuyRate, bestSellRate } = orderBook;

    return (
        <div className={cn("space-y-6", className)}>
            {/* Market Status */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Libro de Órdenes</h2>
                <Badge variant={marketStatus === 'open' ? 'success' : 'destructive'}>
                    {marketStatus === 'open' ? '🟢 Mercado Abierto' : '🔴 Mercado Cerrado'}
                </Badge>
            </div>

            {/* Best Rates Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-trade-green/10 border border-trade-green/20 rounded-lg p-4">
                    <div className="text-center">
                        <p className="text-sm text-trade-green font-medium">Mejor Compra</p>
                        <p className="text-2xl font-bold text-trade-green">
                            {bestBuyRate ? bestBuyRate.toFixed(3) : '--'}
                        </p>
                    </div>
                </div>
                <div className="bg-trade-red/10 border border-trade-red/20 rounded-lg p-4">
                    <div className="text-center">
                        <p className="text-sm text-trade-red font-medium">Mejor Venta</p>
                        <p className="text-2xl font-bold text-trade-red">
                            {bestSellRate ? bestSellRate.toFixed(3) : '--'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Books */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Buy Orders (Demandas) */}
                <div className="bg-card rounded-lg border">
                    <div className="p-4 border-b bg-trade-green/10">
                        <h3 className="font-semibold text-trade-green flex items-center gap-2">
                            🟢 Demandas (Compra USD)
                            <span className="text-sm font-normal">({buyOrders.length})</span>
                        </h3>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Tipo Cambio</TableHead>
                                <TableHead>Total PEN</TableHead>
                                <TableHead>Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buyOrders.slice(0, 10).map((order) => (
                                <TableRow
                                    key={order.id}
                                    variant={order.isOwn ? 'own' : 'buy'}
                                >
                                    <TableCell className="font-medium">
                                        {formatCurrency(order.usdAmount, 'USD')}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {order.exchangeRate.toFixed(3)}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(order.usdAmount * order.exchangeRate, 'PEN')}
                                    </TableCell>
                                    <TableCell>
                                        {order.isOwn ? (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleCancelOrder(order.id)}
                                                loading={loadingOrderId === order.id}
                                                disabled={marketStatus === 'closed'}
                                            >
                                                Cancelar
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleQuickOrder('sell', order.exchangeRate, order.usdAmount, order.id)}
                                                loading={loadingOrderId === order.id}
                                                disabled={marketStatus === 'closed'}
                                            >
                                                Vender a {order.exchangeRate.toFixed(3)}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {buyOrders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No hay órdenes de compra
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Sell Orders (Ofertas) */}
                <div className="bg-card rounded-lg border">
                    <div className="p-4 border-b bg-trade-red/10">
                        <h3 className="font-semibold text-trade-red flex items-center gap-2">
                            🔴 Ofertas (Venta USD)
                            <span className="text-sm font-normal">({sellOrders.length})</span>
                        </h3>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cantidad</TableHead>
                                <TableHead>Tipo Cambio</TableHead>
                                <TableHead>Total PEN</TableHead>
                                <TableHead>Acción</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sellOrders.slice(0, 10).map((order) => (
                                <TableRow
                                    key={order.id}
                                    variant={order.isOwn ? 'own' : 'sell'}
                                >
                                    <TableCell className="font-medium">
                                        {formatCurrency(order.usdAmount, 'USD')}
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {order.exchangeRate.toFixed(3)}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(order.usdAmount * order.exchangeRate, 'PEN')}
                                    </TableCell>
                                    <TableCell>
                                        {order.isOwn ? (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleCancelOrder(order.id)}
                                                loading={loadingOrderId === order.id}
                                                disabled={marketStatus === 'closed'}
                                            >
                                                Cancelar
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleQuickOrder('buy', order.exchangeRate, order.usdAmount, order.id)}
                                                loading={loadingOrderId === order.id}
                                                disabled={marketStatus === 'closed'}
                                            >
                                                Comprar a {order.exchangeRate.toFixed(3)}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {sellOrders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No hay órdenes de venta
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Market Info */}
            {orderBook.lastOperation && (
                <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Última Operación</h4>
                    <div className="flex items-center gap-4 text-sm">
                        <span>
                            Monto: <span className="font-medium">{formatCurrency(orderBook.lastOperation.amount, 'USD')}</span>
                        </span>
                        <span>
                            T.C.: <span className="font-medium">{orderBook.lastOperation.rate.toFixed(3)}</span>
                        </span>
                        <span>
                            Fecha: <span className="font-medium">{formatDateTime(orderBook.lastOperation.date)}</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderBookTable;
// src/components/trading/operations-table.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button, Input } from '@/components/ui';
import { Select } from '@/components/ui/select';
import { ApiService } from '@/lib/api';
import { formatCurrency, formatDateTime, cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface Operation {
    id: string;
    type: 'buy' | 'sell';
    usdAmount: number;
    exchangeRate: number;
    penAmount: number;
    status: 'completed';
    date: string;
    commission: number;
    counterparty?: string;
}

interface OperationsTableProps {
    className?: string;
    showFilters?: boolean;
    maxRows?: number;
    userId?: string; // If provided, shows only operations for this user
}

export const OperationsTable: React.FC<OperationsTableProps> = ({
                                                                    className,
                                                                    showFilters = true,
                                                                    maxRows,
                                                                    userId
                                                                }) => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all', // 'all', 'buy', 'sell'
        dateFrom: '',
        dateTo: '',
        minAmount: '',
        maxAmount: ''
    });
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'rate'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { showError } = useToast();

    useEffect(() => {
        fetchOperations();
    }, [userId]);

    const fetchOperations = async () => {
        try {
            setLoading(true);

            const response = userId
                ? await ApiService.getUserOperations()
                : await ApiService.getUserOperations(); // Same endpoint for now, but could be different for admin

            if (response.success) {
                setOperations(response.data.operations);
            }
        } catch (error) {
            showError('Error al cargar operaciones', error instanceof Error ? error.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const filteredOperations = operations.filter(operation => {
        // Type filter
        if (filters.type !== 'all' && operation.type !== filters.type) {
            return false;
        }

        // Date filters
        if (filters.dateFrom) {
            const operationDate = new Date(operation.date);
            const fromDate = new Date(filters.dateFrom);
            if (operationDate < fromDate) return false;
        }

        if (filters.dateTo) {
            const operationDate = new Date(operation.date);
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59); // End of day
            if (operationDate > toDate) return false;
        }

        // Amount filters
        if (filters.minAmount && operation.usdAmount < parseFloat(filters.minAmount)) {
            return false;
        }

        if (filters.maxAmount && operation.usdAmount > parseFloat(filters.maxAmount)) {
            return false;
        }

        return true;
    });

    const sortedOperations = [...filteredOperations].sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortBy) {
            case 'date':
                aValue = new Date(a.date).getTime();
                bValue = new Date(b.date).getTime();
                break;
            case 'amount':
                aValue = a.usdAmount;
                bValue = b.usdAmount;
                break;
            case 'rate':
                aValue = a.exchangeRate;
                bValue = b.exchangeRate;
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const displayedOperations = maxRows ? sortedOperations.slice(0, maxRows) : sortedOperations;

    const totalVolume = filteredOperations.reduce((sum, op) => sum + op.usdAmount, 0);
    const totalCommissions = filteredOperations.reduce((sum, op) => sum + op.commission, 0);

    if (loading) {
        return (
            <div className={cn("space-y-4", className)}>
                <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {/* Filters */}
            {showFilters && (
                <div className="bg-card rounded-lg border p-4">
                    <h3 className="font-medium mb-4">Filtros y Ordenamiento</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                            label="Tipo de Operación"
                            value={filters.type}
                            onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                            options={[
                                { value: 'all', label: 'Todas' },
                                { value: 'buy', label: 'Compras' },
                                { value: 'sell', label: 'Ventas' }
                            ]}
                        />

                        <Input
                            label="Fecha Desde"
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        />

                        <Input
                            label="Fecha Hasta"
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        />

                        <Select
                            label="Ordenar por"
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(value) => {
                                const [newSortBy, newSortOrder] = value.split('-') as [typeof sortBy, typeof sortOrder];
                                setSortBy(newSortBy);
                                setSortOrder(newSortOrder);
                            }}
                            options={[
                                { value: 'date-desc', label: 'Fecha (Reciente)' },
                                { value: 'date-asc', label: 'Fecha (Antigua)' },
                                { value: 'amount-desc', label: 'Monto (Mayor)' },
                                { value: 'amount-asc', label: 'Monto (Menor)' },
                                { value: 'rate-desc', label: 'T.C. (Mayor)' },
                                { value: 'rate-asc', label: 'T.C. (Menor)' }
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <Input
                            placeholder="Monto mín. USD"
                            type="number"
                            step="0.01"
                            value={filters.minAmount}
                            onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                            className="max-w-40"
                        />

                        <Input
                            placeholder="Monto máx. USD"
                            type="number"
                            step="0.01"
                            value={filters.maxAmount}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                            className="max-w-40"
                        />

                        <Button
                            variant="secondary"
                            onClick={() => setFilters({
                                type: 'all',
                                dateFrom: '',
                                dateTo: '',
                                minAmount: '',
                                maxAmount: ''
                            })}
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Operaciones</p>
                    <p className="text-2xl font-bold">{filteredOperations.length}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Volumen Total</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalVolume, 'USD')}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Comisiones Pagadas</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalCommissions, 'PEN')}</p>
                </div>
            </div>

            {/* Operations Table */}
            <div className="bg-card rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Monto USD</TableHead>
                            <TableHead>Tipo de Cambio</TableHead>
                            <TableHead>Monto PEN</TableHead>
                            <TableHead>Comisión</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedOperations.map((operation) => (
                            <TableRow key={operation.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">
                                            {formatDateTime(operation.date)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            ID: {operation.id.slice(-8)}
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant={operation.type === 'buy' ? 'success' : 'destructive'}>
                                        {operation.type === 'buy' ? '🟢 Compra' : '🔴 Venta'}
                                    </Badge>
                                </TableCell>

                                <TableCell className="font-mono">
                                    {formatCurrency(operation.usdAmount, 'USD')}
                                </TableCell>

                                <TableCell className="font-mono">
                                    {operation.exchangeRate.toFixed(3)}
                                </TableCell>

                                <TableCell className="font-mono">
                                    {formatCurrency(operation.penAmount, 'PEN')}
                                </TableCell>

                                <TableCell className="font-mono text-muted-foreground">
                                    {formatCurrency(operation.commission, 'PEN')}
                                </TableCell>

                                <TableCell>
                                    <Badge variant="secondary">
                                        ✅ Completada
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}

                        {displayedOperations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="text-muted-foreground">
                                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p>No hay operaciones que mostrar</p>
                                        <p className="text-sm mt-1">
                                            {filters.type !== 'all' || filters.dateFrom || filters.dateTo
                                                ? 'Intenta ajustar los filtros'
                                                : 'Las operaciones aparecerán aquí cuando realices trading'
                                            }
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Show more indicator */}
            {maxRows && sortedOperations.length > maxRows && (
                <div className="text-center text-sm text-muted-foreground">
                    Mostrando {maxRows} de {sortedOperations.length} operaciones
                </div>
            )}
        </div>
    );
};

export default OperationsTable;
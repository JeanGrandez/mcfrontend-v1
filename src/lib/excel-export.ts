// src/lib/excel-export.ts
import * as XLSX from 'xlsx';

export interface UserExportData {
    id: string;
    name: string;
    email: string;
    dni: string;
    phone: string;
    usdBalance: number;
    penBalance: number;
    profitPercentage: number;
    rankingPosition: number;
    completedOperations: number;
    registrationDate: string;
}

export interface OperationExportData {
    id: string;
    buyerName: string;
    sellerName: string;
    usdAmount: number;
    exchangeRate: number;
    penAmount: number;
    buyerCommission: number;
    sellerCommission: number;
    date: string;
}

export interface ExportOptions {
    includeOperations?: boolean;
    includeUsers?: boolean;
    filename?: string;
    sheetNames?: {
        users?: string;
        operations?: string;
        summary?: string;
    };
}

/**
 * Export data to Excel file
 */
export function exportToExcel(
    users: UserExportData[],
    operations: OperationExportData[] = [],
    options: ExportOptions = {}
): void {
    const {
        includeOperations = true,
        includeUsers = true,
        filename = 'trading_simulator_export',
        sheetNames = {
            users: 'Usuarios',
            operations: 'Operaciones',
            summary: 'Resumen'
        }
    } = options;

    const workbook = XLSX.utils.book_new();

    // Users sheet
    if (includeUsers && users.length > 0) {
        const usersData = users.map(user => ({
            'ID': user.id,
            'Nombre': user.name,
            'Email': user.email,
            'DNI': user.dni,
            'Teléfono': user.phone,
            'Saldo USD': user.usdBalance,
            'Saldo PEN': user.penBalance,
            'Ganancia %': user.profitPercentage,
            'Posición Ranking': user.rankingPosition,
            'Operaciones': user.completedOperations,
            'Fecha Registro': user.registrationDate,
        }));

        const usersSheet = XLSX.utils.json_to_sheet(usersData);

        // Set column widths
        usersSheet['!cols'] = [
            { width: 15 }, // ID
            { width: 25 }, // Nombre
            { width: 30 }, // Email
            { width: 12 }, // DNI
            { width: 15 }, // Teléfono
            { width: 12 }, // Saldo USD
            { width: 12 }, // Saldo PEN
            { width: 12 }, // Ganancia %
            { width: 15 }, // Posición
            { width: 12 }, // Operaciones
            { width: 20 }, // Fecha
        ];

        XLSX.utils.book_append_sheet(workbook, usersSheet, sheetNames.users);
    }

    // Operations sheet
    if (includeOperations && operations.length > 0) {
        const operationsData = operations.map(op => ({
            'ID': op.id,
            'Comprador': op.buyerName,
            'Vendedor': op.sellerName,
            'Monto USD': op.usdAmount,
            'Tipo Cambio': op.exchangeRate,
            'Monto PEN': op.penAmount,
            'Comisión Comprador': op.buyerCommission,
            'Comisión Vendedor': op.sellerCommission,
            'Fecha': op.date,
        }));

        const operationsSheet = XLSX.utils.json_to_sheet(operationsData);

        // Set column widths
        operationsSheet['!cols'] = [
            { width: 15 }, // ID
            { width: 25 }, // Comprador
            { width: 25 }, // Vendedor
            { width: 12 }, // Monto USD
            { width: 12 }, // Tipo Cambio
            { width: 12 }, // Monto PEN
            { width: 15 }, // Comisión Comprador
            { width: 15 }, // Comisión Vendedor
            { width: 20 }, // Fecha
        ];

        XLSX.utils.book_append_sheet(workbook, operationsSheet, sheetNames.operations);
    }

    // Summary sheet
    const summary = {
        'Total Usuarios': users.length,
        'Total Operaciones': operations.length,
        'Volumen Total USD': operations.reduce((sum, op) => sum + op.usdAmount, 0),
        'Volumen Total PEN': operations.reduce((sum, op) => sum + op.penAmount, 0),
        'Comisiones Totales': operations.reduce((sum, op) => sum + op.buyerCommission + op.sellerCommission, 0),
        'Fecha Exportación': new Date().toLocaleString('es-PE'),
    };

    const summaryData = Object.entries(summary).map(([key, value]) => ({
        'Métrica': key,
        'Valor': value
    }));

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ width: 25 }, { width: 20 }];

    XLSX.utils.book_append_sheet(workbook, summarySheet, sheetNames.summary);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, finalFilename);
}

/**
 * Export users to CSV
 */
export function exportUsersToCSV(users: UserExportData[], filename: string = 'usuarios'): void {
    const csvData = users.map(user => ({
        ID: user.id,
        Nombre: user.name,
        Email: user.email,
        DNI: user.dni,
        Telefono: user.phone,
        SaldoUSD: user.usdBalance,
        SaldoPEN: user.penBalance,
        GananciaPercentaje: user.profitPercentage,
        PosicionRanking: user.rankingPosition,
        OperacionesCompletadas: user.completedOperations,
        FechaRegistro: user.registrationDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    XLSX.writeFile(workbook, `${filename}_${timestamp}.csv`);
}

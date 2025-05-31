// src/components/admin/excel-export.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks';

interface ExcelExportProps {
    variant?: 'button' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    includeOperations?: boolean;
    filename?: string;
}

export const ExcelExport: React.FC<ExcelExportProps> = ({
                                                            variant = 'button',
                                                            size = 'md',
                                                            includeOperations = true,
                                                            filename = 'trading_simulator_data',
                                                        }) => {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    const exportToExcel = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const response = await fetch('/api/admin/export', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    includeOperations,
                    format: 'excel',
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            // Handle file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            link.download = `${filename}_${timestamp}.xlsx`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showSuccess(
                'Exportación completada',
                'Los datos se han descargado correctamente'
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            showError('Error al exportar', errorMessage);
            console.error('Error exporting to Excel:', err);
        } finally {
            setLoading(false);
        }
    };

    const iconContent = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    if (variant === 'icon') {
        return (
            <Button
                onClick={exportToExcel}
                loading={loading}
                variant="secondary"
                size={size}
                aria-label="Exportar a Excel"
            >
                {iconContent}
            </Button>
        );
    }

    return (
        <Button
            onClick={exportToExcel}
            loading={loading}
            variant="success"
            size={size}
        >
            {iconContent}
            <span className="ml-2">
        {loading ? 'Exportando...' : 'Exportar a Excel'}
      </span>
        </Button>
    );
};
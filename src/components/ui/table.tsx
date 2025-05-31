// src/components/ui/table.tsx
import React from 'react';
import { clsx } from 'clsx';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
    return (
        <div className="w-full overflow-auto">
            <table className={clsx('trading-table', className)} {...props}>
                {children}
            </table>
        </div>
    );
};

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
    return (
        <thead className={clsx('', className)} {...props}>
        {children}
        </thead>
    );
};

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
    return (
        <tbody className={clsx('', className)} {...props}>
        {children}
        </tbody>
    );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    children: React.ReactNode;
    variant?: 'default' | 'own' | 'buy' | 'sell';
}

export const TableRow: React.FC<TableRowProps> = ({
                                                      children,
                                                      className,
                                                      variant = 'default',
                                                      ...props
                                                  }) => {
    const variantClasses = {
        default: '',
        own: 'trading-row-own',
        buy: 'trading-row-buy',
        sell: 'trading-row-sell',
    };

    return (
        <tr className={clsx(variantClasses[variant], className)} {...props}>
            {children}
        </tr>
    );
};

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => {
    return (
        <th className={clsx('', className)} {...props}>
            {children}
        </th>
    );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className, ...props }) => {
    return (
        <td className={clsx('', className)} {...props}>
            {children}
        </td>
    );
};
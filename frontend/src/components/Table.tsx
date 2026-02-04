import React from 'react';
import styles from './Table.module.css';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
}

export function Table<T extends { id?: string | number } | any>({ columns, data, onRowClick, isLoading }: TableProps<T>) {
    if (isLoading) {
        return <div className={styles.loading}>Loading data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className={styles.empty}>No records found.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className={col.className}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIdx) => (
                        <tr
                            key={(item as any).id || rowIdx}
                            onClick={() => onRowClick && onRowClick(item)}
                            className={onRowClick ? styles.clickable : ''}
                        >
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} className={col.className}>
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

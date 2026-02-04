import React from 'react';

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, pageSize, total, onChange }) => {
    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
            <button
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                style={{ padding: '0.5rem 1rem', cursor: page > 1 ? 'pointer' : 'not-allowed' }}
            >
                Previous
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                style={{ padding: '0.5rem 1rem', cursor: page < totalPages ? 'pointer' : 'not-allowed' }}
            >
                Next
            </button>
        </div>
    );
};

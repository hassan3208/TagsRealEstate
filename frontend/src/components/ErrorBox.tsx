import React from 'react';

interface ErrorBoxProps {
    message: string;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            color: '#b91c1c',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
        }}>
            <strong>Error:</strong> {message}
        </div>
    );
};

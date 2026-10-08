import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorAlert({ message }) {
    if (!message) return null;
    return (
        <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            border: '1px solid #f87171'
        }}>
            <AlertTriangle size={20} />
            <div>
                <strong>Atenção:</strong><br/>
                {message}
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { api } from '../api/client';
import type { RawDeal, ImportResponse } from '../types';
import { ErrorBox } from '../components/ErrorBox';

export const ImportPage: React.FC = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ImportResponse | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setJsonInput(event.target?.result as string);
        };
        reader.readAsText(file);
    };

    const loadSample = () => {
        // Basic sample matching RawDeal
        const sample = [
            {
                "tenant": "Ebony Designs",
                "address": "90210 Wilshire Blvd",
                "size": 5000,
                "rent": "$50.00",
                "lease_type": "NNN",
                "start_date": "2024-01-01",
                "term_months": 60,
                "source": "manual_entry"
            }
        ];
        setJsonInput(JSON.stringify(sample, null, 2));
    };

    const handleImport = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            let deals: RawDeal[];
            try {
                deals = JSON.parse(jsonInput);
            } catch (e) {
                throw new Error("Invalid JSON format. Please check your input.");
            }

            if (!Array.isArray(deals)) {
                throw new Error("JSON must be an array of deal objects.");
            }

            const res = await api.importDeals(deals);
            setResult(res);
            if (res.imported > 0) {
                setJsonInput(''); // Clear on success
            }
        } catch (err: any) {
            setError(err.message || "Failed to import deals.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Import Deals</h1>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={loadSample} disabled={isLoading}>
                    Load Sample
                </button>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                />
            </div>

            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here or upload a file..."
                rows={15}
                style={{ width: '100%', padding: '10px', fontFamily: 'monospace' }}
                disabled={isLoading}
            />

            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleImport}
                    disabled={isLoading || !jsonInput.trim()}
                    style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isLoading ? 'Importing...' : 'Import Deals'}
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <ErrorBox message={error || ''} />
            </div>

            {result && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h3>Import Results</h3>
                    <p><strong>Imported:</strong> {result.imported}</p>
                    <p><strong>Skipped:</strong> {result.skipped}</p>

                    {result.errors.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <h4 style={{ color: '#dc2626' }}>Errors ({result.errors.length})</h4>
                            <ul style={{ maxHeight: '200px', overflowY: 'auto', background: '#fef2f2', padding: '10px' }}>
                                {result.errors.map((err, i) => (
                                    <li key={i} style={{ marginBottom: '5px' }}>
                                        <strong>Row {err.index}:</strong> {err.reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

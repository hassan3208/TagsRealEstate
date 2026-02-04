import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { MarketSummary as MarketSummaryType } from '../types';
import { ErrorBox } from '../components/ErrorBox';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MarketSummary: React.FC = () => {
    const [state, setState] = useState('CA'); // Default to CA or empty
    const [data, setData] = useState<MarketSummaryType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'WA']; // Simple preset list, or could be dynamic

    useEffect(() => {
        if (!state) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await api.getMarketSummary(state);
                setData(res);
            } catch (err) {
                setError("Failed to load market summary.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [state]);

    // Transform data for chart
    const chartData = data ? Object.entries(data.by_lease_type || {}).map(([name, value]) => ({ name, value })) : [];

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Market Analytics</h1>

            <div style={{ marginBottom: '30px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select State:</label>
                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', minWidth: '100px' }}
                >
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <ErrorBox message={error || ''} />

            {isLoading && <div>Loading analytics...</div>}

            {data && !isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {/* Card 1: Total Deals */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Deals</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#f97316' }}>{data.deal_count}</p>
                        </div>

                        {/* Card 2: Avg Rent */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Rent (PSF)</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#059669' }}>
                                ${(data.avg_rent_psf ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Lease Breakdown Section containing Chart and Stats */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ margin: '0 0 24px 0', color: '#334155', fontSize: '1.25rem', fontWeight: 'bold' }}>Lease Type Distribution</h3>

                        {data.deal_count === 0 ? (
                            <div style={{ color: '#9ca3af', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>No deals recorded for this region.</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px', alignItems: 'center' }}>
                                {/* Chart */}
                                <div style={{ height: '300px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                            <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} allowDecimals={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                cursor={{ fill: '#f8fafc' }}
                                            />
                                            <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Stats List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {Object.entries(data.by_lease_type || {}).map(([type, count]) => (
                                        <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <span style={{ fontWeight: '600', color: '#475569' }}>{type}</span>
                                            <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

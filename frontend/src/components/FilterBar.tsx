import React from 'react';
import type { DealFilters } from '../types';

interface FilterBarProps {
    filters: DealFilters;
    onChange: (filters: DealFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
    const handleChange = (key: keyof DealFilters, value: any) => {
        onChange({ ...filters, [key]: value, page: 1 });
    };

    return (
        <div className="card" style={{ marginBottom: '24px', borderTop: '4px solid var(--primary-color)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#334155' }}>Filter Deals</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>

                {/* City */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>City</label>
                    <input
                        type="text"
                        value={filters.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Search city..."
                    />
                </div>

                {/* State */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>State</label>
                    <input
                        type="text"
                        value={filters.state || ''}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="e.g. CA"
                    />
                </div>

                {/* Lease Type */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>Lease Type</label>
                    <select
                        value={filters.lease_type || ''}
                        onChange={(e) => handleChange('lease_type', e.target.value || undefined)}
                    >
                        <option value="">All Types</option>
                        <option value="NNN">NNN</option>
                        <option value="GROSS">Gross</option>
                        <option value="MODIFIED">Modified</option>
                        <option value="UNKNOWN">Unknown</option>
                    </select>
                </div>

                {/* Size Min */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>Min SqFt</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={filters.min_sqft || ''}
                        onChange={(e) => handleChange('min_sqft', e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>

                {/* Size Max */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>Max SqFt</label>
                    <input
                        type="number"
                        placeholder="Any"
                        value={filters.max_sqft || ''}
                        onChange={(e) => handleChange('max_sqft', e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>

                {/* Rent Min */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>Min Rent</label>
                    <input
                        type="number"
                        placeholder="$0"
                        value={filters.min_rent || ''}
                        onChange={(e) => handleChange('min_rent', e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>

                {/* Rent Max */}
                <div style={{ display: 'grid', gap: '6px' }}>
                    <label>Max Rent</label>
                    <input
                        type="number"
                        placeholder="Any"
                        value={filters.max_rent || ''}
                        onChange={(e) => handleChange('max_rent', e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>

            </div>
        </div>
    );
};

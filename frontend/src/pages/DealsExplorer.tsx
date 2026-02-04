import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Deal, DealFilters, PaginatedDeals } from '../types';
import { Table, type Column } from '../components/Table';
import { Pagination } from '../components/Pagination';
import { FilterBar } from '../components/FilterBar';
import { ErrorBox } from '../components/ErrorBox';

export const DealsExplorer: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState<PaginatedDeals | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize filters from URL or defaults
    const filters: DealFilters = useMemo(() => ({
        city: searchParams.get('city') || undefined,
        state: searchParams.get('state') || undefined,
        lease_type: (searchParams.get('lease_type') as any) || undefined,
        min_sqft: searchParams.get('min_sqft') ? Number(searchParams.get('min_sqft')) : undefined,
        max_sqft: searchParams.get('max_sqft') ? Number(searchParams.get('max_sqft')) : undefined,
        min_rent: searchParams.get('min_rent') ? Number(searchParams.get('min_rent')) : undefined,
        max_rent: searchParams.get('max_rent') ? Number(searchParams.get('max_rent')) : undefined,
        page: Number(searchParams.get('page')) || 1,
        page_size: Number(searchParams.get('page_size')) || 10,
    }), [searchParams]);

    const updateFilters = (newFilters: DealFilters) => {
        // Convert filtersObject to URLSearchParams friendly object
        const params: any = {};
        if (newFilters.city) params.city = newFilters.city;
        if (newFilters.state) params.state = newFilters.state;
        if (newFilters.lease_type) params.lease_type = newFilters.lease_type;
        if (newFilters.min_sqft) params.min_sqft = newFilters.min_sqft.toString();
        if (newFilters.max_sqft) params.max_sqft = newFilters.max_sqft.toString();
        if (newFilters.min_rent) params.min_rent = newFilters.min_rent.toString();
        if (newFilters.max_rent) params.max_rent = newFilters.max_rent.toString();

        // Always include pagination
        params.page = newFilters.page.toString();
        params.page_size = newFilters.page_size.toString();

        setSearchParams(params);
    };

    useEffect(() => {
        const fetchDeals = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await api.getDeals(filters);
                setData(res);
            } catch (err: any) {
                setError("Failed to load deals. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeals();
    }, [filters]);

    const columns: Column<Deal>[] = [
        { header: 'Tenant', accessor: 'tenant' },
        { header: 'Address', accessor: (d) => `${d.street}, ${d.city}, ${d.state}` },
        { header: 'Size (SF)', accessor: (d) => d.size_sqft.toLocaleString() },
        { header: 'Rent ($/PSF)', accessor: (d) => `$${d.rent_psf.toFixed(2)}` },
        { header: 'Type', accessor: 'lease_type' },
        { header: 'Start Date', accessor: 'start_date' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Deals Explorer</h1>
                <div>
                    {/* Optional Export or other header actions */}
                </div>
            </div>

            <FilterBar filters={filters} onChange={updateFilters} />

            <ErrorBox message={error || ''} />

            <Table
                columns={columns}
                data={data?.items || []}
                isLoading={isLoading}
            />

            {data && (
                <Pagination
                    page={data.page}
                    pageSize={data.page_size}
                    total={data.total}
                    onChange={(p) => updateFilters({ ...filters, page: p })}
                />
            )}
        </div>
    );
};

import axios from 'axios';
import type { RawDeal, ImportResponse, PaginatedDeals, DealFilters, MarketSummary } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    importDeals: async (deals: RawDeal[]): Promise<ImportResponse> => {
        const response = await client.post<ImportResponse>('/deals/import', deals);
        return response.data;
    },

    getDeals: async (filters: DealFilters): Promise<PaginatedDeals> => {
        const params = new URLSearchParams();

        if (filters.city) params.append('city', filters.city);
        if (filters.state) params.append('state', filters.state);
        if (filters.min_sqft) params.append('min_sqft', filters.min_sqft.toString());
        if (filters.max_sqft) params.append('max_sqft', filters.max_sqft.toString());
        if (filters.min_rent) params.append('min_rent', filters.min_rent.toString());
        if (filters.max_rent) params.append('max_rent', filters.max_rent.toString());
        if (filters.lease_type) params.append('lease_type', filters.lease_type);

        params.append('page', filters.page.toString());
        params.append('page_size', filters.page_size.toString());

        const response = await client.get<PaginatedDeals>(`/deals?${params.toString()}`);
        return response.data;
    },

    getMarketSummary: async (state: string): Promise<MarketSummary> => {
        const response = await client.get<MarketSummary>(`/analytics/market-summary?state=${state}`);
        return response.data;
    },
};

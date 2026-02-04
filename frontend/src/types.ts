export type LeaseType = 'NNN' | 'GROSS' | 'MODIFIED' | 'UNKNOWN';

export interface RawDeal {
    tenant: string;
    address: string;
    size: string | number;
    rent: string;
    lease_type: string;
    start_date: string;
    term_months: string | number;
    source: string;
}

export interface Deal {
    tenant: string;
    street: string;
    city: string;
    state: string;
    size_sqft: number;
    rent_psf: number;
    lease_type: LeaseType;
    start_date: string;
}

export interface DealFilters {
    city?: string;
    state?: string;
    min_sqft?: number;
    max_sqft?: number;
    min_rent?: number;
    max_rent?: number;
    lease_type?: LeaseType;
    page: number;
    page_size: number;
}

export interface PaginatedDeals {
    total: number;
    page: number;
    page_size: number;
    items: Deal[];
}

export interface ImportResponse {
    imported: number;
    skipped: number;
    errors: { index: number; reason: string }[];
}

export interface MarketSummary {
    deal_count: number;
    avg_rent_psf: number;
    by_lease_type: Record<string, number>;
}

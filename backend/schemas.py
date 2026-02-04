from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class RawDeal(BaseModel):
    tenant: str
    address: str
    size: str | int
    rent: str
    lease_type: str
    start_date: date
    term_months: str | int
    source: str


class ImportResponse(BaseModel):
    imported: int
    skipped: int
    errors: List[dict]


class DealOut(BaseModel):
    tenant: str
    street: str
    city: str
    state: str
    size_sqft: int
    rent_psf: float
    lease_type: str
    start_date: date

    class Config:
        from_attributes = True

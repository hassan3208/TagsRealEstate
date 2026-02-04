from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from database import Base, engine, get_db
import models, schemas, crud
from normalizers import *

Base.metadata.create_all(bind=engine)

app = FastAPI()

# --------------------------------------------------
# API 1 → IMPORT
# --------------------------------------------------

@app.post("/deals/import", response_model=schemas.ImportResponse)
def import_deals(items: List[schemas.RawDeal], db: Session = Depends(get_db)):

    imported = 0
    skipped = 0
    errors = []

    for idx, d in enumerate(items):
        try:
            size = normalize_size(d.size)
            rent = normalize_rent(d.rent, size)
            lease = normalize_lease(d.lease_type)

            tenant = crud.get_or_create_tenant(db, d.tenant)
            prop = crud.get_or_create_property(db, d.address)

            if crud.is_duplicate(db, tenant.id, prop.id, d.start_date):
                skipped += 1
                continue

            deal = models.Deal(
                tenant_id=tenant.id,
                property_id=prop.id,
                size_sqft=size,
                rent_psf=rent,
                lease_type=lease,
                start_date=d.start_date,
                term_months=int(d.term_months),
                source=d.source
            )

            db.add(deal)
            db.commit()

            imported += 1

        except Exception as e:
            db.rollback()                     # FIX ADDED
            errors.append({"index": idx, "reason": str(e)})

    return {
        "imported": imported,
        "skipped": skipped,
        "errors": errors
    }


# --------------------------------------------------
# API 2 → GET /deals  (UPDATED)
# --------------------------------------------------

@app.get("/deals")
def get_deals(
    city: Optional[str] = None,
    state: Optional[str] = None,

    min_sqft: Optional[int] = None,
    max_sqft: Optional[int] = None,

    min_rent: Optional[float] = None,
    max_rent: Optional[float] = None,

    lease_type: Optional[models.LeaseType] = None,

    page: int = 1,
    page_size: int = 10,

    db: Session = Depends(get_db)
):

    q = db.query(models.Deal)\
          .join(models.Tenant)\
          .join(models.Property)

    # ----- Filters -----

    if city:
        q = q.filter(models.Property.city.ilike(f"%{city}%"))

    if state:
        q = q.filter(models.Property.state.ilike(f"%{state}%"))

    if min_sqft:
        q = q.filter(models.Deal.size_sqft >= min_sqft)

    if max_sqft:
        q = q.filter(models.Deal.size_sqft <= max_sqft)

    if min_rent:
        q = q.filter(models.Deal.rent_psf >= min_rent)

    if max_rent:
        q = q.filter(models.Deal.rent_psf <= max_rent)

    if lease_type:
        q = q.filter(models.Deal.lease_type == lease_type)

    total = q.count()

    # ----- Pagination -----
    q = q.offset((page - 1) * page_size).limit(page_size)

    results = q.all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,

        "items": [
            {
                "tenant": r.tenant.name,
                "street": r.property.street,
                "city": r.property.city,
                "state": r.property.state,
                "size_sqft": r.size_sqft,
                "rent_psf": float(r.rent_psf),
                "lease_type": r.lease_type.value,
                "start_date": r.start_date
            }
            for r in results
        ]
    }


# --------------------------------------------------
# API 3 → MARKET SUMMARY (UNCHANGED – CORRECT)
# --------------------------------------------------

@app.get("/analytics/market-summary")
def summary(state: str, db: Session = Depends(get_db)):

    deals = db.query(models.Deal).join(models.Property).filter(
        models.Property.state == state
    ).all()

    if not deals:
        return {"deal_count": 0}

    avg = sum(float(d.rent_psf) for d in deals) / len(deals)

    by_type = {}
    for d in deals:
        t = d.lease_type.value
        by_type[t] = by_type.get(t, 0) + 1

    return {
        "deal_count": len(deals),
        "avg_rent_psf": round(avg, 2),
        "by_lease_type": by_type
    }



@app.get("/")
def root():
    return {"message": "Welcome to the Tags Solutions"}

from sqlalchemy.orm import Session
from models import Tenant, Property, Deal
from normalizers import *


def get_or_create_tenant(db: Session, name: str):
    cname = canonicalize_name(name)

    tenant = db.query(Tenant).filter_by(
        canonical_name=cname
    ).first()

    if tenant:
        return tenant

    tenant = Tenant(name=name, canonical_name=cname)
    db.add(tenant)
    db.commit()
    db.refresh(tenant)

    return tenant


def get_or_create_property(db: Session, address: str):
    street, city, state, zip_code = parse_address(address)

    prop = db.query(Property).filter_by(
        street=street,
        city=city,
        state=state,
        zip=zip_code
    ).first()

    if prop:
        return prop

    prop = Property(
        street=street,
        city=city,
        state=state,
        zip=zip_code
    )

    db.add(prop)
    db.commit()
    db.refresh(prop)

    return prop


def is_duplicate(db, tenant_id, property_id, start_date):
    return db.query(Deal).filter_by(
        tenant_id=tenant_id,
        property_id=property_id,
        start_date=start_date
    ).first()

from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base


class LeaseType(str, enum.Enum):
    NNN = "NNN"
    GROSS = "GROSS"
    MODIFIED = "MODIFIED"
    UNKNOWN = "UNKNOWN"


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    canonical_name = Column(String, unique=True, nullable=False)

    # CASCADE → if tenant deleted, its deals deleted
    deals = relationship(
        "Deal",
        back_populates="tenant",
        cascade="all, delete-orphan"
    )


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True)

    street = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    zip = Column(String, nullable=False)

    deals = relationship(
        "Deal",
        back_populates="property",
        cascade="all, delete-orphan"
    )


class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True)

    size_sqft = Column(Integer, nullable=False)
    rent_psf = Column(Numeric, nullable=False)

    lease_type = Column(Enum(LeaseType), nullable=False)

    start_date = Column(Date, nullable=False)
    term_months = Column(Integer, nullable=False)

    source = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    tenant_id = Column(
        Integer,
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )

    property_id = Column(
        Integer,
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False
    )

    tenant = relationship("Tenant", back_populates="deals")
    property = relationship("Property", back_populates="deals")

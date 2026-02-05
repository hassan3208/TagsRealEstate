# TAGS RealEstate – Deal Intake & Explorer

TAGS RealEstate is a lightweight full-stack application for commercial real estate lease data ingestion, normalization, and exploration.  
The system accepts messy deal records from multiple sources, converts them into a clean relational model, and provides an interface to browse deals and view market summaries.

---

## Overview

This project demonstrates:

- Real-world data normalization (rent formats, sizes, lease types)  
- Deduplication of tenants and properties  
- Clean API design with FastAPI + PostgreSQL  
- React + TypeScript frontend for exploration  
- Practical tradeoffs over over-engineering

---

## Architecture Summary

### Backend (FastAPI)

- **Entities:** Tenants → Properties → Deals  
- **Normalization Rules**
  - `size` → integer sqft  
  - `rent` → normalized to $/SF  
  - `lease_type` → ENUM (NNN | GROSS | MODIFIED | UNKNOWN)

- **Key APIs**
  - `POST /deals/import` – ingest & normalize raw JSON  
  - `GET /deals` – filtering, pagination, search  
  - `GET /analytics/market-summary` – lightweight statistics

### Frontend (React + TypeScript)

- Import Page  
- Deals Explorer with filters  
- Market Summary dashboard  
- Clear loading & error states

---

## How to Run the Project

### 1) Start Backend First

```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
````

Backend will be available at:

* API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 2) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

* [http://localhost:3000](http://localhost:3000)

---

## Features

### 1. Import Raw Deals

* Paste JSON or upload file
* Shows:

  * Imported count
  * Skipped records
  * Row-level validation errors

### 2. Deals Explorer

* Table view with:

  * Tenant
  * Address
  * Size
  * Rent ($/SF)
  * Lease type
  * Start date

* Filters:

  * City / State
  * Min–Max sqft
  * Min–Max rent
  * Lease type
  * Free-text search

* Pagination & sorting supported

### 3. Market Summary

* Select city/state
* View:

  * Deal count
  * Average rent
  * Breakdown by lease type

---

## Data Normalization

| Field | Raw Examples         | Canonical Output |
| ----- | -------------------- | ---------------- |
| Size  | "10,000", 10000      | 10000            |
| Rent  | "$34/SF", "45000/mo" | 34.0 psf         |
| Lease | "nnn", "triple net"  | NNN              |

**Dedup Strategy:**
Tenant + Property + Start Date

---

## Tradeoffs & Design Decisions

* Average used instead of median for simplicity
* Lightweight dedupe key without fuzzy matching
* No authentication as per assignment scope
* Simple analytics to keep system focused
* Batch commit on import to reduce DB latency

---

## Screenshots

### Import Page

<img width="2875" height="1471" alt="image" src="https://github.com/user-attachments/assets/c469db3e-4e4b-487c-913f-b9fef36fa18f" />

### Deals Explorer

<img width="2879" height="1471" alt="Screenshot 2026-02-04 192521" src="https://github.com/user-attachments/assets/8c5afa05-b190-4838-9f27-2c5c549593b2" />

### Market Summary

<img width="2879" height="1470" alt="Screenshot 2026-02-04 192642" src="https://github.com/user-attachments/assets/4ca7e54d-27ed-4d1a-b563-944b73c9e688" />

---

## Technologies

* **Backend:** FastAPI, SQLAlchemy, PostgreSQL
* **Frontend:** React, TypeScript
* **Database:** Supabase PostgreSQL

---

## Notes

* Data is treated as untrusted and validated during import
* Errors are isolated per row
* System prioritizes correctness over perfect ingestion

---

Built as part of full-stack assessment – **TAGS RealEstate**

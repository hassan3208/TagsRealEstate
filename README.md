# Test RealEstate – Deal Intake & Explorer

Test RealEstate is a lightweight full-stack application for commercial real estate lease data ingestion, normalization, and exploration.  
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
  - `GET /deals/states` – for getting all state in our database
    
- **Environment variable file**
  - Add the .env file in your backend folder and just add a variabele DATABASE_URL. For your assistance i have added the .env file in the backend follder just paste your database URL from Supabase.
 
    
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
  *   make sure the data key names are valid else it will give 422 error
    *  tenant: str
    *  address: str
    *  size: str | int
    *  rent: str
    *  lease_type: str
    *  start_date: date
    *  term_months: str | int
    *  source: str 

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

<img width="2879" height="1466" alt="image" src="https://github.com/user-attachments/assets/f5f12bcd-56db-49ab-bf71-376d8333d1e0" />

### Deals Explorer

<img width="2879" height="1455" alt="image" src="https://github.com/user-attachments/assets/7d152351-4791-42eb-bafc-f5e0483b827e" />

### Market Summary

<img width="2879" height="1444" alt="image" src="https://github.com/user-attachments/assets/484a5ded-934c-4c96-9a32-2ac57903a852" />

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

Built as part of full-stack assessment – **TEST RealEstate**

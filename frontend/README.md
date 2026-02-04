# Deals Frontend

This is the frontend application for the Deals Management System.

## Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: CSS Modules + Global CSS
- **State/API**: Axios + React Hooks
- **Routing**: React Router DOM v6

## Getting Started

### Prerequisites
- Node.js (v16+)
- Backend running at `http://127.0.0.1:8000`

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

The app is configured to proxy API requests to `http://127.0.0.1:8000` to avoid CORS issues.

## Project Structure
- `src/api`: Axios client and API methods.
- `src/components`: Reusable UI components (Table, FilterBar, etc.).
- `src/pages`: Main application screens (Import, Explorer, Analytics).
- `src/types.ts`: TypeScript interfaces mirroring backend schemas.

## Features
- **Import Page**: Upload JSON deals or paste raw JSON.
- **Deals Explorer**: View data with server-side pagination and filtering (City, State, Rent, Size).
- **Market Summary**: Analytics dashboard with stats visualization.

## API Contract
The frontend expects the following endpoints from the backend:
- `POST /deals/import`: Upload array of deals.
- `GET /deals`: Fetch paginated deals with filters.
- `GET /analytics/market-summary`: Get aggregation stats.

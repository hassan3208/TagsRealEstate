import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DealsExplorer } from './pages/DealsExplorer';
import { ImportPage } from './pages/ImportPage';
import { MarketSummary } from './pages/MarketSummary';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/explorer" replace />} />
          <Route path="explorer" element={<DealsExplorer />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="market-summary" element={<MarketSummary />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/explorer" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

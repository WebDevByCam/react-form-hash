import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
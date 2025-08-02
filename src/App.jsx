// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import LULCPage from './pages/LULCPage';
import CarbonPage from './pages/CarbonPage';
import TreePage from './pages/TreePage';
import ReportPage from './pages/ReportPage';
import MyMap from './components/layout/Mymap';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} /> 
        <Route path="lulc-change" element={<LULCPage />} />
        <Route path="carbon-zones" element={<CarbonPage />} />
        <Route path="tree-census" element={<TreePage />} />
        <Route path="reports" element={<ReportPage />} />
        <Route path="map" element={<MyMap />} />
      </Route>
    </Routes>
  );
}

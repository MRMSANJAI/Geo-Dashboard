// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import ProjectDetails from './pages/ProjectDetails';
import TreePage from './pages/TreePage';
import ReportPage from './pages/ReportPage';
import MyMap from './components/layout/Mymap';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} /> 
        <Route  path="/project-detail/:id" element={<ProjectDetails />} />

        <Route path="lulc-change" element={<L />} />
        {/* <Route path="carbon-zones" element={<AOI />} /> */}
        <Route path="tree-census" element={<TreePage />} />
        <Route path="reports" element={<ReportPage />} />
        <Route path="map" element={<MyMap />} />
      </Route>
    </Routes>
  );
}

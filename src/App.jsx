import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import MyMap from './components/layout/Mymap';
import ProjectDetails from './pages/ProjectDetails';
import ProjectAOI from './components/Projects/ProjectAOI';
import ProjectMap from './components/Projects/ProjectMap';
import ProjectReport from './components/Projects/ProjectReport';

export default function App() {
  return (
    <Routes>
      
      {/* Main Dashboard */}
     <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} /> 
        <Route  path="/project-detail/:id" element={<ProjectDetails />} />
        <Route path="map" element={<MyMap />} />


        {/* Nested Project Detail Pages */}
          <Route path="/project-detail/:id/aoi" element={<ProjectAOI />} />
          <Route path="/project-detail/:id/mapping" element={<ProjectMap />} />
          <Route path="/project-detail/:id/report" element={<ProjectReport />} />
     </Route>
 </Routes>
  );
}

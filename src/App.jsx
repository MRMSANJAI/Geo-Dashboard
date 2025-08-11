import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import MyMap from './components/layout/Mymap';
import ProjectAOI from './components/Projects/ProjectAOI';
import ProjectDetailLayout from './components/Projects/ProjectDetailLayout';
import ProjectOverview from './components/Projects/ProjectOverview';
import ProjectReport from './components/Projects/ProjectReport';
import ProjectImagery from './components/Projects/ProjectImagery';

export default function App() {
  return (
    <Routes>
       {/* Main Dashboard */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} /> 
        <Route path="map" element={<MyMap />} />

        {/* All project detail subpages share ProjectSidebar */}
        <Route path="/project-detail/:id" element={<ProjectDetailLayout />}>
          <Route index element={<ProjectOverview />} />  {/* /project-detail/:id */}
          <Route path="aoi/:pid" element={<ProjectAOI />} />
          <Route path="report" element={<ProjectReport />} />
          <Route path="imagery" element={< ProjectImagery/>} />
       </Route>

       
      </Route>
    </Routes>
  );
}


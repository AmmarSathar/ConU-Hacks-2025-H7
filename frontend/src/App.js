import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button } from '@mui/material';
import ResourceDeployment from './components/ResourceDeployment';
import Predictor from './components/Predictor';
import LiveTracker from './components/LiveTracker';
import Navigation from './components/Navigation';
import './styles/main.scss';

function App() {
  const [report, setReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleSidebar}
          style={{ position: 'fixed', top: 10, left: 10, zIndex: 1500 }}
        >
          C++
        </Button>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          {sidebarOpen && <Navigation />}
          <div style={{ flexGrow: 1, marginLeft: sidebarOpen ? 240 : 0 }}> {/* Adjust marginLeft to match Drawer width */}
            <Routes>
              {/* Pass setReport as a prop to ResourceDeployment */}
              <Route 
                exact 
                path="/" 
                element={<ResourceDeployment setReport={setReport} />} 
              />
              <Route path="/prediction" element={<Predictor />} />
              <Route 
                path="/reports" 
                element={<LiveTracker report={report} />} 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
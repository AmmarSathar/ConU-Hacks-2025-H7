import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Button } from '@mui/material';
import ResourceDeployment from './components/ResourceDeployment';
import Predictor from './components/Predictor';
import LiveTracker from './components/LiveTracker';
import Navigation from './components/Navigation';
import './styles/main.scss';
import Historical from './components/Historical';
import FireChatbot from "./components/FireChatbot";

function App() {
  const [report, setReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
        {/* Sidebar Navigation */}
        {sidebarOpen && <Navigation />}

        <div style={{ flexGrow: 1, marginLeft: sidebarOpen ? 240 : 0 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleSidebar}
            style={{ position: 'fixed', top: 10, left: 10, zIndex: 1000 }}
          >
            Toggle sidebar
          </Button>

          <Routes>
            <Route exact path="/" element={<ResourceDeployment setReport={setReport} />} />
            <Route path="/prediction" element={<Predictor />} />
            <Route exact path="/historical" element={<Historical setReport={setReport} />} />
            <Route path="/reports" element={<LiveTracker report={report} />} />
          </Routes>
        </div>

        {/* FireChatbot is placed outside for persistent accessibility */}
        <FireChatbot />
      </div>
    </Router>
  );
}

export default App;

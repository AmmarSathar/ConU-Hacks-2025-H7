// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { styled, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ResourceDeployment from './components/ResourceDeployment';
import Predictor from './components/Predictor';
import LiveTracker from './components/LiveTracker';
import Navigation from './components/Navigation';
import Historical from './components/Historical';
import FireChatbot from './components/FireChatbot';
import './styles/main.scss';

// Styled toggle button
const ToggleButton = styled(Button)({
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 700,
  textTransform: 'none',
  color: '#333',
  fontSize: '1.3rem',
  backgroundColor: '#FFA500',
  '&:hover': {
    backgroundColor: '#e69500',
  },
  position: 'fixed',
  top: 10,
  left: 10,
  zIndex: 1500,
});

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

        {/* Main Content */}
        <div style={{ flexGrow: 1, marginLeft: sidebarOpen ? 240 : 0 }}>
          {/* Sidebar Toggle Button */}
          <ToggleButton onClick={toggleSidebar}>
            {sidebarOpen ? <CloseIcon style={{ marginRight: 8 }} /> : <MenuIcon style={{ marginRight: 8 }} />}
            Toggle Sidebar
          </ToggleButton>

          {/* Routes */}
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

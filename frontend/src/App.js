// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { styled, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon
import ResourceDeployment from './components/ResourceDeployment';
import Predictor from './components/Predictor';
import LiveTracker from './components/LiveTracker';
import Navigation from './components/Navigation';
import './styles/main.scss';

// Create a toggle button with the same theme as your navigation buttons
const ToggleButton = styled(Button)(({ theme }) => ({
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 700,
  textTransform: 'none',
  color: '#333',
  fontSize: '1.3rem',
  backgroundColor: '#FFA500', // Use the same background as your nav (Drawer)
  '&:hover': {
    backgroundColor: '#e69500', // Optional: a slightly darker shade on hover
  },
}));

function App() {
  const [report, setReport] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Use the styled toggle button with an icon */}
        <ToggleButton
          onClick={toggleSidebar}
          style={{ position: 'fixed', top: 10, left: 10, zIndex: 1500 }}
        >
          {sidebarOpen ? <CloseIcon style={{ marginRight: 8 }} /> : <MenuIcon style={{ marginRight: 8 }} />} 
        </ToggleButton>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          {sidebarOpen && <Navigation />}
          <div style={{ flexGrow: 1, marginLeft: sidebarOpen ? 240 : 0 }}>
            <Routes>
              <Route exact path="/" element={<ResourceDeployment setReport={setReport} />} />
              <Route path="/prediction" element={<Predictor />} />
              <Route path="/reports" element={<LiveTracker report={report} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;


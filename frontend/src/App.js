import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceDeployment from './components/Deployment';
import Predictor from './components/Predictor';
import LiveTracker from './components/LiveTracker';
import Navigation from './components/Navigation';
import './styles/main.scss';

function App() {
  const [report, setReport] = useState(null); // Define setReport in the parent component

  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
        <Navigation />
        <div style={{ flexGrow: 1, marginLeft: 240 }}> {/* Adjust marginLeft to match Drawer width */}
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
    </Router>
  );
}

export default App;
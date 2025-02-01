import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceDeployment from './components/ResourceDeployment';
import PredictionDashboard from './components/PredictionDashboard';
import Reports from './components/Reports';
import Header from './components/Header';
import Navigation from './components/Navigation';
import './styles/main.scss';

function App() {
  const [report, setReport] = useState(null); // Define setReport in the parent component

  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
        <Navigation />
        <div style={{ flexGrow: 1, marginLeft: 240 }}> {/* Adjust marginLeft to match Drawer width */}
          <Header />
          <h1>Wildfire Response & Prediction</h1>
          <Routes>
            {/* Pass setReport as a prop to ResourceDeployment */}
            <Route 
              exact 
              path="/" 
              element={<ResourceDeployment setReport={setReport} />} 
            />
            <Route path="/prediction" element={<PredictionDashboard />} />
            <Route 
              path="/reports" 
              element={<Reports report={report} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceDeployment from './components/ResourceDeployment';
import PredictionDashboard from './components/PredictionDashboard';
import Reports from './components/Reports';
import './styles/main.scss';

function App() {
  const [report, setReport] = useState(null); // Define setReport in the parent component

  return (
    <Router>
      <div className="App">
        <h1>Wildfire Response & Prediction</h1>
        <Routes>
          {/* Pass setReport as a prop to ResourceDeployment */}
          <Route 
            exact 
            path="/" 
            element={<ResourceDeployment setReport={setReport} />} 
          />
          <Route path="/prediction" element={<PredictionDashboard />} />
          {/* Pass the report prop to the Reports page */}
          <Route 
            path="/reports" 
            element={<Reports report={report} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

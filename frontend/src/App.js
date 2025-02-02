import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceDeployment from './components/ResourceDeployment';
import Predictor from './components/Predictor';
import LiveTracker from './components/LiveTracker';
import Navigation from './components/Navigation';
import './styles/main.scss';
import Historical from './components/Historical';
import FireChatbot from "./components/FireChatbot";


function App() {
  const [report, setReport] = useState(null); // Define setReport in the parent component

  return (
    
    <Router>
      <div className="App" style={{ display: 'flex' }}>
      <div>

      <FireChatbot />
    </div>
        <Navigation />
        
        <div style={{ flexGrow: 1}}> {/* Adjust marginLeft to match Drawer width */}
          <Routes>
            {/* Pass setReport as a prop to ResourceDeployment */}
            <Route 
              exact 
              path="/" 
              element={<ResourceDeployment setReport={setReport} />} 
            />
            <Route path="/prediction" element={<Predictor />} />
            <Route 
              exact 
              path="/historical" 
              element={<Historical setReport={setReport} />} 
            />
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
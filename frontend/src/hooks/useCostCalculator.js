import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResourceDeployment from './components/ResourceDeployment';
import PredictionDashboard from './components/PredictionDashboard';
import Reports from './components/Reports';
import './styles/main.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Wildfire Response & Prediction</h1>
        <Routes>
          <Route exact path="/" component={ResourceDeployment} />
          <Route path="/prediction" component={PredictionDashboard} />
          <Route path="/reports" component={Reports} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

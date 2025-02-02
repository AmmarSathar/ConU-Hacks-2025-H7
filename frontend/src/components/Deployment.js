import React, { useState } from "react";
import Papa from "papaparse";
import { Button } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/main.scss';

function ResourceDeployment({ setReport }) {
  const [wildfireData, setWildfireData] = useState([]);  // Data state

  // Handle CSV file upload and parse the data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed Data:", result.data);  // Log parsed data
          setWildfireData(result.data);  // Set data to state
        },
        header: true,
      });
    }
  };

  // Handle optimization logic
  const handleOptimizeDeployment = () => {
    const deployedFires = wildfireData.filter((fire) => fire.severity === "high");  // Prioritize high severity
    const missedFires = wildfireData.filter((fire) => fire.severity !== "high");

    const operationalCost = deployedFires.length * 5000;
    const missedCost = missedFires.length * 200000;

    setReport({
      firesAddressed: deployedFires.length,
      firesDelayed: missedFires.length,
      operationalCost,
      missedCost,
    });
  };

  // Define the getSeverityAttributes function
  const getSeverityAttributes = (severity) => {
    switch (severity) {
      case 'low':
        return { color: 'green', radius: 5 };
      case 'medium':
        return { color: 'orange', radius: 10 };
      case 'high':
        return { color: 'red', radius: 15 };
      default:
        return { color: 'gray', radius: 5 };
    }
  };

  return (
    <div className="resource-deployment">
      <h2>Resource Deployment</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <Button onClick={handleOptimizeDeployment}>Optimize Deployment</Button>
      <div className="deployment-container">
        <div className="controls">
          {/* Add your controls here */}
        </div>
        <div className="sample-container">
          <div className="inner-box">Box 1</div>
          <div className="inner-box">Box 2</div>
          <div className="inner-box">Box 3</div>
        </div>
        <div className="map-container">
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "30px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {wildfireData.map((fire, index) => {
              const lat = parseFloat(fire.lat);
              const lng = parseFloat(fire.lng);
              if (!isNaN(lat) && !isNaN(lng)) {
                const { color, radius } = getSeverityAttributes(fire.severity);
                return (
                  <CircleMarker
                    key={index}
                    center={[lat, lng]}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }}
                    radius={radius}
                  >
                    <Popup>
                      <strong>Timestamp:</strong> {fire.timestamp}<br />
                      <strong>Severity:</strong> {fire.severity}
                    </Popup>
                  </CircleMarker>
                );
              }
              return null;  // Return null if location is invalid or missing
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default ResourceDeployment;
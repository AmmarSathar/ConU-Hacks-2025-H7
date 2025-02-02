import React, { useState } from "react";
import Papa from "papaparse";
import { Button } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/main.scss';

function ResourceDeployment({ setReport }) {
  const [wildfireData, setWildfireData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed Data:", result.data);
          setWildfireData(result.data);
        },
        header: true,
      });
    }
  };

  const handleOptimizeDeployment = () => {
    const deployedFires = wildfireData.filter((fire) => fire.severity === "high");
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

  return (
    <div className="resource-deployment">
      <h2>Resource Deployment</h2>
      <div className="deployment-container">
        <div className="controls">
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button onClick={handleOptimizeDeployment}>Optimize Deployment</Button>
        </div>
        <div className="map-container">
          <MapContainer center={[25, 0]} zoom={3} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {wildfireData.map((fire, index) => (
              <CircleMarker key={index} center={[fire.lat, fire.lng]} radius={10}>
                <Popup>
                  <span>{fire.name}</span>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default ResourceDeployment;

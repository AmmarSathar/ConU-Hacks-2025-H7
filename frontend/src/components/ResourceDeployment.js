import React, { useState } from "react";
import Papa from "papaparse";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

  // Function to map severity to color and radius for the circle
  const getSeverityAttributes = (severity) => {
    switch (severity) {
      case "high":
        return { color: "red", radius: 12 };
      case "medium":
        return { color: "orange", radius: 10 };
      case "low":
        return { color: "green", radius: 8 };
      default:
        return { color: "gray", radius: 8 };
    }
  };

  return (
    <div>
      <h2>Resource Deployment Optimization</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <Button variant="contained" onClick={handleOptimizeDeployment} style={{ marginTop: "20px" }}>
        Optimize Deployment
      </Button>

      {/* Map to display markers */}
      <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: "400px", width: "100%", marginTop: "20px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {wildfireData.length > 0 &&
          wildfireData.map((fire, index) => {
            // Ensure the location exists and is properly formatted
            if (fire.location) {
              const location = fire.location.split(",");  // Split latitude and longitude
              const lat = parseFloat(location[0]);
              const lng = parseFloat(location[1]);

              // Only render CircleMarker if the location is valid (lat and lng are numbers)
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
            }
            return null;  // Return null if location is invalid or missing
          })
        }
      </MapContainer>
    </div>
  );
}

export default ResourceDeployment;

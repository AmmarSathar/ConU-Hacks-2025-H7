import React, { useState } from "react";
import Papa from "papaparse";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom"; // Import Link

function ResourceDeployment({ setReport }) {
  const [wildfireData, setWildfireData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [resources, setResources] = useState({
    smokeJumpers: { available: 5, cost: 5000, time: 30 },
    fireEngines: { available: 10, cost: 2000, time: 60 },
    helicopters: { available: 3, cost: 8000, time: 45 },
    tankerPlanes: { available: 2, cost: 15000, time: 120 },
    groundCrews: { available: 8, cost: 3000, time: 90 },
  });
  const [severityFilter, setSeverityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  // Handle file upload and parse CSV data
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setWildfireData(result.data);
          setFilteredData(result.data); // Initialize filtered data
        },
        header: true,
      });
    }
  };

  // Optimize resource deployment based on fire data and resource availability
  const handleOptimizeDeployment = () => {
    let addressedFires = [];
    let missedFires = [];
    let operationalCost = 0;
    let missedCost = 0;

    const fireData = filteredData
      .map((fire) => ({
        ...fire,
        severityLevel: getSeverityCost(fire.severity),
      }))
      .sort((a, b) => b.severityLevel - a.severityLevel);

    fireData.forEach((fire) => {
      const { severity } = fire;
      const allocatedResource = allocateResources(severity);

      if (allocatedResource) {
        operationalCost += allocatedResource.cost;
        addressedFires.push({ ...fire, resourceUsed: allocatedResource });
      } else {
        missedFires.push(fire);
        missedCost += getDamageCost(severity);
      }
    });

    setReport({
      firesAddressed: addressedFires.length,
      firesDelayed: missedFires.length,
      operationalCost,
      missedCost,
    });

    setWildfireData(addressedFires.concat(missedFires));
  };

  // Filter fires based on severity and date range
  const handleSeverityFilterChange = (event) => {
    const selectedSeverity = event.target.value;
    setSeverityFilter(selectedSeverity);
    filterFires(selectedSeverity, dateFilter);
  };

  // Update date filter and reapply filtering
  const handleDateFilterChange = (startOrEnd, value) => {
    const updatedDateFilter = { ...dateFilter, [startOrEnd]: value };
    setDateFilter(updatedDateFilter);
    filterFires(severityFilter, updatedDateFilter);
  };

  // Function to filter fires based on severity and date range
  const filterFires = (severity, dateRange) => {
    const filtered = wildfireData.filter((fire) => {
      const fireDate = new Date(fire.timestamp);
      const isSeverityMatch = severity ? fire.severity === severity : true;
      const isDateMatch =
        (dateRange.startDate ? fireDate >= new Date(dateRange.startDate) : true) &&
        (dateRange.endDate ? fireDate <= new Date(dateRange.endDate) : true);
      return isSeverityMatch && isDateMatch;
    });
    setFilteredData(filtered);
  };

  // Allocate resources based on fire severity
  const allocateResources = (severity) => {
    let resource = null;
    if (severity === "high" && resources.smokeJumpers.available > 0) {
      resource = { type: "Smoke Jumpers", ...resources.smokeJumpers };
      resources.smokeJumpers.available--;
    } else if (severity === "high" && resources.helicopters.available > 0) {
      resource = { type: "Helicopters", ...resources.helicopters };
      resources.helicopters.available--;
    } else if (severity === "medium" && resources.fireEngines.available > 0) {
      resource = { type: "Fire Engines", ...resources.fireEngines };
      resources.fireEngines.available--;
    } else if (severity === "low" && resources.groundCrews.available > 0) {
      resource = { type: "Ground Crews", ...resources.groundCrews };
      resources.groundCrews.available--;
    }
    return resource;
  };

  // Calculate damage cost based on fire severity
  const getDamageCost = (severity) => {
    switch (severity) {
      case "high":
        return 200000;
      case "medium":
        return 100000;
      case "low":
        return 50000;
      default:
        return 0;
    }
  };

  // Return severity-based cost for prioritizing fires
  const getSeverityCost = (severity) => {
    switch (severity) {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  // Return severity attributes (color and radius) for map display
  const getSeverityAttributes = (severity) => {
    switch (severity) {
      case "high":
        return { color: "#8B0000", radius: 12 }; // Dark Red
      case "medium":
        return { color: "#FF8C00", radius: 10 }; // Dark Orange
      case "low":
        return { color: "#006400", radius: 8 }; // Dark Green
      default:
        return { color: "gray", radius: 8 };
    }
  };

  return (
    <div>
      <h2>Resource Deployment Optimization</h2>

      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {/* Severity Filter */}
      <div style={{ marginTop: "20px" }}>
        <FormControl fullWidth>
          <InputLabel>Severity Filter</InputLabel>
          <Select value={severityFilter} onChange={handleSeverityFilterChange} label="Severity Filter">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Date Filter */}
      <div style={{ marginTop: "20px" }}>
        <TextField
          label="Start Date"
          type="date"
          value={dateFilter.startDate}
          onChange={(e) => handleDateFilterChange("startDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={dateFilter.endDate}
          onChange={(e) => handleDateFilterChange("endDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Optimize Deployment Button */}
      <Button variant="contained" onClick={handleOptimizeDeployment} style={{ marginTop: "20px" }}>
        Optimize Deployment
      </Button>

      {/* Navigate to Reports Page Button */}
      <Link to="/reports">
        <Button variant="outlined" style={{ marginTop: "20px", marginLeft: "10px" }}>
          View Reports
        </Button>
      </Link>

      {/* Map Display */}
      <MapContainer center={[46.8139, -71.2082]} zoom={8} style={{ height: "400px", width: "100%", marginTop: "20px" }}>

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredData.length > 0 &&
          filteredData.map((fire, index) => {
            if (fire.location) {
              const location = fire.location.split(",");
              const lat = parseFloat(location[0]);
              const lng = parseFloat(location[1]);

              if (!isNaN(lat) && !isNaN(lng)) {
                const { color, radius } = getSeverityAttributes(fire.severity);
                const missedCost = getDamageCost(fire.severity);
                const resource = fire.resourceUsed;

                return (
                  <CircleMarker key={index} center={[lat, lng]} pathOptions={{ color, fillColor: color, fillOpacity: 0.6 }} radius={radius}>
                    <Popup>
                      <h3>🔥 Fire Report</h3>
                      <strong>Timestamp:</strong> {fire.timestamp}<br />
                      <strong>Severity:</strong> {fire.severity}<br />
                      {resource ? (
                        <>
                          <h4>🛠 Resources Used:</h4>
                          <table border="1">
                            <thead>
                              <tr>
                                <th>Resource</th>
                                <th>Cost</th>
                                <th>Deployment Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{resource.type}</td>
                                <td>${resource.cost.toLocaleString()}</td>
                                <td>{resource.time} min</td>
                              </tr>
                            </tbody>
                          </table>
                          <p><strong>💰 Total Cost:</strong> ${resource.cost.toLocaleString()}</p>
                        </>
                      ) : (
                        <>
                          <h4>⚠️ Fire Missed</h4>
                          <p><strong>🔥 Damage Cost:</strong> ${missedCost.toLocaleString()}</p>
                        </>
                      )}
                    </Popup>
                  </CircleMarker>
                );
              }
            }
            return null;
          })}
      </MapContainer>
    </div>
  );
}

export default ResourceDeployment;

import React, { useState } from "react";
import Papa from "papaparse";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom"; 

function ResourceDeployment({ setReport }) {
  const [wildfireData, setWildfireData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          setWildfireData(result.data);
          setFilteredData(result.data);
        },
        header: true,
      });
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* Full-page Map */}
      <MapContainer
        center={[45.5017, -73.5673]}
        zoom={6}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0, 
        }}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
        />
        {filteredData.map((fire, index) => {
          if (fire.location) {
            const location = fire.location.split(",");
            const lat = parseFloat(location[0]);
            const lng = parseFloat(location[1]);

            if (!isNaN(lat) && !isNaN(lng)) {
              return (
                <CircleMarker
                  key={index}
                  center={[lat, lng]}
                  pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.6 }}
                  radius={10}
                >
                  <Popup>
                    <strong>🔥 Fire Report</strong><br />
                    Timestamp: {fire.timestamp}<br />
                    Severity: {fire.severity}
                  </Popup>
                </CircleMarker>
              );
            }
          }
          return null;
        })}
      </MapContainer>

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "8px",
          zIndex: 10,
        }}
      >
        <h2>Resource Deployment Optimization</h2>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {/* Severity Filter */}
        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel>Severity Filter</InputLabel>
          <Select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        {/* Date Filters */}
        <TextField
          label="Start Date"
          type="date"
          value={dateFilter.startDate}
          onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          style={{ marginTop: "10px" }}
        />
        <TextField
          label="End Date"
          type="date"
          value={dateFilter.endDate}
          onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        />

        {/* Navigation */}
        <Link to="/reports">
          <Button variant="contained" style={{ marginTop: "10px" }}>View Reports</Button>
        </Link>
      </div>
    </div>
  );
}

export default ResourceDeployment;

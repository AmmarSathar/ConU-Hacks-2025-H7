import React, { useState } from "react";
import Papa from "papaparse";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom"; 

function Historical({ setReport }) {
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
            top: "40px",
            left: "70%",
            transform: "translateX(-20%)",
            background: "rgba(255, 255, 255, 0.6)",
            color: "orange",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            zIndex: 10,
        }}
        >
        <h2>Historical Analysis</h2>

        <input type="file" accept=".csv" onChange={handleFileUpload} style={{ color: "white" }} />

        {/* Severity Filter */}
        <FormControl fullWidth style={{ marginTop: "10px", background: "#444", color: "red", borderRadius: "4px" }}>
            <InputLabel style={{ color: "black" }}>Severity Filter</InputLabel>
            <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ color: "black", background: "#555" }}
            >
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
            InputLabelProps={{ shrink: true, style: { color: "black" } }}
            style={{ marginTop: "10px", background: "#444", color: "white", borderRadius: "4px" }}
        />
        <TextField
            label="End Date"
            type="date"
            value={dateFilter.endDate}
            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
            InputLabelProps={{ shrink: true, style: { color: "black" } }}
            style={{ marginTop: "10px", marginLeft: "10px", background: "#444", color: "white", borderRadius: "4px" }}
        />

        {/* Navigation */}
        <Link to="/reports">
            <Button
            variant="contained"
            style={{
                marginTop: "10px",
                backgroundColor: "#FFA500",
                color: "#333333",
                fontWeight: "bold",
                padding: "10px 20px",
            }}
            >
            View Reports
            </Button>
        </Link>
        </div>

    </div>
  );
}

export default Historical;

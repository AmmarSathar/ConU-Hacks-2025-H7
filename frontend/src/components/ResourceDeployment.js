import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faParachuteBox, faTruck, faHelicopter, faPlane, faCampground } from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";

function ResourceDeployment({ setReport }) {
  const [wildfireData, setWildfireData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [severityCounts, setSeverityCounts] = useState({ low: 0, medium: 0, high: 0 });

  // **TRACK HOVER STATE FOR EACH RESOURCE**
  const [hoveredResource, setHoveredResource] = useState(null);

  useEffect(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    filteredData.forEach((fire) => {
      if (fire.severity === "low") counts.low += 1;
      if (fire.severity === "medium") counts.medium += 1;
      if (fire.severity === "high") counts.high += 1;
    });
    setSeverityCounts(counts);
  }, [filteredData]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      
      {/* Heading for "Deployed Resources" */}
      <div style={{ position: "absolute", top: "10px", left: "15%", color: "#FFA500", fontSize: "14px", fontWeight: "light", zIndex: 20 }}>
        <h1>Deployed Resources</h1>
        <p style={{ fontSize: "10px", marginTop: "0px" }}>
          <span style={{ color: "#008000", fontWeight: "bold" }}>Low: {severityCounts.low} </span>{"  "}
          <span style={{ color: "#FFD700", fontWeight: "bold" }}>Medium: {severityCounts.medium} </span> {"  "}
          <span style={{ color: "#FF0000", fontWeight: "bold" }}>High: {severityCounts.high} </span>
        </p>
      </div>

      {/* Full-page Map */}
      <MapContainer center={[45.5017, -73.5673]} zoom={6} style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
      </MapContainer>

      {/* UI Overlay */}
      <div style={{
        position: "absolute",
        top: "40px",
        left: "70%",
        background: "rgba(255, 255, 255, 0.6)",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        zIndex: 10,
        width: "350px"
      }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>Available Resources</h2>

        {/* 🚀 Firefighting Units */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>

          {/* Smoke Jumpers */}
          <div 
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={() => setHoveredResource("smokeJumpers")}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <FontAwesomeIcon icon={faParachuteBox} size="2x" style={{ color: "#FFA500" }} />
            <strong style={{ fontSize: "14px", marginTop: "5px" }}>Smoke Jumpers</strong>
            {hoveredResource === "smokeJumpers" && (
              <p style={{ fontSize: "12px", color: "#000", marginTop: "5px", transition: "opacity 0.3s ease-in-out" }}>
                30 min, $5,000, 5 units
              </p>
            )}
          </div>

          {/* Fire Engines */}
          <div 
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={() => setHoveredResource("fireEngines")}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <FontAwesomeIcon icon={faTruck} size="2x" style={{ color: "#FFA500" }} />
            <strong style={{ fontSize: "14px", marginTop: "5px" }}>Fire Engines</strong>
            {hoveredResource === "fireEngines" && (
              <p style={{ fontSize: "12px", color: "#000", marginTop: "5px", transition: "opacity 0.3s ease-in-out" }}>
                1 hour, $2,000, 10 units
              </p>
            )}
          </div>

          {/* Helicopters */}
          <div 
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={() => setHoveredResource("helicopters")}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <FontAwesomeIcon icon={faHelicopter} size="2x" style={{ color: "#FFA500" }} />
            <strong style={{ fontSize: "14px", marginTop: "5px" }}>Helicopters</strong>
            {hoveredResource === "helicopters" && (
              <p style={{ fontSize: "12px", color: "#000", marginTop: "5px", transition: "opacity 0.3s ease-in-out" }}>
                45 min, $8,000, 3 units
              </p>
            )}
          </div>

          {/* Tanker Planes */}
          <div 
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={() => setHoveredResource("tankerPlanes")}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <FontAwesomeIcon icon={faPlane} size="2x" style={{ color: "#FFA500" }} />
            <strong style={{ fontSize: "14px", marginTop: "5px" }}>Tanker Planes</strong>
            {hoveredResource === "tankerPlanes" && (
              <p style={{ fontSize: "12px", color: "#000", marginTop: "5px", transition: "opacity 0.3s ease-in-out" }}>
                2 hours, $15,000, 2 units
              </p>
            )}
          </div>

          {/* Ground Crews */}
          <div 
            style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", textAlign: "center" }}
            onMouseEnter={() => setHoveredResource("groundCrews")}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <FontAwesomeIcon icon={faCampground} size="2x" style={{ color: "#FFA500" }} />
            <strong style={{ fontSize: "14px", marginTop: "5px" }}>Ground Crews</strong>
            {hoveredResource === "groundCrews" && (
              <p style={{ fontSize: "12px", color: "#000", marginTop: "5px", transition: "opacity 0.5s ease-in-out" }}>
                1.5 hours, $3,000, 8 units
              </p>
            )}

          {/* 🚀 Deploy Button */}
          <Button variant="contained" style={{ marginTop: "20px", backgroundColor: "#FFA500", color: "#333", width: "50%", fontWeight: "bold" }}>
          Deploy
          </Button>
          </div>

        </div>
      </div> 
    </div>
  );
}

export default ResourceDeployment;

import React, { useState } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@mui/material";

function Predictor() {
  const [predictionData, setPredictionData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setPredictionData(result.data);
      },
    });
  };

  return (
    <div>
      <h2>Predictor</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="risk" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Predictor;
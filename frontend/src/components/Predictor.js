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
      
    </div>
  );
}

export default Predictor;
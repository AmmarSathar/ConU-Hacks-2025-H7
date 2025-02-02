// Reports.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';

function Reports({ report }) {
  const [optimizationResult, setOptimizationResult] = useState(null);

  // Existing function for local CSV
  const downloadReport = () => {
    if (!report) {
      alert('No report available to download!');
      return;
    }

    try {
      const csvData = [
        ["Metric", "Value"],
        ["Fires Addressed", report.firesAddressed],
        ["Fires Delayed", report.firesDelayed],
        ["Operational Cost", `$${report.operationalCost.toLocaleString()}`],
        ["Missed Cost", `$${report.missedCost.toLocaleString()}`],
        ["Date Generated", new Date().toLocaleDateString()]
      ];

      const csvString = csvData.map(row => row.join(",")).join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `wildfire_report_${Date.now()}.csv`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  // New function for calling your /optimize endpoint
  const handleOptimize = async () => {
    try {
      if (!report) {
        alert('No report data available to optimize!');
        return;
      }

      // Build CSV text from the existing 'report' object
      const csvRows = [];
      csvRows.push(["Metric", "Value"]);
      csvRows.push(["Fires Addressed", report?.firesAddressed || 0]);
      csvRows.push(["Fires Delayed", report?.firesDelayed || 0]);
      csvRows.push(["Operational Cost", report?.operationalCost || 0]);
      csvRows.push(["Missed Cost", report?.missedCost || 0]);

      const csvString = csvRows.map(row => row.join(",")).join("\n");

      const formData = new FormData();
      const csvBlob = new Blob([csvString], { type: 'text/csv' });
      // Key must match 'csv_file' in your router.post('/optimize')
      formData.append('csv_file', csvBlob, 'report.csv');

      const response = await axios.post('/api/predictions/optimize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setOptimizationResult(response.data);

    } catch (error) {
      console.error('Error optimizing resources:', error);
      alert('Optimization failed. Check console for details.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#FFA500', borderBottom: '2px solid #FFA500' }}>
        Wildfire Analysis Report
      </h2>
      
      {report ? (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div>
              <h3 style={{ color: '#333' }}>Fires Managed</h3>
              <p>Addressed: {report.firesAddressed}</p>
              <p>Delayed: {report.firesDelayed}</p>
            </div>
            <div>
              <h3 style={{ color: '#333' }}>Cost Analysis</h3>
              <p>Operational: ${report.operationalCost.toLocaleString()}</p>
              <p>Missed: ${report.missedCost.toLocaleString()}</p>
            </div>
          </div>

          {/* Existing Download button */}
          <Button 
            variant="contained" 
            onClick={downloadReport}
            style={{ 
              marginTop: "25px",
              backgroundColor: "#FFA500",
              color: "#333",
              fontWeight: "bold",
              padding: "12px 30px",
              fontSize: "1.1rem"
            }}
          >
            Download Full Report (CSV)
          </Button>

          {/* New Optimize button */}
          <Button
            variant="contained"
            onClick={handleOptimize}
            style={{
              marginTop: "25px",
              marginLeft: "10px",
              backgroundColor: "#FFA500",
              color: "#333",
              fontWeight: "bold",
              padding: "12px 30px",
              fontSize: "1.1rem"
            }}
          >
            Optimize Resources
          </Button>

          {/* Show optimization result JSON */}
          {optimizationResult && (
            <div style={{ marginTop: '20px' }}>
              <h3>Optimization Result</h3>
              <pre>{JSON.stringify(optimizationResult, null, 2)}</pre>
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #ffeeba'
        }}>
          <p style={{ color: '#856404', margin: 0 }}>
            No report data available. Please generate a report first.
          </p>
        </div>
      )}
    </div>
  );
}

export default Reports;

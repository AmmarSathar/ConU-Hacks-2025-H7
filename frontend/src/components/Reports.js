// Reports.js (updated)
import React from 'react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';

function Reports({ report }) {
  // Enhanced download function with error handling
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
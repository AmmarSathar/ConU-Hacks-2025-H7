import React from 'react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';

function Reports({ report }) {
  // Function to download the report as a CSV
  const downloadReport = () => {
    if (!report) return;

    const csvData = [
      ["Fires Addressed", "Fires Delayed", "Operational Cost", "Missed Cost"],
      [
        report.firesAddressed,
        report.firesDelayed,
        report.operationalCost,
        report.missedCost,
      ],
    ];

    // Convert the data into CSV format
    const csvString = csvData.map(row => row.join(",")).join("\n");

    // Create a Blob object from the CSV data and trigger the download
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, "wildfire_report.csv");
  };

  return (
    <div>
      <h2>Report Summary</h2>
      {report ? (
        <div>
          <p><strong>Fires Addressed:</strong> {report.firesAddressed}</p>
          <p><strong>Fires Delayed:</strong> {report.firesDelayed}</p>
          <p><strong>Operational Cost:</strong> ${report.operationalCost.toLocaleString()}</p>
          <p><strong>Missed Cost:</strong> ${report.missedCost.toLocaleString()}</p>

          {/* Button to trigger report download */}
          <Button variant="contained" onClick={downloadReport} style={{ marginTop: "20px" }}>
            Download Report
          </Button>
        </div>
      ) : (
        <p>No report available.</p>
      )}
    </div>
  );
}

export default Reports;

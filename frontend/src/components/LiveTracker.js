import React from "react";

function LiveTracker({ report }) {
  return (
    <div>
      <h2>Fire Deployment Report</h2>
      {report ? (
        <div>
          <p>Number of Fires Addressed: {report.firesAddressed}</p>
          <p>Number of Fires Delayed: {report.firesDelayed}</p>
          <p>Total Operational Cost: ${report.operationalCost}</p>
          <p>Estimated Damage Cost from Missed Responses: ${report.missedCost}</p>
        </div>
      ) : (
        <p>No report generated yet.</p>
      )}
    </div>
  );
}

export default LiveTracker;

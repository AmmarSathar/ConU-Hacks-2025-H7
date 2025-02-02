export const processFireData = (data) => {
    return data.map(item => ({
      timestamp: item.timestamp,
      location: item.location,
      severity: item.severity,
    }));
  };
  
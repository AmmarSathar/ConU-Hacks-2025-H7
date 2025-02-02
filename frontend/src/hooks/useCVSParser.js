import { useState } from 'react';
import Papa from 'papaparse';

export function useCSVParser() {
  const [parsedData, setParsedData] = useState([]);

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        setParsedData(result.data);
      },
      header: true, // Assuming the CSV has headers
    });
  };

  return { parsedData, parseCSV };
}

import csv
from datetime import datetime

# Define input and output filenames
input_filename = "mongo-init/historical_wildfiredata.csv"
output_filename = "mongo-init/wildfiredata.csv"

# Open the input CSV and create the output CSV
with open(input_filename, "r", newline="") as infile, open(output_filename, "w", newline="") as outfile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames  # use the same header row
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()

    # Process each row
    for row in reader:
        original_ts = row["timestamp"]
        # Convert the timestamp from "YYYY-MM-DD HH:MM:SS" to ISO format "YYYY-MM-DDTHH:MM:SS"
        dt = datetime.strptime(original_ts, "%Y-%m-%d %H:%M:%S")
        row["timestamp"] = dt.isoformat()  # e.g. 2025-01-01T00:00:00
        writer.writerow(row)

print(f"Converted timestamps have been saved to {output_filename}")

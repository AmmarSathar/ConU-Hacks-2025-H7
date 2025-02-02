#!/usr/bin/env python3
import csv

def append_current_to_historical(current_path, historical_path):
    # Read current wildfire data and process each row
    with open(current_path, newline='') as current_file:
        reader = csv.DictReader(current_file)
        processed_rows = []
        for row in reader:
            # The 'location' field is in the format "latitude,longitude"
            # Remove any extraneous quotes and whitespace, then split into two parts.
            location = row['location'].strip().strip('"')
            try:
                latitude, longitude = [x.strip() for x in location.split(',')]
            except ValueError:
                print(f"Error parsing location field: {row['location']}")
                continue

            # Add the new columns to the row
            row['latitude'] = latitude
            row['longitude'] = longitude
            processed_rows.append(row)

    # Append the processed rows to the historical data file.
    # The historical CSV already contains a header: 
    # timestamp,fire_start_time,location,severity,latitude,longitude
    fieldnames = ['timestamp', 'fire_start_time', 'location', 'severity', 'latitude', 'longitude']
    with open(historical_path, 'a', newline='') as hist_file:
        writer = csv.DictWriter(hist_file, fieldnames=fieldnames)
        for row in processed_rows:
            writer.writerow(row)

if __name__ == '__main__':
    current_file = 'Data/current_wildfiredata.csv'
    historical_file = 'Data/historical_wildfiredata.csv'
    append_current_to_historical(current_file, historical_file)
    print("Current wildfire data appended successfully to the historical dataset.")

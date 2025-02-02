#!/bin/bash
set -e

# Wait for MongoDB to become healthy (native check)
until mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
done

echo "Importing data..."
mongoimport --db wildfire --collection environmentdatas \
  --type csv --headerline \
  --file /docker-entrypoint-initdb.d/future_environmental_data.csv

mongoimport --db wildfire --collection historical_wildfiredata \
  --type csv --headerline \
  --file /docker-entrypoint-initdb.d/historical_wildfiredata.csv

echo "Seeding completed."
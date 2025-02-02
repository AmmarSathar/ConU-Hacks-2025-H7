#!/bin/bash
set -e
# Wait for MongoDB to start
until mongosh --eval "print(\"waited for connection\")"; do
  sleep 1
done

echo "Importing future environmental data..."
mongoimport --db wildfire --collection future_environmental_data --type csv --headerline --file /docker-entrypoint-initdb.d/future_environmental_data.csv

echo "Importing historical wildfire data..."
mongoimport --db wildfire --collection historical_wildfiredata --type csv --headerline --file /docker-entrypoint-initdb.d/historical_wildfiredata.csv

echo "Seeding completed."
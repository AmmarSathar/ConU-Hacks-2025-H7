#!/bin/bash
set -e

# Wait for MongoDB using port check (no client dependency)
until nc -z localhost 27017; do
  sleep 1
done

echo "Importing environmental data..."
mongoimport --db wildfire --collection environmentdatas --type csv --headerline --file /docker-entrypoint-initdb.d/future_environmental_data.csv

echo "Importing historical wildfire data..."
mongoimport --db wildfire --collection historical_wildfiredata --type csv --headerline --file /docker-entrypoint-initdb.d/historical_wildfiredata.csv

echo "Seeding completed."
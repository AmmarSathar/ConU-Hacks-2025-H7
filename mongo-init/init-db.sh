#!/bin/bash
set -e

echo "Importing future environmental data..."
mongoimport --db wildfire --collection future_environmental_data.csv --type csv --headerline --file /docker-entrypoint-initdb.d/future_environmental_data.csv

echo "Importing historical wildfire data..."
mongoimport --db wildfire --collection historical_wildfiredata.csv --type csv --headerline --file /docker-entrypoint-initdb.d/historical_wildfiredata.csv

echo "Database seeding completed."

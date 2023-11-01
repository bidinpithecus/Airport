#!/bin/bash

MONGO_DB="airport"

for json_file in mongo/*.json; do
  collection_name=$(basename "$json_file" .json)

  # Use mongoimport to import the JSON file into MongoDB
  mongoimport --host localhost --db "$MONGO_DB" --collection "$collection_name" --file "mongo/$collection_name.json"
done

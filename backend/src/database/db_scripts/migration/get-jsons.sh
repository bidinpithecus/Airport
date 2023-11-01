#!/bin/bash

PG_HOST="localhost"
PG_PORT="5432"
PG_USER="admin"
PG_DB="airport"

for sql_file in pg/*.sql; do
  table_name=$(basename "$sql_file" .sql)

  psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -t -f "$sql_file" > "mongo/$table_name.json"
done

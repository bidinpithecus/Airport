#!/bin/bash

PG_HOST="localhost"
PG_PORT="5432"
PG_USER="admin"
PG_DB="airport"

read -s -p "Enter password for PostgreSQL: " PG_PASSWORD
echo
pattern='"[0-9a-fA-F]\{24\}"'

output_directory="mongo"

mkdir -p "$output_directory"

for sql_file in pg/*.sql; do
	table_name=$(basename "$sql_file" .sql)

	PGPASSWORD="$PG_PASSWORD" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -t -f "$sql_file" > "mongo/$table_name.json"

	sed -E "s/\b($pattern)\b/{\1}/g" "mongo/$table_name.json" > temp_file.txt

	mv temp_file.txt "mongo/$table_name.json"
done

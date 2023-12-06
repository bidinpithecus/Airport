#!/bin/bash

input_file="../postgrator/001.do.setup-tables.sql"

output_directory="pg"

mkdir -p "$output_directory"

table_names=$(grep -o 'CREATE TABLE IF NOT EXISTS "[^"]*"' "$input_file" | sed 's/CREATE TABLE IF NOT EXISTS "\(.*\)"/\1/')

for table_name in $table_names; do
    output_file="$output_directory/$table_name.sql"

    create_table_string=$(awk "/CREATE TABLE IF NOT EXISTS \"$table_name\"/,/);/{print}" "$input_file" | grep -v -e 'FOREIGN KEY' -e 'REFERENCES')
    column_names_keys=$(echo "$create_table_string" | grep -o '"[^"]\+"' | sed 's/"_id"/'\''_id'\''/' | sed 's/"\([^"]*\)"/'\''\1'\''/' | awk '{if ($0 == "'\''id'\''") print "_"$0; else print $0}' | tail -n +3)
    column_names_values=$(echo "$create_table_string" | grep -o '"[^"]\+"' | sed 's/"//g' | tail -n +3)

    combined_columns=$(paste -d, <(echo "$column_names_keys") <(echo "$column_names_values") | tr -d '\t' | tr '\n' ',' | sed 's/,$//')

    content="SELECT (json_build_object('_id',id,$combined_columns)) AS $table_name FROM $table_name;"

    echo "$content" > "$output_file"

    echo "Generated $output_file"
done

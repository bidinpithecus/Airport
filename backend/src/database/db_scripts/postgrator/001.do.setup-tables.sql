BEGIN;

CREATE OR REPLACE FUNCTION generate_object_id() RETURNS varchar AS $$
    DECLARE
        time_component bigint;
        machine_id bigint := FLOOR(random() * 16777215);
        process_id bigint;
        seq_id bigint := FLOOR(random() * 16777215);
        result varchar:= '';
    BEGIN
        SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp())) INTO time_component;
        SELECT pg_backend_pid() INTO process_id;

        result := result || lpad(to_hex(time_component), 8, '0');
        result := result || lpad(to_hex(machine_id), 6, '0');
        result := result || lpad(to_hex(process_id), 4, '0');
        result := result || lpad(to_hex(seq_id), 6, '0');
        RETURN result;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE IF NOT EXISTS "syndicate" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"name" VARCHAR(50) UNIQUE NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "airplane_model" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"capacity" INTEGER NOT NULL,
	"weight" REAL NOT NULL,
	"code" VARCHAR(20) UNIQUE NOT NULL,
	"image_path" VARCHAR(75) UNIQUE NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "airplane" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"model_id" CHAR(24) NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("model_id") REFERENCES "airplane_model"
);

CREATE TABLE IF NOT EXISTS "integrity_test" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"name" VARCHAR(50) NOT NULL,
	"minimum_score" NUMERIC NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "location" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"country_abbreviation" VARCHAR(3) NOT NULL,
	"country" VARCHAR(50) NOT NULL,
	"state" VARCHAR(50) NOT NULL,
	"city" VARCHAR(50) NOT NULL,
	"street" VARCHAR(50) NOT NULL,
	"is_airport" BOOLEAN NOT NULL,
	"number" INTEGER NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "employee" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"name" VARCHAR(50) NOT NULL,
	"house_location_id" CHAR(24) NOT NULL,
	"phone_number" VARCHAR(20) NOT NULL,
	"salary" REAL NOT NULL,
	"syndicate_id" CHAR(24) NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("house_location_id") REFERENCES "location",
	FOREIGN KEY ("syndicate_id") REFERENCES "syndicate"
);

CREATE TABLE IF NOT EXISTS "technician" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("id") REFERENCES "employee"
);

CREATE TABLE IF NOT EXISTS "test_made" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"score" NUMERIC NOT NULL,
	"start_date" TIMESTAMP NOT NULL,
	"finish_date" TIMESTAMP NOT NULL,
	"airplane_id" CHAR(24) NOT NULL,
	"integrity_test_id" CHAR(24) NOT NULL,
	"technician_id" CHAR(24) NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("airplane_id") REFERENCES "airplane",
	FOREIGN KEY ("technician_id") REFERENCES "technician",
	FOREIGN KEY ("integrity_test_id") REFERENCES "integrity_test"
);

CREATE TABLE IF NOT EXISTS "air_traffic_controller" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"last_exam_date" TIMESTAMP NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("id") REFERENCES "employee"
);

CREATE TABLE IF NOT EXISTS "technician_pro_at_model" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"technician_id" CHAR(24) NOT NULL,
	"airplane_model_id" CHAR(24) NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("technician_id") REFERENCES "technician",
	FOREIGN KEY ("airplane_model_id") REFERENCES "airplane_model"
);

CREATE TABLE IF NOT EXISTS "pilot" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"last_exam_date" TIMESTAMP NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("id") REFERENCES "employee"
);

CREATE TABLE IF NOT EXISTS "flight" (
	"id" CHAR(24) PRIMARY KEY DEFAULT generate_object_id(),
	"airplane_id" CHAR(24) NOT NULL,
	"pilot_id" CHAR(24) NOT NULL,
	"start_location_id" CHAR(24) NOT NULL,
	"destination_location_id" CHAR(24) NOT NULL,
	"occupied_seats" INTEGER NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("start_location_id") REFERENCES "location",
	FOREIGN KEY ("destination_location_id") REFERENCES "location",
	FOREIGN KEY ("airplane_id") REFERENCES "airplane",
	FOREIGN KEY ("pilot_id") REFERENCES "pilot"
);

END;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

BEGIN;

CREATE TABLE IF NOT EXISTS "syndicate" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"name" VARCHAR(50) UNIQUE NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "airplane_model" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"capacity" INTEGER NOT NULL,
	"weight" REAL NOT NULL,
	"code" VARCHAR(20) UNIQUE NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "airplane" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"model_id" UUID NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("model_id") REFERENCES "airplane_model"
);

CREATE TABLE IF NOT EXISTS "integrity_test" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"name" VARCHAR(50) NOT NULL,
	"minimum_score" NUMERIC NOT NULL,
	"maximum_score" NUMERIC NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "location" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"name" VARCHAR(50) NOT NULL,
	"house_location_id" UUID NOT NULL,
	"phone_number" VARCHAR(20) NOT NULL,
	"salary" REAL NOT NULL,
	"syndicate_id" UUID NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("house_location_id") REFERENCES "location",
	FOREIGN KEY ("syndicate_id") REFERENCES "syndicate"
);

CREATE TABLE IF NOT EXISTS "technician" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"employee_id" UUID NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("employee_id") REFERENCES "employee"
);

CREATE TABLE IF NOT EXISTS "test_made" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"score" NUMERIC NOT NULL,
	"start_date" TIMESTAMP NOT NULL,
	"finish_date" TIMESTAMP NOT NULL,
	"airplane_id" UUID NOT NULL,
	"integrity_test_id" UUID NOT NULL,
	"technician_id" UUID NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("airplane_id") REFERENCES "airplane",
	FOREIGN KEY ("technician_id") REFERENCES "technician",
	FOREIGN KEY ("integrity_test_id") REFERENCES "integrity_test"
);

CREATE TABLE IF NOT EXISTS "air_traffic_controller" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"employee_id" UUID NOT NULL,
	"last_exam_date" TIMESTAMP NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("employee_id") REFERENCES "employee"
);

CREATE TABLE IF NOT EXISTS "technician_pro_at_model" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"technician_id" UUID NOT NULL,
	"airplane_model_id" UUID NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("technician_id") REFERENCES "technician",
	FOREIGN KEY ("airplane_model_id") REFERENCES "airplane_model"
);

CREATE TABLE IF NOT EXISTS "pilot" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"employee_id" UUID NOT NULL,
	"last_exam_date" TIMESTAMP NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("employee_id") REFERENCES "employee"
);

CREATE TABLE IF NOT EXISTS "flight" (
	"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	"airplane_id" UUID NOT NULL,
	"pilot_id" UUID NOT NULL,
	"start_location_id" UUID NOT NULL,
	"destination_location_id" UUID NOT NULL,
	"occupied_seats" INTEGER NOT NULL,
	"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY ("start_location_id") REFERENCES "location",
	FOREIGN KEY ("destination_location_id") REFERENCES "location",
	FOREIGN KEY ("airplane_id") REFERENCES "airplane",
	FOREIGN KEY ("pilot_id") REFERENCES "pilot"
);

END;

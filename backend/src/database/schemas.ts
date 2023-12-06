import { ObjectId } from "mongodb";

export type Syndicate = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	name: string;
}

export type AirplaneModel = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	capacity: number;
	weight: number;
	code: string;
	image_path: string;
}

export type Airplane = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	model_id: ObjectId;
}

export type IntegrityTest = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	name: string;
	minimum_score: number;
}

export type Location = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	country_abbreviation: string;
	country: string;
	state: string;
	city: string;
	street: string;
	number: number;
	is_airport: boolean;
}

export type Employee = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	name: string;
	house_location_id: ObjectId;
	phone_number: string;
	salary: number;
	syndicate_id: ObjectId;
}

export type Technician = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
}

export type TestMade = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	score: number;
	start_date: Date;
	finish_date: Date;
	airplane_id: ObjectId;
	integrity_test_id: ObjectId;
	technician_id: ObjectId;
}

export type AirTrafficController = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	last_exam_date: Date;
}

export type TechnicianProAtModel = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	technician_id: ObjectId;
	airplane_model_id: ObjectId;
}

export type Pilot = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	last_exam_date: Date;
}

export type Flight = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	airplane_id: ObjectId;
	pilot_id: ObjectId;
	start_location_id: ObjectId;
	destination_location_id: ObjectId;
	occupied_seats: number;
}

export type AirplaneModelWithTechsAndAirplanes = {
	capacity: number;
	weight: number;
	code: string;
	technician_pro_ids: ObjectId[];
	airplane_ids: ObjectId[];
}

export type AirplaneFlightAndTests = {
	airplane_id: ObjectId;
	model_id: ObjectId;
	flight_ids: ObjectId[];
	test_ids: ObjectId[];
}

export type TechnicianInfoWithTestsAndModels = {
	technician_id: ObjectId;
	syndicate_id?: ObjectId;
	tests_made_id?: ObjectId[];
	models_pro_id?: ObjectId[];
}

export type CompleteTestMade = {
	id: ObjectId;
	obtained_score: number;
	start_date: Date;
	finish_date: Date;
	airplane_id: ObjectId;
	integrity_test_id: ObjectId;
	technician_id: ObjectId;
	test_name: string;
	minimum_score: number;
}

export type CompleteFlight = {
	id: ObjectId;
	created_at: Date;
	updated_at: Date;
	airplane_id: ObjectId;
	pilot_id: ObjectId;
	start_location_id: ObjectId;
	destination_location_id: ObjectId;
	occupied_seats: number;

	startLocation: Location;
	destinationLocation: Location;

	airplane_model_capacity: number;
}

export type AirplaneModelsAndEmployees = {
	models: AirplaneModel[];
	employees: Employee[];
}

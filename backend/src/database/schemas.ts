import { UUID } from "crypto";

export type Syndicate = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	name: string;
}

export type AirplaneModel = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	capacity: bigint;
	weight: number;
	code: string;
}

export type Airplane = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	modelId: UUID;
}

export type IntegrityTest = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	capacity: bigint;
	name: string;
	minimumScore: bigint;
	maximumScore: bigint;
}

export type Location = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	countryAbbreviation: string;
	country: string;
	state: string;
	city: string;
	street: string;
	number: bigint;
	isAirport: string;
}

export type Employee = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	houseLocationId: string;
	phoneNumber: string;
	salary: number;
	syndicateId: UUID;
}

export type Technician = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	employeeId: UUID;
}

export type TestMade = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	score: bigint;
	startDate: Date;
	finishDate: Date;
	airplaneId: UUID;
	integrityTestId: UUID;
	technicianId: UUID;
}

export type AirTrafficController = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	employeeId: UUID;
	lastExamDate: Date;
}

export type TechnicianProAtModel = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	technicianId: UUID;
	airplaneModelId: UUID;
}

export type Pilot = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	employeeId: UUID;
	lastExamDate: Date;
}

export type Flight = {
	id: UUID;
	createdAt: Date;
	updatedAt: Date;
	airplaneId: UUID;
	pilotId: UUID;
	startLocationId: UUID;
	destinationLocationId: UUID;
	occupiedSeats: bigint;
}

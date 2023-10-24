import { UUID } from "crypto";
import { DatabaseService } from "./databaseService";
import { Airplane, AirplaneModel, Employee } from "./schemas";

class MongoService implements DatabaseService {
	connect(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	close(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	createAirplane(airplaneModel: Omit<Airplane, "id" | "createdAt" | "updatedAt">): Promise<void> {
		throw new Error("Method not implemented.");
	}

	createAirplaneModel(airplane: Omit<AirplaneModel, "id" | "createdAt" | "updatedAt">): Promise<void> {
		throw new Error("Method not implemented.");
	}

	readAirplanes(): Promise<Airplane[] | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneById(id: UUID): Promise<Airplane | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneByModelId(modelId: UUID): Promise<Airplane | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModels(): Promise<AirplaneModel[] | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelById(id: UUID): Promise<AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelByCode(code: string): Promise<AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelByCapacity(capacity: bigint): Promise<AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelByWeight(weight: number): Promise<AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readEmployees(): Promise<Employee[] | null> {
		throw new Error("Method not implemented.");
	}

	updateAirplaneById(id: UUID, modelId: UUID): Promise<void> {
		throw new Error("Method not implemented.");
	}

	updateAirplaneByModelId(id: UUID, modelId: UUID): Promise<void> {
		throw new Error("Method not implemented.");
	}

	updateAirplaneModelById(id: UUID, newCapacity: bigint, newWeight: number): Promise<void> {
		throw new Error("Method not implemented.");
	}

	updateAirplaneModelByCode(code: string, newCapacity: bigint, newWeight: number): Promise<void> {
		throw new Error("Method not implemented.");
	}

	deleteAirplaneById(id: UUID): Promise<void> {
		throw new Error("Method not implemented.");
	}

	deleteAirplaneByModelId(id: UUID): Promise<void> {
		throw new Error("Method not implemented.");
	}

	deleteAirplaneModelById(id: UUID): Promise<void> {
		throw new Error("Method not implemented.");
	}

	deleteAirplaneModelByCode(code: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
}

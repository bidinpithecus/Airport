import { UUID } from "crypto";
import * as schemas from "./schemas";

export interface DatabaseService {
	connect(): Promise<void>;

	close(): Promise<void>;


	createAirplane(airplaneModel: Omit<schemas.Airplane, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>;
	createAirplaneModel(airplane: Omit<schemas.AirplaneModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>;


	readAirplanes(): Promise<schemas.Airplane[] | null>;
	readAirplaneById(id: UUID): Promise<schemas.Airplane | null>;
	readAirplaneByModelId(modelId: UUID): Promise<schemas.Airplane | null>;

	readAirplaneModels(): Promise<schemas.AirplaneModel[] | null>;
	readAirplaneModelById(id: UUID): Promise<schemas.AirplaneModel | null>;
	readAirplaneModelByCode(code: string): Promise<schemas.AirplaneModel | null>;
	readAirplaneModelByCapacity(capacity: bigint): Promise<schemas.AirplaneModel | null>;
	readAirplaneModelByWeight(weight: number): Promise<schemas.AirplaneModel | null>;

	readEmployees(): Promise<schemas.Employee[] | null>;

	updateAirplaneById(id: UUID, modelId: UUID): Promise<void>;
	updateAirplaneByModelId(id: UUID, modelId: UUID): Promise<void>;

	updateAirplaneModelById(id: UUID, newCapacity: bigint, newWeight: number): Promise<void>;
	updateAirplaneModelByCode(code: string, newCapacity: bigint, newWeight: number): Promise<void>;


	deleteAirplaneById(id: UUID): Promise<void>;
	deleteAirplaneByModelId(id: UUID): Promise<void>;

	deleteAirplaneModelById(id: UUID): Promise<void>;
	deleteAirplaneModelByCode(code: string): Promise<void>;
}

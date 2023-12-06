import { ObjectId } from "mongodb";
import * as schemas from "./schemas";

export interface DatabaseService {
	connect(): Promise<void>;

	close(): Promise<void>;


	createAirplane(airplaneModel: Omit<schemas.Airplane, 'id' | 'created_at' | 'updated_at'>): Promise<void>;
	createAirplaneModel(airplane: Omit<schemas.AirplaneModel, 'id' | 'created_at' | 'updated_at'>): Promise<void>;
	createTechnicianProAtModel(technician_pro_at_model: Omit<schemas.TechnicianProAtModel, 'id' | 'created_at' | 'updated_at'>): Promise<void>;
	createTechnician(tech: Omit<schemas.Technician, 'created_at' | 'updated_at'>): Promise<void>;
	createEmployee(empl: Omit<schemas.Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ObjectId>;


	readAirplanes(): Promise<schemas.Airplane[] | null>;
	readAirplaneById(id: ObjectId): Promise<schemas.Airplane | null>;
	readAirplaneByModelId(modelId: ObjectId): Promise<schemas.Airplane[] | null>;

	readAirplaneModels(): Promise<schemas.AirplaneModel[] | null>;
	readAirplaneModelById(id: ObjectId): Promise<schemas.AirplaneModel | null>;
	readAirplaneModelByCode(code: string): Promise<schemas.AirplaneModel | null>;
	readAirplaneModelByImagePath(imagePath: string): Promise<schemas.AirplaneModel | null>;
	readTechniciansProByAirplaneModelId(id: ObjectId): Promise<schemas.TechnicianProAtModel[] | null>;

	getAirplaneModelWithTechsAndAirplanesById(id: ObjectId): Promise<schemas.AirplaneModelWithTechsAndAirplanes | null>;
	checkDuplicateAirplaneModel(code: string, imagePath: string): Promise<schemas.AirplaneModel[] | null>;

	readAirplaneFlightAndTestsById(id: ObjectId): Promise<schemas.AirplaneFlightAndTests | null>;
	readTechnicianDataAndTestsAndModelsByTechnicianId(id: ObjectId): Promise<schemas.TechnicianInfoWithTestsAndModels | null>;
	readTechnicians(): Promise<schemas.TechnicianInfoWithTestsAndModels[] | null>;

	readTechnicianById(id: ObjectId): Promise<schemas.Technician | null>;

	readEmployeeById(id: ObjectId): Promise<schemas.Employee | null>;

	readTestsMadeByTechnicianId(id: ObjectId): Promise<schemas.TestMade[] | null>;

	readTechnicianProAtModelByTechnicianId(id: ObjectId): Promise<schemas.TechnicianProAtModel[] | null>;

	readTestsMadeByAirplaneId(id: ObjectId): Promise<schemas.TestMade[] | null>;

	readFlightsByAirplaneId(id: ObjectId): Promise<schemas.Flight[] | null>;
	readFlightById(id: ObjectId): Promise<schemas.Flight | null>;

	readLocationById(id: ObjectId): Promise<schemas.Location | null>;

	readEmployees(): Promise<schemas.Employee[] | null>;

	updateAirplaneById(id: ObjectId, modelId: ObjectId): Promise<void>;

	updateAirplaneModelById(id: ObjectId, newCapacity: number, newWeight: number, imagePath: string): Promise<void>;

	deleteAirplaneById(id: ObjectId): Promise<void>;
	deleteAirplaneByModelId(id: ObjectId): Promise<void>;

	deleteAirplaneModelById(id: ObjectId): Promise<void>;
	deleteAirplaneModelByCode(code: string): Promise<void>;
	readCompleteTest(id: ObjectId): Promise<schemas.CompleteTestMade | null>;

	readTechniciansProByAirplaneModelIdAndTechnicianId(technician_id: ObjectId, model_id: ObjectId): Promise<schemas.TechnicianProAtModel | null>;
	readTechnicianEmployees(): Promise<schemas.Employee[] | null>;
	readNonTechnicianEmployees(): Promise<schemas.Employee[] | null>;

}

import { UUID } from "crypto";
import { DatabaseService } from "./databaseService";
import * as schemas from "./schemas";
import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
import { env } from './../env'

export class MongoService implements DatabaseService {
	private client: MongoClient;
	private airport: Db;

	constructor(mongoOptions: MongoClientOptions) {
		this.client = new MongoClient(`${env.dbDriver}://${env.dbHost}:${env.dbPort}`, mongoOptions);

		this.connect();
		this.airport = this.client.db('airport');
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			await this.client.db('admin').command({ ping: 1 });
			console.log('Succesfuly connected to MondoDB');
		} catch(error) {
			throw error;
		}
	}

	async close(): Promise<void> {
		await this.client.close();
	}

	createAirplane(airplaneModel: Omit<schemas.Airplane, "id" | "createdAt" | "updatedAt">): Promise<void> {
		throw new Error("Method not implemented.");
	}

	createAirplaneModel(airplane: Omit<schemas.AirplaneModel, "id" | "createdAt" | "updatedAt">): Promise<void> {
		throw new Error("Method not implemented.");
	}

	readAirplanes(): Promise<schemas.Airplane[] | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneById(id: UUID): Promise<schemas.Airplane | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneByModelId(modelId: UUID): Promise<schemas.Airplane | null> {
		throw new Error("Method not implemented.");
	}

	async readAirplaneModels(): Promise<schemas.AirplaneModel[] | null> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			const result = await airplaneModelCollection.find({}).toArray();

			return result.length === 0 ? null : result;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	readAirplaneModelById(id: UUID): Promise<schemas.AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelByCode(code: string): Promise<schemas.AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelByCapacity(capacity: bigint): Promise<schemas.AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readAirplaneModelByWeight(weight: number): Promise<schemas.AirplaneModel | null> {
		throw new Error("Method not implemented.");
	}

	readEmployees(): Promise<schemas.Employee[] | null> {
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

import { Pool, PoolConfig } from 'pg';
import { DatabaseService } from './databaseService';
import * as schemas from './schemas';
import Postgrator from 'postgrator';
import path from 'path';

class PostgresService implements DatabaseService {
	private client: Pool;
	private migrator: Postgrator;

	constructor(poolConfig: PoolConfig) {
		this.client = new Pool(poolConfig);
		this.connect();

		this.migrator = new Postgrator({
			driver: 'pg',
			migrationPattern: path.resolve(__dirname, './db_scripts/postgrator/*'),
			database: poolConfig.database,
			currentSchema: 'public',
			validateChecksums: false,
			execQuery: (query) => this.client.query(query)
		});

		this.migrate();
	}

	private async migrate() {
		await this.migrator.migrate('001');
		await this.migrator.migrate('002');
		await this.migrator.migrate('003');
	}

	async createAirplaneModel(airplaneModel: Omit<schemas.AirplaneModel, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
		const { capacity, weight, code, image_path } = airplaneModel;
		const query = 'INSERT INTO "airplane_model" (capacity, weight, code, image_path) VALUES ($1, $2, $3, $4)';
		const values = [capacity, weight, code, image_path];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error creating airplane model:', error);
			throw error;
		}
	}

	async createAirplane(airplane: Omit<schemas.Airplane, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
		const { model_id } = airplane;
		const query = 'INSERT INTO "airplane" (model_id) VALUES ($1)';
		const values = [model_id];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error creating airplane:', error);
			throw error;
		}
	}

	async readTechniciansProByAirplaneModelId(id: number): Promise<schemas.TechnicianProAtModel[] | null> {
		const query = 'SELECT * FROM technician_pro_at_model WHERE airplane_model_id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows;
		} catch (error) {
			console.error(`Error reading technicians pro at model_id ${id}:`, error);
			throw error;
		}
	}

	async readAirplaneModelById(id: number): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM airplane_model WHERE id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by ID:', error);
			throw error;
		}
	}

	async getAirplaneModelWithTechsAndAirplanesById(id: number): Promise<schemas.AirplaneModelWithTechsAndAirplanes | null> {
		try {
			const airplaneModel = await this.readAirplaneModelById(id);
			const airplanes = await this.readAirplaneByModelId(id);
			const technicians = await this.readTechniciansProByAirplaneModelId(id);

			if (airplaneModel) {
				const model: schemas.AirplaneModelWithTechsAndAirplanes = {
					capacity: airplaneModel.capacity,
					weight: airplaneModel.weight,
					code: airplaneModel.code,
					technician_pro_ids: technicians ? technicians.map(tech => tech.technician_id) : [],
					airplane_ids: airplanes ? airplanes.map(airplane => airplane.id) : [],
				};
				return model;
			}

			return null;
		} catch (error) {
			console.error('Error getting airplane model with techs and airplanes by ID:', error);
			throw error;
		}
	}

	async readAirplaneFlightAndTestsById(id: number): Promise<schemas.AirplaneFlightAndTests | null> {
		try {
			const airplane = await this.readAirplaneById(id);
			const flights = await this.readFlightsByAirplaneId(id);
			const tests = await this.readTestsMadeByAirplaneId(id);

			if (airplane) {
				const completeAirplane: schemas.AirplaneFlightAndTests = {
					airplane_id: airplane.id,
					model_id: airplane.model_id,
					flight_ids: flights ? flights.map((flight: { id: any; }) => flight.id) : [],
					test_ids: tests ? tests.map((test: { id: any; }) => test.id) : [],
				};

				return completeAirplane;
			}

			return null;
		} catch (error) {
			console.error('Error getting airplane model with techs and airplanes by ID:', error);
			throw error;
		}
	}

	async readTechnicianDataAndTestsAndModelsByTechnicianId(id: number): Promise<schemas.TechnicianInfoWithTestsAndModels | null> {
		try {
			const technician = await this.readTechnicianById(id);

			if (technician) {
				const employee = await this.readEmployeeById(technician.id);
				const tests = await this.readTestsMadeByTechnicianId(id);
				const models = await this.readTechnicianProAtModelByTechnicianId(id);

				const completeTechnician: schemas.TechnicianInfoWithTestsAndModels = {
					technician_id: id,
					syndicate_id: employee?.syndicate_id,
					tests_made_id: tests ? tests.map((test: { id: any; }) => test.id) : [],
					models_pro_id: models ? models.map((model: { id: any; }) => model.id) : [],
				};

				return completeTechnician;
			}

			return null;
		} catch (error) {
			console.error('Error getting airplane model with techs and airplanes by ID:', error);
			throw error;
		}
	}

	async readTechnicianById(id: number): Promise<schemas.Technician | null> {
		const query = 'SELECT * FROM technician WHERE id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows[0];
		} catch (error) {
			console.error(`Error reading technicians  ${id}:`, error);
			throw error;
		}
	}

	async readEmployeeById(id: number): Promise<schemas.Employee | null> {
		const query = 'SELECT * FROM employee WHERE id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows[0];
		} catch (error) {
			console.error(`Error reading technicians  ${id}:`, error);
			throw error;
		}
	}

	async readTestsMadeByTechnicianId(id: number): Promise<schemas.TestMade[] | null> {
		const query = 'SELECT * FROM test_made WHERE technician_id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows;
		} catch (error) {
			console.error(`Error reading tests made with airplane id: ${id}:`, error);
			throw error;
		}
	}

	async readTechnicianProAtModelByTechnicianId(id: number): Promise<schemas.TechnicianProAtModel[] | null> {
		const query = 'SELECT * FROM technician_pro_at_model WHERE technician_id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading airplane model by ID:', error);
			throw error;
		}
	}

	async readTechnicians(): Promise<schemas.TechnicianInfoWithTestsAndModels[] | null> {
		const query = 'SELECT * FROM technician';

		try {
			const result = await this.client.query(query);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading airplane model by ID:', error);
			throw error;
		}
	}

	async readTestsMadeByAirplaneId(id: number): Promise<schemas.TestMade[] | null> {
		const query = 'SELECT * FROM test_made WHERE airplane_id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows;
		} catch (error) {
			console.error(`Error reading tests made with airplane id: ${id}:`, error);
			throw error;
		}
	}

	async readFlightsByAirplaneId(id: number): Promise<schemas.Flight[] | null> {
		const query = 'SELECT * FROM flight WHERE airplane_id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows;
		} catch (error) {
			console.error(`Error reading flights made by airplane id: ${id}:`, error);
			throw error;
		}
	}

	async checkDuplicateAirplaneModel(code: string, image_path: string): Promise<schemas.AirplaneModel[] | null> {
		const query = 'SELECT * FROM airplane_model WHERE code = $1 OR image_path = $2';
		const values = [code, image_path];

		try {
			const result = await this.client.query(query, values);

			return result.rows.length === 0 ? null : result.rows;

		} catch (error) {
			console.error('Error checking for duplicate record:', error);
			throw error;
		}
	}

	async readAirplaneModels(): Promise<schemas.AirplaneModel[] | null> {
		const query = 'SELECT "id" as "id", "capacity" as "capacity", "weight" as "weight", "code" as "code", "image_path" as "image_path", "created_at" as "created_at", "updated_at" as "updated_at" FROM "airplane_model" ORDER BY code';

		try {
			const result = await this.client.query(query);

			return result.rows.length === 0 ? null : result.rows;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneModelByImagePath(image_path: string): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM "airplane_model" WHERE image_path = $1';
		const values = [image_path];

		try {
			const result = await this.client.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by image_path:', error);
			throw error;
		}
	}

	async readAirplaneModelByCode(code: string): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM "airplane_model" WHERE code = $1';
		const values = [code];

		try {
			const result = await this.client.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by code:', error);
			throw error;
		}
	}

	async readAirplanes(): Promise<schemas.Airplane[] | null> {
		const query = 'SELECT * FROM "airplane"';

		try {
			const result = await this.client.query(query);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneById(id: number): Promise<schemas.Airplane | null> {
		const query = 'SELECT id, model_id FROM "airplane" WHERE id = $1';
		const values = [id];

		try {
			const result = await this.client.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane by ID:', error);
			throw error;
		}
	}

	async readAirplaneByModelId(modelId: number): Promise<schemas.Airplane[] | null> {
		const query = 'SELECT * FROM "airplane" WHERE model_id = $1';
		const values = [modelId];

		try {
			const result = await this.client.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading airplane by modelId:', error);
			throw error;
		}
	}

	async readEmployees(): Promise<schemas.Employee[] | null> {
		const query = 'SELECT * FROM "employee"';

		try {
			const result = await this.client.query(query);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading employees:', error);
			throw error;
		}
	}

	async updateAirplaneModelById(id: number, newCapacity: number, newWeight: number, image_path: string): Promise<void> {
		const query = 'UPDATE "airplane_model" SET capacity = $1, weight = $2, image_path = $3 WHERE id = $4';
		const values = [newCapacity, newWeight, image_path, id];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error updating airplane model by ID:', error);
			throw error;
		}
	}

	async updateAirplaneById(id: number, newModelId: number): Promise<void> {
		const query = 'UPDATE "airplane" SET model_id = $1 WHERE id = $2';
		const values = [newModelId, id];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error updating airplane by ID:', error);
			throw error;
		}
	}

	async updateAirplaneByModelId(modelId: number, newModelId: number): Promise<void> {
		const query = 'UPDATE "airplane" SET model_id = $1 WHERE model_id = $2';
		const values = [newModelId, modelId];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error updating airplanes by model ID:', error);
			throw error;
		}
	}

	async deleteAirplaneModelById(id: number): Promise<void> {
		const query = 'DELETE FROM "airplane_model" WHERE id = $1';
		const values = [id];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error deleting airplane model by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneModelByCode(code: string): Promise<void> {
		const query = 'DELETE FROM "airplane_model" WHERE code = $1';
		const values = [code];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error deleting airplane model by code:', error);
			throw error;
		}
	}

	async deleteAirplaneById(id: number): Promise<void> {
		const query = 'DELETE FROM "airplane" WHERE id = $1';
		const values = [id];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error deleting airplane by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneByModelId(modelId: number): Promise<void> {
		const query = 'DELETE FROM "airplane" WHERE model_id = $1';
		const values = [modelId];

		try {
			await this.client.query(query, values);
		} catch (error) {
			console.error('Error deleting airplanes by model ID:', error);
			throw error;
		}
	}

	async connect(): Promise<void> {
		await this.client.connect();
	}

	async close(): Promise<void> {
		await this.client.end();
	}
}

export default PostgresService;

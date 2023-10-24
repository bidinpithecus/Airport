import { Pool, PoolConfig } from 'pg';
import { DatabaseService } from './databaseService';
import * as schemas from './schemas';
import { UUID } from 'crypto';
import Postgrator from 'postgrator';
import path from 'path';

class PostgresService implements DatabaseService {
	private pool: Pool;
	private migrator: Postgrator;

	constructor(poolConfig: PoolConfig) {
		this.pool = new Pool(poolConfig);
		this.connect();

		this.migrator = new Postgrator({
			driver: 'pg',
			migrationPattern: path.resolve(__dirname, './db_scripts/*'),
			database: poolConfig.database,
			currentSchema: 'public',
			execQuery: (query) => this.pool.query(query)
		});

		this.migrate();
	}

	private migrate() {
		this.migrator.migrate();
	}

	async createAirplaneModel(airplaneModel: Omit<schemas.AirplaneModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
		const { capacity, weight, code } = airplaneModel;
		const query = 'INSERT INTO "airplane_model" (capacity, weight, code) VALUES ($1, $2, $3)';
		const values = [capacity, weight, code];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error creating airplane model:', error);
			throw error;
		}
	}

	async createAirplane(airplane: Omit<schemas.Airplane, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
		const { modelId } = airplane;
		const query = 'INSERT INTO "airplane" (model_id) VALUES ($1)';
		const values = [modelId];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error creating airplane:', error);
			throw error;
		}
	}

	async readAirplaneModelById(id: UUID): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM "airplane_model" WHERE id = $1';
		const values = [id];

		try {
			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by ID:', error);
			throw error;
		}
	}

	async readAirplaneModels(): Promise<schemas.AirplaneModel[] | null> {
		const query = 'SELECT * FROM "airplane_model"';

		try {
			const result = await this.pool.query(query);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneModelByCode(code: string): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM "airplane_model" WHERE code = $1';
		const values = [code];

		try {
			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by code:', error);
			throw error;
		}
	}

	async readAirplaneModelByCapacity(capacity: bigint): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM "airplane_model" WHERE capacity = $1';
		const values = [capacity];

		try {
			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by capacity:', error);
			throw error;
		}
	}

	async readAirplaneModelByWeight(weight: number): Promise<schemas.AirplaneModel | null> {
		const query = 'SELECT * FROM "airplane_model" WHERE weight = $1';
		const values = [weight];

		try {
			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane model by weight:', error);
			throw error;
		}
	}

	async readAirplanes(): Promise<schemas.Airplane[] | null> {
		const query = 'SELECT * FROM "airplane"';

		try {
			const result = await this.pool.query(query);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneById(id: UUID): Promise<schemas.Airplane | null> {
		const query = 'SELECT * FROM "airplane" WHERE id = $1';
		const values = [id];

		try {
			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane by ID:', error);
			throw error;
		}
	}

	async readAirplaneByModelId(modelId: UUID): Promise<schemas.Airplane | null> {
		const query = 'SELECT * FROM "airplane" WHERE model_id = $1';
		const values = [modelId];

		try {
			const result = await this.pool.query(query, values);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows[0];
		} catch (error) {
			console.error('Error reading airplane by modelId:', error);
			throw error;
		}
	}

	async readEmployees(): Promise<schemas.Employee[] | null> {
		const query = 'SELECT * FROM "employee"';

		try {
			const result = await this.pool.query(query);

			if (result.rows.length === 0) {
				return null;
			}

			return result.rows;
		} catch (error) {
			console.error('Error reading employees:', error);
			throw error;
		}
	}

	async updateAirplaneModelById(id: UUID, newCapacity: bigint, newWeight: number): Promise<void> {
		const query = 'UPDATE "airplane_model" SET capacity = $1, weight = $2 WHERE id = $3';
		const values = [newCapacity, newWeight, id];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error updating airplane model by ID:', error);
			throw error;
		}
	}

	async updateAirplaneModelByCode(code: string, newCapacity: bigint, newWeight: number): Promise<void> {
		const query = 'UPDATE "airplane_model" SET capacity = $1, weight = $2 WHERE code = $3';
		const values = [newCapacity, newWeight, code];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error updating airplane model by code:', error);
			throw error;
		}
	}

	async updateAirplaneById(id: UUID, newModelId: UUID): Promise<void> {
		const query = 'UPDATE "airplane" SET model_id = $1 WHERE id = $2';
		const values = [newModelId, id];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error updating airplane by ID:', error);
			throw error;
		}
	}

	async updateAirplaneByModelId(modelId: UUID, newModelId: UUID): Promise<void> {
		const query = 'UPDATE "airplane" SET model_id = $1 WHERE model_id = $2';
		const values = [newModelId, modelId];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error updating airplanes by model ID:', error);
			throw error;
		}
	}

	async deleteAirplaneModelById(id: UUID): Promise<void> {
		const query = 'DELETE FROM "airplane_model" WHERE id = $1';
		const values = [id];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error deleting airplane model by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneModelByCode(code: string): Promise<void> {
		const query = 'DELETE FROM "airplane_model" WHERE code = $1';
		const values = [code];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error deleting airplane model by code:', error);
			throw error;
		}
	}

	async deleteAirplaneById(id: UUID): Promise<void> {
		const query = 'DELETE FROM "airplane" WHERE id = $1';
		const values = [id];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error deleting airplane by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneByModelId(modelId: UUID): Promise<void> {
		const query = 'DELETE FROM "airplane" WHERE model_id = $1';
		const values = [modelId];

		try {
			await this.pool.query(query, values);
		} catch (error) {
			console.error('Error deleting airplanes by model ID:', error);
			throw error;
		}
	}

	async connect(): Promise<void> {
		await this.pool.connect();
	}

	async close(): Promise<void> {
		await this.pool.end();
	}
}

export default PostgresService;

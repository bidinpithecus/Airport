import { DatabaseService } from "./databaseService";
import * as schemas from "./schemas";
import { Collection, Db, Document, MongoClient, MongoClientOptions } from 'mongodb';
import { env } from './../env';
import { ObjectId } from 'bson';

export default class MongoService implements DatabaseService {
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
		} catch(error) {
			throw error;
		}
	}

	async close(): Promise<void> {
		await this.client.close();
	}

	async readAirplaneModelByImagePath(imagePath: string): Promise<schemas.AirplaneModel | null> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			const result = await airplaneModelCollection.findOne({ image_path: imagePath });

			return result === null ? null : result;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readTechniciansProByAirplaneModelId(id: ObjectId): Promise<schemas.TechnicianProAtModel[] | null> {
		const technicianProAtModelCollection: Collection<schemas.TechnicianProAtModel> = this.airport.collection('technician_pro_at_model');

		try {
			const result = await technicianProAtModelCollection.find({ airplane_model_id: id }).toArray();

			return result === null ? null : result;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async getAirplaneModelWithTechsAndAirplanesById(id: ObjectId): Promise<schemas.AirplaneModelWithTechsAndAirplanes | null> {
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

	async checkDuplicateAirplaneModel(code: string, imagePath: string): Promise<schemas.AirplaneModel[] | null> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			const result = await airplaneModelCollection.find({
				$or: [
					{ code },
					{ image_path: imagePath }
				]
			}).toArray();

			return result.length === 0 ? null : result;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneFlightAndTestsById(id: ObjectId): Promise<schemas.AirplaneFlightAndTests | null> {
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

	async readTechnicianDataAndTestsAndModelsByTechnicianId(id: ObjectId): Promise<schemas.TechnicianInfoWithTestsAndModels | null> {
		try {
			const technician = await this.readTechnicianById(id);

			if (technician) {
				const employee = await this.readEmployeeById(technician.id);
				const tests = await this.readTestsMadeByTechnicianId(id);
				const models = await this.readTechnicianProAtModelByTechnicianId(id);
				if (employee === null) {
					return null;
				}

				const completeTechnician: schemas.TechnicianInfoWithTestsAndModels = {
					technician_id: id,
					syndicate_id: employee.syndicate_id,
					tests_made_id: tests ? tests.map((test: { id: any; }) => test.id) : [],
					models_pro_id: models ? models.map((model: { airplane_model_id: any; }) => model.airplane_model_id) : [],
				};

				return completeTechnician;
			}

			return null;
		} catch (error) {
			console.error('Error getting airplane model with techs and airplanes by ID:', error);
			throw error;
		}
	}

	async readTechnicians(): Promise<schemas.TechnicianInfoWithTestsAndModels[] | null> {
		const technicianCollection: Collection<schemas.TechnicianInfoWithTestsAndModels> = this.airport.collection('technician');

		try {
			const result = await technicianCollection.find({}).toArray();

			return result.length === 0 ? null : result;
		} catch (error) {
			console.error('Error reading technician:', error);
			throw error;
		}
	}

	async readTechnicianById(id: ObjectId): Promise<schemas.Technician | null> {
		const technicianCollection: Collection<schemas.Technician> = this.airport.collection('technician');

		try {
			const result = await technicianCollection.findOne(
				{ _id: id },
				{ projection: { _id: 0, id: "$_id", created_at: 1, updated_at: 1 }}
			);

			return result;
		} catch (error) {
			console.error('Error reading technician:', error);
			throw error;
		}
	}

	async readEmployeeById(id: ObjectId): Promise<schemas.Employee | null> {
		const employeeCollection: Collection<schemas.Employee> = this.airport.collection('employee');

		try {
			const result = await employeeCollection.findOne(
				{_id: new ObjectId(id)},
				{ projection: { id: '$_id', _id: 0, name: 1, house_location_id: 1, phone_number: 1, salary: 1, syndicate_id: 1 }}
			);

			return result;
		} catch (error) {
			console.error('Error reading employee:', error);
			throw error;
		}
	}

	async readTestsMadeByTechnicianId(technician_id: ObjectId): Promise<schemas.TestMade[] | null> {
		const testMadeCollection: Collection<schemas.TestMade> = this.airport.collection('test_made');

		try {
			const result: Document = await testMadeCollection.find({technician_id}).project({ id: '$_id', _id: 0 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const tests: schemas.TestMade[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				score: doc.score,
				start_date: doc.start_date,
				finish_date: doc.finish_date,
				airplane_id: doc.airplane_id,
				integrity_test_id: doc.integrity_test_id,
				technician_id: doc.technician_id
			}));

			return tests;
		} catch (error) {
			console.error('Error reading tests made:', error);
			throw error;
		}
	}

	async readTechnicianProAtModelByTechnicianId(technician_id: ObjectId): Promise<schemas.TechnicianProAtModel[] | null> {
		const technicianProAtModelCollection: Collection<schemas.TechnicianProAtModel> = this.airport.collection('technician_pro_at_model');

		try {
			const result: Document = await technicianProAtModelCollection.find({technician_id}).project({ id: '$_id', _id: 0, created_at: 1, updated_at: 1, technician_id: 1, airplane_model_id: 1 }).toArray();;

			if (result.length === 0) {
				return null;
			}

			const techs: schemas.TechnicianProAtModel[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				technician_id: doc.technician_id,
				airplane_model_id: doc.airplane_model_id
			}));

			return techs;
		} catch (error) {
			console.error('Error reading technician:', error);
			throw error;
		}
	}

	async readTestsMadeByAirplaneId(airplane_id: ObjectId): Promise<schemas.TestMade[] | null> {
		const testMadeCollection: Collection<schemas.TestMade> = this.airport.collection('test_made');

		try {
			const result: Document = await testMadeCollection.find({airplane_id}).project({ id: '$_id', _id: 0 }).toArray();;

			if (result.length === 0) {
				return null;
			}

			const tests: schemas.TestMade[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				score: doc.score,
				start_date: doc.start_date,
				finish_date: doc.finish_date,
				airplane_id: doc.airplane_id,
				integrity_test_id: doc.integrity_test_id,
				technician_id: doc.technician_id
			}));

			return tests;
		} catch (error) {
			console.error('Error reading tests made:', error);
			throw error;
		}
	}

	async readFlightsByAirplaneId(airplane_id: ObjectId): Promise<schemas.Flight[] | null> {
		const flightCollection: Collection<schemas.Flight> = this.airport.collection('flight');

		try {
			const result: Document = await flightCollection.find({airplane_id}).project({ id: '$_id', _id: 0 }).toArray();;

			if (result.length === 0) {
				return null;
			}

			const flights: schemas.Flight[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				airplaneId: doc.airplane_id,
				pilot_id: doc.pilot_it,
				start_location_id: doc.start_location_id,
				destination_location_id: doc.destination_location_id,
				occupied_seats: doc.occupied_seats
			}));

			return flights;
		} catch (error) {
			console.error('Error reading flights:', error);
			throw error;
		}
	}

	async createAirplane(airplane: Omit<schemas.Airplane, "id" | "created_at" | "updated_at">): Promise<void> {
		const airplaneCollection = this.airport.collection('airplane');

		const airplaneDocument = {
			_id: new ObjectId(),
			...airplane,
			created_at: new Date(),
			updated_at: new Date()
		};

		try {
			await airplaneCollection.insertOne(airplaneDocument);
		} catch (error) {
			console.error('Error creating airplane:', error);
			throw error;
		}
	}

	async createAirplaneModel(airplaneModel: Omit<schemas.AirplaneModel, "id" | "created_at" | "updated_at">): Promise<void> {
		const airplaneModelCollection = this.airport.collection('airplane_model');

		const airplaneModelDocument = {
			_id: new ObjectId(),
			...airplaneModel,
			created_at: new Date(),
			updated_at: new Date()
		};

		try {
			await airplaneModelCollection.insertOne(airplaneModelDocument);
		} catch (error) {
			console.error('Error creating airplane model: ', error);
			throw error;
		}
	}

	async readAirplanes(): Promise<schemas.Airplane[] | null> {
		const airplaneCollection: Collection<schemas.Airplane> = this.airport.collection('airplane');

		try {
			const result = await airplaneCollection.find({}).project({ id: '$_id', _id: 0 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const airplanes: schemas.Airplane[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				model_id: doc.model_id,
			}));

			return airplanes;
		} catch (error) {
			console.error('Error reading airplane: ', error);
			throw error;
		}
	}

	async readAirplaneById(id: ObjectId): Promise<schemas.Airplane | null> {
		const airplaneCollection: Collection<schemas.Airplane> = this.airport.collection('airplane');

		try {
			const result: Document | null = await airplaneCollection.findOne(
				{ _id: id },
				{ projection: { _id: 1, created_at: 1, updated_at: 1, model_id: 1 } }
			);

			if (!result) {
				return null;
			}

			const airplane: schemas.Airplane = {
				id: result._id,
				created_at: result.created_at,
				updated_at: result.updated_at,
				model_id: result.model_id,
			};

			return airplane;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneByModelId(modelId: ObjectId): Promise<schemas.Airplane[] | null> {
		const airplaneCollection: Collection<schemas.Airplane> = this.airport.collection('airplane');

		try {
			const result = await airplaneCollection.find({ model_id: modelId }).project({ id: '$_id', _id: 0, created_at: 1, updated_at: 1, model_id: 1 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const airplanes: schemas.Airplane[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				model_id: doc.model_id,
			}));

			return airplanes;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readAirplaneModels(): Promise<schemas.AirplaneModel[] | null> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			const result = await airplaneModelCollection.find({}).toArray();

			if (result.length === 0) {
				return null;
			}

			const airplanesWithRegularId = result.map((airplaneModel) => {
				const { _id, id, ...rest } = airplaneModel;
				return { id: _id, ...rest };
			});

			return airplanesWithRegularId;
		} catch (error) {
			console.error('Error reading airplane model: ', error);
			throw error;
		}
	}

	async readAirplaneModelById(id: ObjectId): Promise<schemas.AirplaneModel | null> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			const result = await airplaneModelCollection.findOne({ _id: new ObjectId(id) });
			return result === null ? null : result;
		} catch (error) {
			console.error('Error reading airplane model:', error);
			throw error;
		}
	}

	async readAirplaneModelByCode(code: string): Promise<schemas.AirplaneModel | null> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			const result = await airplaneModelCollection.findOne({code});

			return result === null ? null : result;
		} catch (error) {
			console.error('Error reading airplane model:', error);
			throw error;
		}
	}

	async readEmployees(): Promise<schemas.Employee[] | null> {
		const employeeCollection: Collection<schemas.Employee> = this.airport.collection('employee');

		try {
			const result = await employeeCollection.find().project({ id: '$_id', _id: 0, created_at: 1, updated_at: 1, name: 1, house_location_id: 1, phone_number: 1, salary: 1, syndicate_id: 1 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const employees: schemas.Employee[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				name: doc.name,
				house_location_id: doc.house_location_id,
				phone_number: doc.phone_number,
				salary: doc.salary,
				syndicate_id: doc.syndicate_id
			}));

			return employees;
		} catch (error) {
			console.error('Error reading employees:', error);
			throw error;
		}
	}

	async updateAirplaneById(id: ObjectId, modelId: ObjectId): Promise<void> {
		const airplaneCollection: Collection<schemas.Airplane> = this.airport.collection('airplane');

		try {
			await airplaneCollection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { model_id: modelId } }
			);
		} catch (error) {
			console.error('Error updating airplane by ID:', error);
			throw error;
		}
	}

	async updateAirplaneModelById(id: ObjectId, newCapacity: number, newWeight: number, image_path: string): Promise<void> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			await airplaneModelCollection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { capacity: newCapacity, weight: newWeight, image_path: image_path } }
			);
		} catch (error) {
			console.error('Error updating airplane model by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneById(id: ObjectId): Promise<void> {
		const airplaneCollection: Collection<schemas.Airplane> = this.airport.collection('airplane');

		try {
			await airplaneCollection.deleteOne(
				{ _id: new ObjectId(id) }
			);
		} catch (error) {
			console.error('Error updating airplane by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneByModelId(id: ObjectId): Promise<void> {
		const airplaneCollection: Collection<schemas.Airplane> = this.airport.collection('airplane');

		try {
			await airplaneCollection.deleteOne(
				{ model_id: id }
			);
		} catch (error) {
			console.error('Error deleting airplane by model ID:', error);
			throw error;
		}
	}

	async deleteAirplaneModelById(id: ObjectId): Promise<void> {
		const airplaneModelCollection: Collection<schemas.Airplane> = this.airport.collection('airplane_model');

		try {
			await airplaneModelCollection.deleteOne(
				{ _id: new ObjectId(id) }
			);
		} catch (error) {
			console.error('Error deleting airplane model by ID:', error);
			throw error;
		}
	}

	async deleteAirplaneModelByCode(code: string): Promise<void> {
		const airplaneModelCollection: Collection<schemas.AirplaneModel> = this.airport.collection('airplane_model');

		try {
			await airplaneModelCollection.deleteOne(
				{ code }
			);
		} catch (error) {
			console.error('Error updating airplane model by code:', error);
			throw error;
		}
	}

	async readCompleteTest(id: ObjectId): Promise<schemas.CompleteTestMade | null> {
		const testMadeCollection: Collection<schemas.TestMade> = this.airport.collection('test_made');

		try {
			const aggregationResult = await testMadeCollection.aggregate([
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				{
					$lookup: {
						from: 'integrity_test',
						localField: 'integrity_test_id',
						foreignField: '_id',
						as: 'integrity_test_info',
					},
				},
				{
					$unwind: '$integrity_test_info',
				},
				{
					$project: {
						_id: 0,
						id: '$_id',
						obtained_score: '$score',
						start_date: 1,
						finish_date: 1,
						airplane_id: 1,
						technician_id: 1,
						integrity_test_id: '$integrity_test_info._id',
						name: '$integrity_test_info.name',
						minimum_score: '$integrity_test_info.minimum_score',
					},
				},
			]).toArray();

			if (aggregationResult.length > 0) {
				const result = aggregationResult[0];

				const completeTest: schemas.CompleteTestMade = {
					id: result.id,
					obtained_score: result.obtained_score,
					start_date: result.start_date,
					finish_date: result.finish_date,
					airplane_id: result.airplane_id,
					technician_id: result.technician_id,
					test_name: result.name,
					minimum_score: result.minimum_score,
					integrity_test_id: result.integrity_test_id
				};

				return completeTest;
			} else {
				return null;
			}

		} catch (error) {
			console.error('Error occurred during aggregation:', error);
			return null;
		}
	}

	async readFlightById(id: ObjectId): Promise<schemas.Flight | null> {
		const flightCollection: Collection<schemas.Flight> = this.airport.collection('flight');

		try {
			const result: Document | null = await flightCollection.findOne(
				{ _id: id },
				{ projection: { _id: 0, created_at: 1, updated_at: 1, airplane_id: 1, pilot_id: 1, start_location_id: 1, destination_location_id: 1, occupied_seats: 1 } }
			);

			if (!result) {
				return null;
			}

			const flight: schemas.Flight = {
				id: result._id,
				created_at: result.created_at,
				updated_at: result.updated_at,
				airplane_id: result.airplane_id,
				pilot_id: result.pilot_id,
				start_location_id: result.start_location_id,
				destination_location_id: result.destination_location_id,
				occupied_seats: result.occupied_seats
			};

			return flight;
		} catch (error) {
			console.error('Error reading airplane:', error);
			throw error;
		}
	}

	async readLocationById(id: ObjectId): Promise<schemas.Location | null> {
		const locationCollection: Collection<schemas.Location> = this.airport.collection('location');

		try {
			const result: Document | null = await locationCollection.findOne(
				{ _id: id },
				{ projection: {_id: 0, created_at: 1, updated_at: 1, country_abbreviation: 1, country: 1, state: 1, city: 1, street: 1, number: 1, is_airport: 1 } }
			);

			if (!result) {
				return null;
			}

			const location: schemas.Location = {
				id: result._id,
				created_at: result.created_at,
				updated_at: result.updated_at,
				country_abbreviation: result.country_abbreviation,
				country: result.country,
				state: result.state,
				city: result.city,
				street: result.street,
				number: result.number,
				is_airport: result.is_airportt
			};

			return location;
		} catch (error) {
			console.error('Error reading location:', error);
			throw error;
		}
	}

	async readTechniciansProByAirplaneModelIdAndTechnicianId(technician_id: ObjectId, model_id: ObjectId): Promise<schemas.TechnicianProAtModel | null> {
		const technicianProAtModelCollection: Collection<schemas.TechnicianProAtModel> = this.airport.collection('technician_pro_at_model');

		try {
			const result: Document | null = await technicianProAtModelCollection.findOne(
				{technician_id, airplane_model_id: model_id},
				{projection: { id: '$_id', _id: 0, created_at: 1, updated_at: 1, technician_id: 1, airplane_model_id: 1 }}
			);

			if (!result) {
				return null;
			}

			const techs: schemas.TechnicianProAtModel = {
				id: result.id,
				created_at: result.created_at,
				updated_at: result.updated_at,
				technician_id: result.technician_id,
				airplane_model_id: result.airplane_model_id
			};

			return techs;
		} catch (error) {
			console.error('Error reading technician:', error);
			throw error;
		}
	}

	async createTechnicianProAtModel(technician_pro_at_model: Omit<schemas.TechnicianProAtModel, "id" | "created_at" | "updated_at">): Promise<void> {
		const technicianProAtModelCollection = this.airport.collection('technician_pro_at_model');

		const technicianProAtModelDocument = {
			_id: new ObjectId(),
			...technician_pro_at_model,
			created_at: new Date(),
			updated_at: new Date()
		};

		try {
			await technicianProAtModelCollection.insertOne(technicianProAtModelDocument);
		} catch (error) {
			console.error('Error creating airplane:', error);
			throw error;
		}
	}

	async readTechnicianEmployees(): Promise<schemas.Employee[] | null> {
		const technicianCollection: Collection<schemas.Technician> = this.airport.collection('technician');

		try {
			const aggregationResult = await technicianCollection.aggregate([
				{
					$lookup: {
						from: 'employee',
						localField: '_id',
						foreignField: '_id',
						as: 'employee_info',
					},
				},
				{
					$unwind: '$employee_info',
				},
				{
					$project: {
						_id: 0,
						id: '$_id',
						name: '$employee_info.name',
						house_location_id: '$employee_info.house_location_id',
						phone_number: '$employee_info.phone_number',
						salary: '$employee_info.salary',
						syndicate_id: '$employee_info.syndicate_id',
						created_at: '$employee_info.created_at',
						updated_at: '$employee_info.updated_at',
					},
				},
			]).toArray();

			if (aggregationResult.length > 0) {

				const employees: schemas.Employee[] = aggregationResult.map((doc: Document) => ({
					id: doc.id,
					name: doc.name,
					house_location_id: doc.house_location_id,
					phone_number: doc.phone_number,
					salary: doc.salary,
					syndicate_id: doc.syndicate_id,
					created_at: doc.created_at,
					updated_at: doc.updated_at,
				}));

				return employees;
			} else {
				return null;
			}

		} catch (error) {
			console.error('Error occurred during aggregation:', error);
			return null;
		}
	}

	async readNonTechnicianEmployees(): Promise<schemas.Employee[] | null> {
		const technicianCollection: Collection<schemas.Employee> = this.airport.collection('employee');

		try {
			const aggregationResult = await technicianCollection.aggregate([
			{
				$lookup: {
					from: 'technician',
					localField: '_id',
					foreignField: '_id',
					as: 'technicians',
				},
			},
			{
				$match: {
					technicians: { $eq: [] },
				},
			},
			{
				$project: {
					_id: 0,
					id: '$_id',
					name: 1,
					house_location_id: 1,
					phone_number: 1,
					salary: 1,
					syndicate_id: 1,
					created_at: 1,
					updated_at: 1,
				},
			},
			]).toArray();

			if (aggregationResult.length > 0) {

				const employees: schemas.Employee[] = aggregationResult.map((doc: Document) => ({
					id: doc.id,
					name: doc.name,
					house_location_id: doc.house_location_id,
					phone_number: doc.phone_number,
					salary: doc.salary,
					syndicate_id: doc.syndicate_id,
					created_at: doc.created_at,
					updated_at: doc.updated_at,
				}));

				return employees;
			} else {
				return null;
			}

		} catch (error) {
			console.error('Error occurred during aggregation:', error);
			return null;
		}
	}

	async readSyndicates(): Promise<schemas.Syndicate[] | null> {
		const syndicateCollection: Collection<schemas.Syndicate> = this.airport.collection('syndicate');

		try {
			const result = await syndicateCollection.find().project({ id: '$_id', _id: 0, created_at: 1, updated_at: 1, name: 1 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const syndicates: schemas.Syndicate[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				name: doc.name,
			}));

			return syndicates;
		} catch (error) {
			console.error('Error reading syndicates:', error);
			throw error;
		}
	}

	async readIntegrityTests(): Promise<schemas.IntegrityTest[] | null> {
		const integrityTestCollection: Collection<schemas.IntegrityTest> = this.airport.collection('integrity_test');

		try {
			const result = await integrityTestCollection.find().project({ id: '$_id', _id: 0, created_at: 1, updated_at: 1, name: 1, minimum_score: 1 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const integrityTests: schemas.IntegrityTest[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				name: doc.name,
				minimum_score: doc.minimum_score,
			}));

			return integrityTests;
		} catch (error) {
			console.error('Error reading integrityTests:', error);
			throw error;
		}
	}

	async readLocationsNotAirport(): Promise<schemas.Location[] | null> {
		const locationCollection: Collection<schemas.Location> = this.airport.collection('location');

		try {
			const result = await locationCollection.find({ is_airport: false }).project({ id: '$_id', _id: 0, created_at: 1, updated_at: 1, country_abbreviation: 1, country: 1, state: 1, city: 1, street: 1, number: 1, is_airport: 1 }).toArray();

			if (result.length === 0) {
				return null;
			}

			const locations: schemas.Location[] = result.map((doc: Document) => ({
				id: doc.id,
				created_at: doc.created_at,
				updated_at: doc.updated_at,
				country_abbreviation: doc.country_abbreviation,
				country: doc.country,
				state: doc.state,
				city: doc.city,
				street: doc.street,
				number: doc.number,
				is_airport: doc.is_airport,
			}));

			return locations;
		} catch (error) {
			console.error('Error reading locations:', error);
			throw error;
		}
	}

	async createTechnician(tech: Omit<schemas.Technician, 'created_at' | 'updated_at'>): Promise<void> {
		const technicianCollection = this.airport.collection('technician');

		const technicianDocument = {
			_id: new ObjectId(tech.id),
			created_at: new Date(),
			updated_at: new Date()
		};

		try {
			await technicianCollection.insertOne(technicianDocument);
		} catch (error) {
			console.error('Error creating technician:', error);
			throw error;
		}
	}

	async createEmployee(empl: Omit<schemas.Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ObjectId> {
		const employeeCollection = this.airport.collection('employee');

		const employeeDocument = {
			_id: new ObjectId(),
			created_at: new Date(),
			updated_at: new Date(),
			name: empl.name,
			house_location_id: empl.house_location_id,
			phone_number: empl.phone_number,
			salary: empl.salary,
			syndicate_id: empl.syndicate_id,
		};

		try {
			await employeeCollection.insertOne(employeeDocument);
			return employeeDocument._id;
		} catch (error) {
			console.error('Error creating employee:', error);
			throw error;
		}
	}
}

import { app, server, upload } from './app';
import PostgresService from './database/postgresService';
import MongoService from './database/mongoDBService';
import { ObjectId, ServerApiVersion } from 'mongodb';
import { env } from './env';
import * as schemas from './database/schemas';

// const db = new PostgresService({
// 	host: env.dbHost,
// 	user: env.dbUser,
// 	password: env.dbPassword,
// 	port: env.dbPort,
// 	database: env.dbName
// });

const db = new MongoService({
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	},
});

app.get('/api', async (_req, res) => {
	try {
		const airplaneModels = await db.readAirplaneModels();
		res.json(airplaneModels);
	} catch (error) {
		console.error(error);
	}
});

app.post('/api/airplane', upload.none(), async (req, res) => {
	const modelId = new ObjectId(req.body.model_id);

	const airplane: Omit<schemas.Airplane, 'id' | 'created_at' | 'updated_at'> = {
		model_id: new ObjectId(modelId)
	};

	try {
		await db.createAirplane(airplane);
		res.status(200).json({ message: 'Airplane added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while adding the airplane' });
	}
});

app.post('/api/technician_pro_at_model', upload.none(), async (req, res) => {
	if (req.body.model_id && req.body.employee_id) {

		const modelId = new ObjectId(req.body.model_id);
		const technicianId = new ObjectId(req.body.employee_id);

		const techPro: Omit<schemas.TechnicianProAtModel, 'id' | 'created_at' | 'updated_at'> = {
			airplane_model_id: modelId,
			technician_id: technicianId
		};

		const existantRelation = db.readTechniciansProByAirplaneModelIdAndTechnicianId(technicianId, modelId);

		try {
			if (existantRelation !== null) {
				await db.createTechnicianProAtModel(techPro);
				res.status(200).json({ message: 'Relation added successfully' });
			} else {
				res.status(400).json({ message: 'Technician already Pro at this model' })
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'An error occurred while adding the airplane' });
		}
	}
});

app.post('/api/employeeTechnician', upload.none(), async (req, res) => {
	const name = req.body.name;
	const house_location_id = req.body.house_location_id;
	const phone_number = req.body.phone_number;
	const salary = req.body.salary;
	const syndicate_id = req.body.syndicate_id;

	const empl: Omit<schemas.Employee, 'id' | 'created_at' | 'updated_at'> = {
		name: name,
		house_location_id: new ObjectId(house_location_id),
		phone_number: phone_number,
		salary: salary,
		syndicate_id: new ObjectId(syndicate_id)
	};

	try {
		let technicianId = await db.createEmployee(empl);

		if (technicianId !== null) {
			const tech: Omit<schemas.Technician, 'created_at' | 'updated_at'> = {
				id: new ObjectId(technicianId),
			};

			await db.createTechnician(tech);
			res.status(200).json({ message: 'Employee and technician added successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while adding the employee' });
	}
});

app.post('/api/testMade', upload.none(), async (req, res) => {
	const name = req.body.name;
	const technician_id = req.body.technician_id;
	const airplane_id = req.body.airplane_id;
	const test_id = req.body.test_id;
	const phone_number = req.body.phone_number;
	const salary = req.body.salary;
	const syndicate_id = req.body.syndicate_id;

	const empl: Omit<schemas.TestMade, 'id' | 'created_at' | 'updated_at'> = {
		technician_id: new ObjectId(technician_id),
		integrity_test_id: new ObjectId(test_id),
		airplane_id: new ObjectId(airplane_id),
	};

	try {
		let technicianId = await db.createEmployee(empl);

		if (technicianId !== null) {
			const tech: Omit<schemas.Technician, 'created_at' | 'updated_at'> = {
				id: new ObjectId(technicianId),
			};

			await db.createTechnician(tech);
			res.status(200).json({ message: 'Employee and technician added successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while adding the employee' });
	}
});

app.post('/api/technician', upload.none(), async (req, res) => {
	const technicianId = new ObjectId(req.body.employee_id);

	const tech: Omit<schemas.Technician, 'created_at' | 'updated_at'> = {
		id: technicianId
	};

	const existantTechnician = db.readTechnicianById(technicianId);

	try {
		if (existantTechnician !== null) {
			await db.createTechnician(tech);
			res.status(200).json({ message: 'Relation added successfully' });
		} else {
			res.status(400).json({ message: 'Technician already Pro at this model' })
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while adding the airplane' });
	}
});

app.get('/api/airplaneModel/:modelId', async (req, res) => {
	const modelId: ObjectId = new ObjectId(req.params.modelId);

	try {
		const airplaneModel = await db.readAirplaneModelById(modelId);
		res.json(airplaneModel);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/completeAirplaneModel/:modelId', async (req, res) => {
	const modelId = new ObjectId(req.params.modelId);
	try {
		const airplaneModel = await db.getAirplaneModelWithTechsAndAirplanesById(modelId);
		res.json(airplaneModel);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/api/airplaneModel', upload.single('image_path'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'Image upload failed' });
		}

		const { capacity, weight, code } = req.body;

		if (isNaN(capacity) || isNaN(weight) || !code) {
			return res.status(400).json({ error: 'Invalid data submitted' });
		}

		const image_path = req.file.filename;

		const existingModels = await db.checkDuplicateAirplaneModel(code, image_path);

		if (existingModels && existingModels.some((record) => record.code === code || record.image_path === image_path)) {
			res.status(400).json({
				code: existingModels.some((record) => record.code === code),
				image_path: existingModels.some((record) => record.image_path === image_path),
			});

			return;
		}

		const airplaneModel: Omit<schemas.AirplaneModel, 'id' | 'created_at' | 'updated_at'> = {
			capacity: parseInt(capacity),
			weight: parseInt(weight),
			code: code,
			image_path: image_path,
		};

		await db.createAirplaneModel(airplaneModel);

		res.status(200).json({ message: 'Model added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while adding the model' });
	}
});

app.put('/api/airplaneModel/', upload.single('image_path'), async (req, res) => {
	try {
		const modelId = req.body.id as ObjectId;

		const modelExists = await db.readAirplaneModelById(modelId);

		if (!modelExists) {
			return res.status(404).json({ error: 'Model not found' });
		}

		if (!req.file) {
			return res.status(400).json({ error: 'Image upload failed' });
		}

		const { capacity, weight, code } = req.body;

		if (isNaN(capacity) || isNaN(weight) || !code) {
			return res.status(400).json({ error: 'Invalid data submitted' });
		}

		const image_path = req.file.filename;

		let existingModels = await db.checkDuplicateAirplaneModel(code, image_path);

		if (existingModels) {
			existingModels = existingModels.filter((model) => model.id !== modelExists.id);
		}

		if (
			existingModels && existingModels.some((record) =>
				(record.code === code || record.image_path === image_path) &&
				record.id !== modelId
			)
		) {
			res.status(400).json({
				code: existingModels.some((record) => record.code === code),
				image_path: existingModels.some((record) => record.image_path === image_path),
			});

			return;
		}

		const updatedModel: Omit<schemas.AirplaneModel, 'id' | 'created_at' | 'updated_at'> = {
			capacity: parseInt(capacity),
			weight: parseInt(weight),
			code: code,
			image_path: image_path,
		};
		await db.updateAirplaneModelById(modelId, updatedModel.capacity, updatedModel.weight, updatedModel.image_path);

		res.status(200).json({ message: 'Model updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred while updating the model' });
	}
});

app.delete('/api/airplaneModel/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);

	try {
	  await db.deleteAirplaneModelById(id);
	  res.status(204).send();
	} catch (error) {
	  console.error(error);
	  res.status(500).send('Erro ao deletar modelo');
	}
});

app.get('/api/staff', async (_req, res) => {
	try {
		const airplaneModels = await db.readEmployees();
		res.json(airplaneModels);
	} catch (error) {
		console.error(error);
	}
});

app.get('/api/airplane/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);

	try {
		const airplane = await db.readAirplaneById(id);
		res.json(airplane);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/airplane/', async (_req, res) => {
	try {
		const airplane = await db.readAirplanes();
		res.json(airplane);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/completeTest/:testId', async (req, res) => {
	const id = new ObjectId(req.params.testId);

	try {
		const completeTest = await db.readCompleteTest(id);
		res.status(200).json(completeTest);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/completeAirplane/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);
	try {
		const airplane = await db.readAirplaneFlightAndTestsById(id);
		res.json(airplane);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/completeAirplane/', async (_req, res) => {
	try {
		const airplanes = await db.readAirplanes();
		let airplanesComplete: schemas.AirplaneFlightAndTests[] = [];
		if (airplanes) {
			for (let i = 0; i < airplanes.length; i++) {
				const airplane = await db.readAirplaneFlightAndTestsById(airplanes[i].id);
				if (airplane) {
					airplanesComplete[i] = airplane;
					airplanesComplete[i].airplane_id = airplanes[i].id;
				}
			}
		}
		res.json(airplanesComplete);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/completeTechnician/', async (_req, res) => {
	try {
		const technicians = await db.readTechnicians();

		let techniciansComplete: schemas.TechnicianInfoWithTestsAndModels[] = [];
		if (technicians) {
			for (let i = 0; i < technicians.length; i++) {
				const technician = await db.readTechnicianDataAndTestsAndModelsByTechnicianId(technicians[i].technician_id);
				if (technician) {
					techniciansComplete[i] = technician;
				}
			}
		}
		res.json(techniciansComplete);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/completeTechnician/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);
	try {
		const technician = await db.readTechnicianDataAndTestsAndModelsByTechnicianId(id);
		res.json(technician);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/flight/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);
	try {
		const flight = await db.readFlightById(id);
		res.json(flight);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/location/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);
	try {
		const location = await db.readLocationById(id);
		res.json(location);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/employee/:id', async (req, res) => {
	const id = new ObjectId(req.params.id);
	try {
		const location = await db.readEmployeeById(id);
		res.json(location);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/modelsAndEmployees', async (req, res) => {
	try {
		const models = await db.readAirplaneModels();
		const technicians = await db.readTechnicianEmployees();

		const modelsAndEmployees: schemas.AirplaneModelsAndEmployees = {
			models: models ? models : [],
			employees: technicians ? technicians : [],
		};

		res.json(modelsAndEmployees);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/employeesTechnician', async (_req, res) => {
	try {
		const technicians = await db.readTechnicianEmployees();

		res.json(technicians);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/integrityTests', async (_req, res) => {
	try {
		const tests = await db.readIntegrityTests();

		res.json(tests);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/employeesNotTechnician', async (_req, res) => {
	try {
		const employees = await db.readNonTechnicianEmployees();
		res.json(employees);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/syndicate', async (req, res) => {
	try {
		const syndicates = await db.readSyndicates();

		res.json(syndicates);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/locationNotAirports', async (req, res) => {
	try {
		const locations = await db.readLocationsNotAirport();
		res.json(locations);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

process.on('exit', () => {
	server.close();
	db.close();
});

import { app, server } from './app';
import PostgresService from './database/postgresService';
import { env } from './env';

const db = new PostgresService({
	host: env.dbHost,
	user: env.dbUser,
	password: env.dbPassword,
	port: env.dbPort,
	database: env.dbName
});

app.get('/api', async (_req, res) => {
	try {
		const airplaneModels = await db.readAirplaneModels();
		res.json(airplaneModels);
	} catch (error) {
		console.log(error);
	}
});

app.get('/api/staff', async (_req, res) => {
	try {
		const airplaneModels = await db.readEmployees();
		res.json(airplaneModels);
	} catch (error) {
		console.log(error);
	}
});

app.get('/api/airplane', async (_req, res) => {
	try {
		const airplanes = await db.readAirplanes();
		res.json(airplanes);
	} catch (error) {
		console.log(error);
	}
});

process.on('exit', () => {
	db.close();
	server.close();
});

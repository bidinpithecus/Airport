import express from 'express';
import { env } from './env';
import cors from 'cors';
const app = express();

app.use(
	cors({
		origin: `http://${env.clientHost}:${env.clientPort}`,
	})
);

const server = app.listen(env.serverPort, env.serverHost, () => {
	console.log(`App running on http://${env.serverHost}:${env.serverPort}`);
});

export { app, server};

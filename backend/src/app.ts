import express from 'express';
import { env } from './env';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();

app.use(
	cors({
		origin: `http://${env.clientHost}:${env.clientPort}`,
	}),
	express.json()
);

const storage = multer.diskStorage({
	destination: path.join(__dirname, '../../frontend/public'),
	filename: (_req, file, cb) => {
		const originalName = file.originalname;
		cb(null, originalName);
	},
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, '../../frontend/public')));

const server = app.listen(env.serverPort, env.serverHost, () => {
	console.log(`App running on http://${env.serverHost}:${env.serverPort}`);
});

export { app, server, upload };

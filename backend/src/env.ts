import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function getEnv(envVar: string): string {
	if (process.env[envVar] === undefined) {
		throw new Error(`Error getting ${envVar} environment variable. Add it properly on the .env file`);
	}
	return process.env[envVar] as string;
}

export const env = {
	dbUser: getEnv('DATABASE_USER'),
	dbPassword: getEnv('DATABASE_PASSWORD'),
	dbHost: getEnv('DATABASE_HOST'),
	dbPort: parseInt(getEnv('DATABASE_PORT')),
	dbName: getEnv('DATABASE_NAME'),

	serverHost: getEnv('SERVER_HOST'),
	serverPort: parseInt(getEnv('SERVER_PORT')),

	clientHost: getEnv('CLIENT_HOST'),
	clientPort: parseInt(getEnv('CLIENT_PORT')),
};

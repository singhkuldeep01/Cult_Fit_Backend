import dotenv from 'dotenv';

export function loadEnv(){
    dotenv.config(); // Load environment variables from .env file
}

type ServerConfig = {
    port: number;
    env: string;
}

export const serverConfig: ServerConfig = {
    port: Number(process.env.PORT) || 3000, // Default to 3000 if PORT is not set
    env: process.env.NODE_ENV || 'development',
}
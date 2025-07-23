import dotenv from 'dotenv';

function loadEnv(){
    dotenv.config(); // Load environment variables from .env file
}

loadEnv(); // Call the function to load environment variables

type ServerConfig = {
    port: number;
    env: string;
}

export const serverConfig: ServerConfig = {
    port: Number(process.env.PORT) || 3000, // Default to 3000 if PORT is not set
    env: process.env.NODE_ENV || 'development',
}
import express, { Request, Response } from 'express';
import {loadEnv , serverConfig} from './config';


const app = express();
loadEnv(); // Load environment variables

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.listen(serverConfig.port, () => {
  console.log(`Server is running on http://localhost:${serverConfig.port}`);
});

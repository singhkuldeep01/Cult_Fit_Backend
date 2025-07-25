import express, { Request, Response , NextFunction } from 'express';
import { serverConfig} from './config';
import pingRouter from './router/ping.router';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use(pingRouter); // Use the ping router

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});


app.use(errorHandler);

app.listen(serverConfig.port, () => {
  console.log(`Server is running on http://localhost:${serverConfig.port}`);
});

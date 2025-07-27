
import express from 'express';
import { pingController } from '../controller/ping.controller';
const pingRouter = express.Router();


pingRouter.get('/ping', pingController);

export default pingRouter;
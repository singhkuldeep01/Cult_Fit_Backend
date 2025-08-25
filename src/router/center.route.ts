import { Router } from "express";
import { createGymCenterController, deleteGymCenterController, getGymCentersController } from "../controller/gymCenter.controller";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { createGymCenterSchema } from "../validations/center.validation";
import { authorizeHost } from "../middleware/authorizeHost.middleware";
const router = Router();


    router.get('/', authenticateUser, getGymCentersController);
    router.post('/', authenticateUser, authorizeHost, validateZodSchema(createGymCenterSchema),  createGymCenterController);
    router.delete('/:id', authenticateUser, authorizeHost, deleteGymCenterController);

export default router;
import { Router } from "express";
import { createGymCenterController, deleteGymCenterController, getGymCentersController, updateGymCenterController } from "../controller/gymCenter.controller";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { createGymCenterSchema, updateGymCenterSchema } from "../validations/center.validation";
import { authorizeGymHost } from "../middleware/authorizeGymHost.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";
const router = Router();


    router.get('/', authenticateUser, getGymCentersController);
    router.post('/', authenticateUser, authorizeRole("HOST"), validateZodSchema(createGymCenterSchema),  createGymCenterController);
    router.delete('/:id', authenticateUser, authorizeRole("HOST"), authorizeGymHost, deleteGymCenterController);
    router.put('/:id', authenticateUser, authorizeRole("HOST"), authorizeGymHost, validateZodSchema(updateGymCenterSchema), updateGymCenterController);

export default router;
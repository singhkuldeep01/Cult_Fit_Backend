import { Router } from "express";
import { createGymCenterController, deleteGymCenterController, getGymCentersController } from "../controller/gymCenter.controller";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { createGymCenterSchema } from "../validations/center.validation";
const router = Router();


router.get('/', authenticateUser, getGymCentersController);
router.post('/', validateZodSchema(createGymCenterSchema), authenticateUser, createGymCenterController);
router.delete('/:id', authenticateUser, deleteGymCenterController);

export default router;
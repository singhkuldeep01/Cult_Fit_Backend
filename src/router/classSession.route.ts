import { Router } from "express";
import { createClassSessionController } from "../controller/classSession.controller";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { createClassSessionSchema } from "../validations/class.validation";
import {authorizeRole } from "../middleware/authorizeRole.middleware";
const router = Router();

router.post('/' , authenticateUser, authorizeRole("HOST"), validateZodSchema(createClassSessionSchema), createClassSessionController);

export default router;
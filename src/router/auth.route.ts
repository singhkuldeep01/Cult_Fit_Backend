import { Router } from "express";
import { registerUserController } from "../controller/auth.controller";
import { registerUserSchema } from "../validations/registerUser.validation";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
const router = Router();

router.post('/signup' , validateZodSchema(registerUserSchema) , registerUserController )

export default router;
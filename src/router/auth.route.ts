import { Router } from "express";
import { loginUserController, registerUserController } from "../controller/auth.controller";
import { loginUserSchema, registerUserSchema } from "../validations/registerUser.validation";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
const router = Router();

router.post('/signup' , validateZodSchema(registerUserSchema) , registerUserController )
router.post('/login' , validateZodSchema(loginUserSchema) , loginUserController)

export default router;
import { Router } from "express";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";
import { authorizeGymHost } from "../middleware/authorizeGymHost.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { createHolidaySchema } from "../validations/holiday.validation";
import { createHolidayController } from "../controller/centerHoliday.controller";

const router = Router();

router.post("/", authenticateUser , authorizeRole('HOST') , authorizeGymHost , validateZodSchema(createHolidaySchema) , createHolidayController)

export default router;
import { Router } from "express";
import { createClassTemplateController, getAllClassTemplatesController } from "../controller/classTemplate.controller";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { centerIdSchema, createClassTemplateSchema } from "../validations/class.validation";
import { authorizeGymHost } from "../middleware/authorizeGymHost.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";
const router  = Router();

router.post("/", authenticateUser,authorizeRole("HOST"), authorizeGymHost, validateZodSchema(createClassTemplateSchema), createClassTemplateController);
router.get("/", authenticateUser, authorizeRole("HOST"), authorizeGymHost, validateZodSchema(centerIdSchema), getAllClassTemplatesController);

export default router;
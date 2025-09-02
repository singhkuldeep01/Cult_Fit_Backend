import { Router } from "express";
import { createClassTemplateController } from "../controller/classTemplate.controller";
import { authenticateUser } from "../middleware/authenticateUser.middleware";
import validateZodSchema from "../middleware/validateZodSchema.middleware";
import { createClassTemplateSchema } from "../validations/class.validation";
import { authorizeGymHost } from "../middleware/authorizeGymHost.middleware";
import { authorizeRole } from "../middleware/authorizeRole.middleware";
const router  = Router();

router.post("/:center_id", authenticateUser,authorizeRole("HOST"), authorizeGymHost, validateZodSchema(createClassTemplateSchema), createClassTemplateController);

export default router;
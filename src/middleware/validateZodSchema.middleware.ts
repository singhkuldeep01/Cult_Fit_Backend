import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
export const validateZodSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten(),
      });
      return; // ✅ Important: stop here
    }

    req.body = result.data;
    next();
  };
};
export default validateZodSchema;
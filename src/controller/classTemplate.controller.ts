import { NextFunction, Request , Response ,  } from "express";
import { createClassTemplateService } from "../services/classTemplate.service";
import { createClassTemplateSchema } from "../validations/class.validation";

export const createClassTemplateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const center_id = Number(req.params.center_id || req.params.id);

    const body= {
        name: req.body.name,
        description: req.body.description,
        capacity: req.body.capacity,
        center_id : center_id
    }
    const result = await createClassTemplateService(body);
    res.status(201).json({
        success: true,
        data: result
    });
  } catch (err) {
    next(err);
  }
};

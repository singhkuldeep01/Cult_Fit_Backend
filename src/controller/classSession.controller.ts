
import { Request , Response, NextFunction } from "express"
import { createClassSessionService } from "../services/classSession.service";

export const createClassSessionController = async(req: Request , res: Response, next: NextFunction)=>{
  try {
    const body = {
      startDateTime : req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      template_id: req.body.template_id,
      center_id: req.body.center_id,
    }
    const classSession = await createClassSessionService(body);

    // console.log(body);
    res.status(201).json(classSession);
  } catch (error) {
    next(error);
  }
};
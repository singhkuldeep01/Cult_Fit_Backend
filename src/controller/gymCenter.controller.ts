import { Request , Response , NextFunction } from "express";
import { createGymCenterService, deleteGymCenterService, getGymCentersService } from "../services/gymCenters.service";
import { gymCenterRepository } from "../repository/gymCenter.repository";
import { error } from "console";
import { CreateGymCenterInputDto } from "../dto/center.dto";


export const getGymCentersController = async (req: Request, res: Response , next : NextFunction) => {
  try {
    const result = await getGymCentersService(Number(req.body.user_id));
    res.status(200).json({
        success: true,
        data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const createGymCenterController = async (req: Request, res: Response, next: NextFunction) => {
try {
    const body = {
        center_name: req.body.center_name,
        location: req.body.location,
        contact_no: req.body.contact_no,
        manager_id: req.body.user_id,
    };
    console.log(body);
    const result = await createGymCenterService(body);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteGymCenterController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteGymCenterService(Number(req.params.id) , Number(req.body.user_id));
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

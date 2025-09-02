import { Request , Response , NextFunction } from "express";

import { ForbiddenError } from "../utils/errors/app.error";
import { gymCenterRepository } from "../repository/gymCenter.repository";

export const authorizeGymHost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.user_id) throw new ForbiddenError("Unauthorized: user not found");

    const center_id = Number(req.params.center_id || req.params.id || req.body.center_id);
    if (!center_id || isNaN(center_id)) throw new ForbiddenError("Invalid center_id");

    const gymCenter = await gymCenterRepository.getGymCentersById(center_id);
    if (!gymCenter) throw new ForbiddenError("Gym center not found");

    if (gymCenter.manager_id !== req.user.user_id) {
      throw new ForbiddenError("You are not authorized to manage this gym center");
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

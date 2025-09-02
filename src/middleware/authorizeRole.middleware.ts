
import { ForbiddenError } from "../utils/errors/app.error";
import {Request, Response, NextFunction} from "express";
import { UserRepository } from "../repository/user.repository";
const userRepository = new UserRepository();

export const authorizeRole = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.user_id) {
        throw new ForbiddenError("Unauthorized: user not found");
      }
      const userRoles = await userRepository.getUserRoleWithId(req.user.user_id);

      const hasRole = userRoles?.roles.some(r => r.role.role_name === requiredRole);

      if (!hasRole) {
        throw new ForbiddenError(`Only users with ${requiredRole} role can perform this operation`);
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

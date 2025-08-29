import { Request , Response , NextFunction } from "express"
import { UserRepository } from "../repository/user.repository";
import { ForbiddenError } from "../utils/errors/app.error";
import { gymCenterRepository } from "../repository/gymCenter.repository";
const userRepository = new UserRepository();
export const authorizeHost = async(req: Request, res: Response, next: NextFunction)=>{
    const user_id = req.user.user_id;
    const center_id = Number(req.params.id);

    const userRoles = await userRepository.getUserRoleWithId(user_id);

    const isHost = userRoles?.roles.some(role => role.role.role_name === "HOST");
    if (!isHost) {
        throw new ForbiddenError("Only user with Host role is allowed to perform this operation");
    }
    if(center_id) {
        const getGymCenter = await gymCenterRepository.getGymCentersById(center_id);
        if (!getGymCenter || getGymCenter.manager_id !== user_id) {
            throw new ForbiddenError("You are not authorized to access this gym center");
        }
    }
    next();
}
import { NotFoundError } from "../utils/errors/app.error";

import { gymCenterRepository } from "../repository/gymCenter.repository";
import { CreateGymCenterInputDto } from "../dto/center.dto";
import { UserRepository } from "../repository/user.repository";

const userRepository = new UserRepository();

export const getGymCentersService = async (user_id : number) => {
    const gymCenters = await gymCenterRepository.getGymCentersByManagerId(user_id);
    return {
        success: true,
        data: gymCenters,
    };
};

export const createGymCenterService = async (data: CreateGymCenterInputDto) => {
    const userRoles = await userRepository.getUserRoleWithId(data.manager_id);

    const isHost = userRoles?.roles.some(role => role.role.role_name === "HOST");
    if (!isHost) {
        throw new NotFoundError("Only users with HOST role can create a gym center");
    }
    const newGymCenter = await gymCenterRepository.createGymCenter({
        center_name: data.center_name,
        location: data.location,
        contact_no: data.contact_no,
        manager_id: data.manager_id,
    });
    return {
        success: true,
        data: newGymCenter,
    };
};

export const deleteGymCenterService = async (id: number , user_id : number) => {
    const getGymCenter = await gymCenterRepository.getGymCentersById(id);
    if (!getGymCenter) {
        throw new NotFoundError("Gym center not found");
    }
    const allGymCenters = await gymCenterRepository.getGymCentersByManagerId(user_id);
    const isManager = allGymCenters?.some(center => center.manager_id === user_id);
    if (!isManager) {
        throw new NotFoundError("You are not authorized to delete this gym center");
    }
    const deletedGymCenter = await gymCenterRepository.deleteGymCenter(id);
    return {
        success: true,
        data: deletedGymCenter,
    };
};


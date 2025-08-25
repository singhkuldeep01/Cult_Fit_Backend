import { ForbiddenError, NotFoundError } from "../utils/errors/app.error";

import { gymCenterRepository } from "../repository/gymCenter.repository";
import { CreateGymCenterInputDto } from "../dto/center.dto";


export const getGymCentersService = async (user_id : number) => {
    const gymCenters = await gymCenterRepository.getGymCentersByManagerId(user_id);
    return {
        success: true,
        data: gymCenters,
    };
};

export const createGymCenterService = async (data: CreateGymCenterInputDto) => {
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
    
    // Fix: Check if the specific center belongs to the user
    if (getGymCenter.manager_id !== user_id) {
        throw new ForbiddenError("You are not authorized to delete this gym center");
    }
    
    const deletedGymCenter = await gymCenterRepository.deleteGymCenter(id);
    return {
        success: true,
        data: deletedGymCenter,
    };
};



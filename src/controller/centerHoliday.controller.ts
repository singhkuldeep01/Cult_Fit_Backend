import { Request , Response , NextFunction } from "express";
import { createHolidayService } from "../services/holiday.service";

export const createHolidayController = async(req : Request , res : Response , next : NextFunction) => {
    try {
        const holiday = await createHolidayService(req.body);
        res.status(201).json(holiday);
    } catch (error) {
        next(error);
    }
}   
import { Request , Response , NextFunction } from "express"
import { registerUserService } from "../services/auth.service";
export const registerUserController = async(req : Request , res : Response , next : NextFunction)=>{
    try{
        const result = await registerUserService(req.body);
        res.status(201).json({
            message : "User registered successfully",
            user : result
        });
    }catch(err){
        next(err);
    }
}
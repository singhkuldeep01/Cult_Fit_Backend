import { z } from "zod";

export const createGymCenterSchema = z.object({
    center_name: z.string().min(2).max(100),
    location: z.string().min(2).max(100),
    contact_no: z.string().min(10).max(15),
});

export const updateGymCenterSchema = z.object({
    center_name: z.string().min(2).max(100).optional(),
    location: z.string().min(2).max(100).optional(),
    contact_no: z.string().min(10).max(15).optional(),
});

export type CreateGymCenterInput = z.infer<typeof createGymCenterSchema>;
export type UpdateGymCenterInput = z.infer<typeof updateGymCenterSchema>;

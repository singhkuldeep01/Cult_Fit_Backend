import { z } from "zod";

export const createGymCenterSchema = z.object({
    center_name: z.string().min(2).max(100),
    location: z.string().min(2).max(100),
    contact_no: z.string().min(10).max(15),
});

export type CreateGymCenterInput = z.infer<typeof createGymCenterSchema>;

import { z } from "zod";

export const createGymCenterSchema = z.object({
    center_name: z.string().min(2).max(100),
    location: z.string().min(2).max(100),
    contact_no: z.string().min(10).max(15),
});


export const updateGymCenterSchema = z
  .object({
    center_name: z.string().min(2).max(100).optional(),
    location: z.string().min(2).max(100).optional(),
    contact_no: z.string().min(10).max(15).optional(),
  })
  .strict() // 🚫 no unknown keys allowed
  .refine(
    (data) =>
      data.center_name !== undefined ||
      data.location !== undefined ||
      data.contact_no !== undefined,
    {
      message: "At least one field must be provided",
      path: ["center_name", "location", "contact_no"], // 👈 point to fields
    }
  );


export type CreateGymCenterInput = z.infer<typeof createGymCenterSchema>;
export type UpdateGymCenterInput = z.infer<typeof updateGymCenterSchema>;

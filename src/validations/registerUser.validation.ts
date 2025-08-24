import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  phone_no: z.string().min(10).max(16).optional(),
  password: z.string().min(6).max(100),
  role_id: z.number().min(1).max(4)
});


export type RegisterUserInput = z.infer<typeof registerUserSchema>;
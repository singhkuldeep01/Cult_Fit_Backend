import z from "zod";

export const createClassTemplateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  capacity: z.number().min(1).optional(),
  center_id: z.number().min(1)
});

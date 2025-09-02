import { z } from "zod";


export const createClassTemplateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500).optional(),
  capacity: z.number().min(1).max(50),
});



export const createClassSessionSchema = z.object({
  startDateTime: z.coerce.date().refine(
    (date) => {
      const now = new Date();
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 3); // within 3 months
      return date >= now && date <= maxDate;
    },
    { message: "Start date must be within the next 3 months." }
  ),

  endDateTime: z.coerce.date(),

  template_id: z.coerce.number().min(1),
  center_id: z.coerce.number().min(1),
})
.refine(
  (data) => data.endDateTime > data.startDateTime,
  {
    message: "End time must be after start time.",
    path: ["endDateTime"],
  }
)
.refine(
  (data) => {
    const durationInMinutes = 
      (data.endDateTime.getTime() - data.startDateTime.getTime()) / 60000;
    return durationInMinutes === 50;
  },
  {
    message: "Class duration must be exactly 50 minutes.",
    path: ["endDateTime"],
  }
);



export type createClassTemplateInput = z.infer<typeof createClassTemplateSchema>;
export type createClassSessionInput = z.infer<typeof createClassSessionSchema>;

import z from "zod";

export const createHolidaySchema = z.object({
    center_id: z.number().min(1),
    name: z.string().min(2).max(100),
    holidayDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid holiday date format",
    }),
})
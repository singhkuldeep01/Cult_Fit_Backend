import { BadRequestError } from "../utils/errors/app.error";
import { HolidayRepository } from "../repository/holiday.repository";
const holidayRepo = new HolidayRepository();
import { createHolidayDto } from "../dto/holiday.dto";

export const createHolidayService = async (data: createHolidayDto) => {
  const { center_id, name, holidayDate } = data;

  if (!center_id || !name || !holidayDate) {
    throw new BadRequestError("center_id, name and holidayDate are required");
  }

  if (typeof holidayDate !== "string") {
    throw new BadRequestError("holidayDate must be in 'YYYY-MM-DD' format as string");
  }

  const [year, month, day] = (holidayDate as string).split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day); // Create date in UTC

  // Adjust to IST (UTC+5:30)
  parsedDate.setHours(parsedDate.getHours() + 5, parsedDate.getMinutes() + 30);

  if (isNaN(parsedDate.getTime())) {
    throw new BadRequestError("Invalid holidayDate. Use 'YYYY-MM-DD'");
  }

  const isHoliday = await holidayRepo.isHoliday(center_id, parsedDate);
  if (isHoliday) {
    throw new BadRequestError("Holiday already exists for this date.");
  }

  return await holidayRepo.createHoliday({ center_id, name, holidayDate: parsedDate });
};

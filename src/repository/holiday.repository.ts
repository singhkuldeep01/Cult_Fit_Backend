import { center_holiday , Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import { createHolidayDto } from "../dto/holiday.dto";

export class HolidayRepository {
    async createHoliday(data: createHolidayDto): Promise<center_holiday> {
        return prisma.center_holiday.create({
            data
        });
    }

    async getHolidaysByCenterId(center_id: number): Promise<center_holiday[]> {
        return prisma.center_holiday.findMany({
            where: { center_id }
        });
    }

    async isHoliday(center_id: number, date: Date) {
        const holiday = await prisma.center_holiday.findFirst({
            where: {
                center_id,
                holidayDate: date
            }
        });
        return holiday;
    }

}
import { center_holiday } from "@prisma/client";
import { prisma } from "../prisma/client";

export class HolidayRepository {
    async createHoliday(data: { name: string; center_id: number; startDate: Date; endDate: Date; }): Promise<center_holiday> {
        return prisma.center_holiday.create({
            data
        });
    }

    async getHolidaysByCenterId(center_id: number): Promise<center_holiday[]> {
        return prisma.center_holiday.findMany({
            where: { center_id }
        });
    }

    async isHoliday(center_id: number, date: Date): Promise<boolean> {
        const holiday = await prisma.center_holiday.findFirst({
            where: {
                center_id,
                startDate: { lte: date },
                endDate: { gte: date }
            }
        });
        return holiday !== null;
    }
}
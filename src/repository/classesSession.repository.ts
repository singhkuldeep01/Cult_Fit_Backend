import { CreateClassSessionDTO } from "../dto/class.dto";
import { prisma } from "../prisma/client";
import { ClassSession } from "@prisma/client";

export class ClassSessionRepository {
  async createClassSession(data: CreateClassSessionDTO): Promise<ClassSession> {
    return prisma.classSession.create({
      data: {
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        template: { connect: { id: data.template_id } },
        center: { connect: { center_id: data.center_id } },
      },
    });
  }


  // async getClassSessionsByDate(center_id: number, date: Date): Promise<ClassSession[]> {
  //   const startOfDay = new Date(date);
  //   startOfDay.setHours(0, 0, 0, 0);

  //   const endOfDay = new Date(date);
  //   endOfDay.setHours(23, 59, 59, 999);

  //   return prisma.classSession.findMany({
  //     where: {
  //       center_id,
  //       startDateTime: {
  //         gte: startOfDay,
  //         lte: endOfDay,
  //       },
  //     },
  //   });
  // }

  async getOverlappingClassSession(
    center_id: number,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<ClassSession | null> {
    return prisma.classSession.findFirst({
      where: {
        center_id,
        AND: [
          { startDateTime: { lt: endDateTime } },  // existing starts before new ends
          { endDateTime: { gt: startDateTime } },  // existing ends after new starts
        ],
      },
    });
  }

  // async updateClassSession(
  //   id: number,
  //   data: Partial<ClassSession>
  // ): Promise<ClassSession> {
  //   return prisma.classSession.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // async deleteClassSession(id: number): Promise<ClassSession> {
  //   return prisma.classSession.delete({
  //     where: { id },
  //   });
  // }

  // async getAllClassSessionsByTemplateId(template_id: number): Promise<ClassSession[]> {
  //   return prisma.classSession.findMany({
  //     where: { template_id },
  //   });
  // }

  async getAllUpcomingClassSessionsByCenterId(center_id: number): Promise<ClassSession[]> {
    return prisma.classSession.findMany({
      where: {
        center_id,
        startDateTime: {
          gte: new Date(),
        },
      },
    });
  }

  async getAllClassSessionsByCenterId(center_id: number): Promise<ClassSession[]> {
    return prisma.classSession.findMany({
      where: { center_id },
    });
  }
}

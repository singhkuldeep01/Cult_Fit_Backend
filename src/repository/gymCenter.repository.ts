import { prisma } from "../prisma/client";
import { Prisma, gym_center } from "@prisma/client";

class GymCenterRepository {
  async createGymCenter(data: {
    center_name: string;
    location: string;
    contact_no: string;
    manager_id: number;
  }): Promise<gym_center> {
    return prisma.gym_center.create({
      data: {
        center_name: data.center_name,
        location: data.location,
        contact_no: data.contact_no,
        manager: {
          connect: { user_id: data.manager_id }, // ✅ connect to existing user
        },
      },
    });
  }

  async getGymCentersByManagerId(id: number): Promise<gym_center[] | null> {
    return await prisma.gym_center.findMany({
      where: { manager_id: id },
    });
  }

  async getGymCentersById(id: number): Promise<gym_center | null> {
    return await prisma.gym_center.findUnique({
      where: { center_id: id },
    });
  }

  async updateGymCenter(
    id: number,
    data: Prisma.gym_centerUpdateInput
  ): Promise<gym_center> {
    return prisma.gym_center.update({
      where: { center_id: id },
      data,
    });
  }

  async deleteGymCenter(id: number): Promise<gym_center> {
    return prisma.gym_center.delete({
      where: { center_id: id },
    });
  }
}

export const gymCenterRepository = new GymCenterRepository();

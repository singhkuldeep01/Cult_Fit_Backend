import { prisma } from "../prisma/client";
import { Prisma, ClassTemplate } from "@prisma/client";
import { CreateClassTemplateDTO } from "../dto/class.dto";

export class ClassTemplateRepository {
  async createClassTemplate(data: CreateClassTemplateDTO): Promise<ClassTemplate> {
    return prisma.classTemplate.create({
       data: {
         name: data.name,
         description: data.description,
         capacity: data.capacity,
         center: {
           connect: {
             center_id: data.center_id,
           },
         },
      },
    });
  }

  async getClassTemplateById(id: number , center_id: number): Promise<ClassTemplate | null> {
    return prisma.classTemplate.findUnique({
      where: { id, center_id },
    });
  }

  async updateClassTemplate(id: number, data: Prisma.ClassTemplateUpdateInput): Promise<ClassTemplate> {
    return prisma.classTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteClassTemplate(id: number): Promise<ClassTemplate> {
    return prisma.classTemplate.delete({
      where: { id },
    });
  }

  async getAllClassTemplatesByCenterId(center_id: number): Promise<ClassTemplate[]> {
    return prisma.classTemplate .findMany({
      where: { center_id },
    });
  }
}

import { CreateClassTemplateDTO } from "../dto/class.dto";
import { ClassTemplateRepository } from "../repository/classesTemplate.repository";

const classTemplateRepository = new ClassTemplateRepository();

export const createClassTemplateService = async (data: CreateClassTemplateDTO) => {
  const classTemplate = await classTemplateRepository.createClassTemplate(data);
  return classTemplate;
};

export const getAllClassTemplateService = async (centerId: number) => {
  const classTemplates = await classTemplateRepository.getAllClassTemplatesByCenterId(centerId);
  return classTemplates;
};
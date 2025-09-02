import { ClassSessionRepository } from "../repository/classesSession.repository";
import { CreateClassSessionDTO } from "../dto/class.dto";
import { ClassTemplateRepository } from "../repository/classesTemplate.repository";
import { NotFoundError, BadRequestError } from "../utils/errors/app.error";
import { ClassValidation } from "../utils/classValidtations";

const classValidation = new ClassValidation();
const classSessionRepository = new ClassSessionRepository();
const classTemplateRepository = new ClassTemplateRepository();

export const createClassSessionService = async (data: CreateClassSessionDTO) => {
    const { center_id, template_id} = data;
    const startDateTime = data.startDateTime;
    const endDateTime = data.endDateTime;

    const template = await classTemplateRepository.getClassTemplateById(template_id , center_id);
    if(!template) {
      throw new NotFoundError("Class template not found");
    }
    await classValidation.isValidClassSession(center_id, startDateTime, endDateTime);
    const classSession = classSessionRepository.createClassSession(data);
    return classSession;
};

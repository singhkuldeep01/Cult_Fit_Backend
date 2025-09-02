import { ClassSessionRepository } from "../repository/classesSession.repository";
import { CreateClassSessionDTO } from "../dto/class.dto";
import { ClassTemplateRepository } from "../repository/classesTemplate.repository";
import { NotFoundError, BadRequestError } from "../utils/errors/app.error";

const classSessionRepository = new ClassSessionRepository();
const classTemplateRepository = new ClassTemplateRepository();

export const createClassSessionService = async (data: CreateClassSessionDTO) => {
  
};

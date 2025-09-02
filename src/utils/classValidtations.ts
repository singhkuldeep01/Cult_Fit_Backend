import { ClassSessionRepository } from "../repository/classesSession.repository";
import { HolidayRepository } from "../repository/holiday.repository";

const holidayRepo = new HolidayRepository();
const classSessionRepo = new ClassSessionRepository();


export class ClassValidation {

      private isValidDateString(value: string): boolean {
    const d = new Date(value);
    return !isNaN(d.getTime());
  }
    async isOverlapping(center_id: number, startDateTime: Date, endDateTime: Date){
        return classSessionRepo.getOverlappingClassSession(center_id, startDateTime, endDateTime);
    }
 async isValidClassSession(center_id: number, startDateTime: string, endDateTime: string) {
  // 1. Validate ISO string format
  if (!this.isValidDateString(startDateTime) || !this.isValidDateString(endDateTime)) {
    throw new Error("Invalid datetime format. Use ISO string (e.g., 2025-09-05T13:40:00Z)");
  }



  const start = new Date(startDateTime);
  const end = new Date(endDateTime);


  // 2. Start must be before end
  if (start >= end) {
    throw new Error("Start time must be before end time");
  }

  // 3. Cannot schedule in the past
  const now = new Date();
  if (start < now || end < now) {
    throw new Error("Class time cannot be in the past");
  }

  // 4. Duration must be exactly 50 minutes
  const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
  if (duration !== 50) {
    throw new Error("Class duration must be exactly 50 minutes");
  }


    if (start.getHours() < 6 || end.getHours() > 22) {
        throw new Error("Class time must be between 06:00 and 22:00 IST");
    }


  // 6. Overlap check with 10 minutes buffer
  const buffer = 10 * 60 * 1000; // 10 minutes in milliseconds
  const isOverlapping = await classSessionRepo.getOverlappingClassSession(center_id, new Date(start.getTime() - buffer), new Date(end.getTime() + buffer));
  if (isOverlapping) {
    throw new Error("Class session overlaps with an existing session");
  }

  // 7. Holiday check (range-based)
  const isHoliday = await holidayRepo.isHoliday(center_id, start);
  if (isHoliday) {
    throw new Error("Class session falls on a holiday");
  }

  return true; // ✅ All checks passed
}

    async isHoldingClassSession(center_id: number, startDateTime: Date, endDateTime: Date) {
        return await holidayRepo.isHoliday(center_id, startDateTime);
    }
}
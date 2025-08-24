// dtos/gymCenter.dto.ts
export interface CreateGymCenterInputDto {
  center_name: string;
  location: string;
  contact_no: string;
  manager_id: number; // 👈 just the FK to users.user_id
}
